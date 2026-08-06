"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.agoraDebatesCheckExpirations = exports.agoraDebatesClaimBadge = exports.agoraDebatesVote = exports.agoraDebatesModerateRebuttal = exports.agoraDebatesModerateArgument = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-functions/v2/firestore");
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
// Toxicity / Flagged Keywords configuration
const FLAGGED_KEYWORDS = [
    "hate speech", "toxic", "idiot", "jerk", "spam", "scam",
    "asshole", "bastard", "moron", "retard", "stupid"
];
function containsToxicLanguage(text) {
    if (!text)
        return false;
    const lowerText = text.toLowerCase();
    return FLAGGED_KEYWORDS.some(word => lowerText.includes(word));
}
/**
 * Trigger to moderate toxic content in arguments
 */
exports.agoraDebatesModerateArgument = (0, firestore_1.onDocumentCreated)("agora-debates_debates/{debateId}/arguments/{argumentId}", async (event) => {
    const snap = event.data;
    if (!snap)
        return;
    const data = snap.data();
    const text = data.text || "";
    if (containsToxicLanguage(text)) {
        console.log(`Moderating toxic argument ${event.params.argumentId}`);
        await snap.ref.update({
            text: "[This argument was removed due to a community guidelines violation (toxic language detected).]",
            isModerated: true
        });
    }
});
/**
 * Trigger to moderate toxic content in rebuttals
 */
exports.agoraDebatesModerateRebuttal = (0, firestore_1.onDocumentCreated)("agora-debates_debates/{debateId}/arguments/{argumentId}/rebuttals/{rebuttalId}", async (event) => {
    const snap = event.data;
    if (!snap)
        return;
    const data = snap.data();
    const text = data.text || "";
    if (containsToxicLanguage(text)) {
        console.log(`Moderating toxic rebuttal ${event.params.rebuttalId}`);
        await snap.ref.update({
            text: "[This rebuttal was removed due to a community guidelines violation (toxic language detected).]",
            isModerated: true
        });
    }
});
/**
 * Callable function to process upvotes and downvotes.
 * Computes consensus metrics weighted by voter reliability.
 */
exports.agoraDebatesVote = (0, https_1.onCall)(async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
        throw new https_1.HttpsError("unauthenticated", "User must be authenticated to vote.");
    }
    const { debateId, argumentId, rebuttalId, voteType } = request.data;
    if (!debateId || !argumentId || !voteType) {
        throw new https_1.HttpsError("invalid-argument", "Missing required voting parameters.");
    }
    // 1. Determine paths
    const debateRef = db.collection("agora-debates_debates").doc(debateId);
    const argumentRef = debateRef.collection("arguments").doc(argumentId);
    const targetRef = rebuttalId
        ? argumentRef.collection("rebuttals").doc(rebuttalId)
        : argumentRef;
    const voteDocPath = rebuttalId
        ? `agora-debates_debates/${debateId}/arguments/${argumentId}/rebuttals/${rebuttalId}/votes/${uid}`
        : `agora-debates_debates/${debateId}/arguments/${argumentId}/votes/${uid}`;
    const voteRef = db.doc(voteDocPath);
    // 2. Fetch voter profile to calculate reliability weight
    const voterProfileRef = db.collection("agora-debates_users").doc(uid);
    const voterProfileSnap = await voterProfileRef.get();
    let reliabilityWeight = 1.0;
    const voterData = voterProfileSnap.exists ? voterProfileSnap.data() : {};
    // Add weight for account age
    const createdAt = voterData.createdAt;
    if (createdAt) {
        const createdDate = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
        const ageInMs = Date.now() - createdDate.getTime();
        const ageInDays = ageInMs / (1000 * 60 * 60 * 24);
        if (ageInDays > 30) {
            reliabilityWeight += 2.0;
        }
        else if (ageInDays > 7) {
            reliabilityWeight += 1.0;
        }
    }
    // Add weight for badges
    const badges = (voterData.badges || []);
    if (badges.includes("verified_researcher")) {
        reliabilityWeight += 3.0;
    }
    if (badges.includes("moderator") || voterData.role === "moderator") {
        reliabilityWeight += 5.0;
    }
    // 3. Process vote in a transaction
    return await db.runTransaction(async (transaction) => {
        // Check if debate is locked
        const debateSnap = await transaction.get(debateRef);
        if (!debateSnap.exists) {
            throw new https_1.HttpsError("not-found", "Debate topic not found.");
        }
        const debateData = debateSnap.data();
        const isLocked = debateData.isLocked || false;
        const expirationTime = debateData.expirationTime?.toDate ? debateData.expirationTime.toDate() : new Date(debateData.expirationTime);
        if (isLocked || Date.now() > expirationTime.getTime()) {
            throw new https_1.HttpsError("failed-precondition", "This debate has expired or is locked.");
        }
        // Check if target exists
        const targetSnap = await transaction.get(targetRef);
        if (!targetSnap.exists) {
            throw new https_1.HttpsError("not-found", "Target argument or rebuttal not found.");
        }
        const targetData = targetSnap.data();
        // Fetch existing vote
        const voteSnap = await transaction.get(voteRef);
        const existingVote = voteSnap.exists ? voteSnap.data() : null;
        let upvotesDiff = 0;
        let downvotesDiff = 0;
        let consensusMetricDiff = 0;
        const currentWeight = reliabilityWeight;
        if (voteType === "unvote") {
            if (existingVote) {
                transaction.delete(voteRef);
                if (existingVote.type === "up") {
                    upvotesDiff = -1;
                    consensusMetricDiff = -existingVote.weight;
                }
                else {
                    downvotesDiff = -1;
                    consensusMetricDiff = existingVote.weight;
                }
            }
        }
        else {
            // Upvote or Downvote
            transaction.set(voteRef, {
                type: voteType,
                weight: currentWeight,
                voterId: uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
            if (!existingVote) {
                if (voteType === "up") {
                    upvotesDiff = 1;
                    consensusMetricDiff = currentWeight;
                }
                else {
                    downvotesDiff = 1;
                    consensusMetricDiff = -currentWeight;
                }
            }
            else if (existingVote.type !== voteType) {
                // Vote type changed
                if (voteType === "up") {
                    upvotesDiff = 1;
                    downvotesDiff = -1;
                    // Add new weight and remove old weight
                    consensusMetricDiff = currentWeight + existingVote.weight;
                }
                else {
                    upvotesDiff = -1;
                    downvotesDiff = 1;
                    consensusMetricDiff = -(currentWeight + existingVote.weight);
                }
            }
            else {
                // Vote type is the same, but weight might have updated
                const weightDiff = currentWeight - existingVote.weight;
                if (weightDiff !== 0) {
                    consensusMetricDiff = voteType === "up" ? weightDiff : -weightDiff;
                }
            }
        }
        const currentUpvotes = (targetData.upvotes || 0) + upvotesDiff;
        const currentDownvotes = (targetData.downvotes || 0) + downvotesDiff;
        const currentConsensus = (targetData.consensusMetric || 0) + consensusMetricDiff;
        transaction.update(targetRef, {
            upvotes: Math.max(0, currentUpvotes),
            downvotes: Math.max(0, currentDownvotes),
            consensusMetric: currentConsensus
        });
        return {
            success: true,
            newUpvotes: Math.max(0, currentUpvotes),
            newDownvotes: Math.max(0, currentDownvotes),
            newConsensus: currentConsensus
        };
    });
});
/**
 * Callable function to claim badges based on account age.
 * Users can verify themselves if their profile age is > 2 minutes (simulating 30 days).
 */
exports.agoraDebatesClaimBadge = (0, https_1.onCall)(async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
        throw new https_1.HttpsError("unauthenticated", "User must be authenticated to claim badges.");
    }
    const { badge } = request.data;
    if (badge !== "verified_researcher") {
        throw new https_1.HttpsError("invalid-argument", "Requested badge is not claimable.");
    }
    const userRef = db.collection("agora-debates_users").doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
        throw new https_1.HttpsError("not-found", "User profile not found.");
    }
    const userData = userSnap.data();
    const createdAt = userData.createdAt;
    if (!createdAt) {
        throw new https_1.HttpsError("failed-precondition", "Creation timestamp missing from profile.");
    }
    const createdDate = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const ageInMs = Date.now() - createdDate.getTime();
    const ageInMinutes = ageInMs / (1000 * 60);
    // Requirement: at least 2 minutes for testing demo convenience
    if (ageInMinutes < 2) {
        throw new https_1.HttpsError("failed-precondition", `Your account must be at least 2 minutes old to claim verification (it is currently ${Math.floor(ageInMinutes * 10) / 10} minutes old).`);
    }
    const badges = (userData.badges || []);
    if (badges.includes("verified_researcher")) {
        return { success: true, message: "You are already a verified researcher." };
    }
    await userRef.update({
        badges: admin.firestore.FieldValue.arrayUnion("verified_researcher")
    });
    return { success: true, message: "Congratulations! You are now a verified researcher." };
});
/**
 * Callable function to check and lock expired debates
 */
exports.agoraDebatesCheckExpirations = (0, https_1.onCall)(async (request) => {
    const debatesSnap = await db.collection("agora-debates_debates")
        .where("isLocked", "==", false)
        .get();
    const now = Date.now();
    let lockedCount = 0;
    const batch = db.batch();
    debatesSnap.forEach(doc => {
        const data = doc.data();
        const expirationTime = data.expirationTime?.toDate ? data.expirationTime.toDate() : new Date(data.expirationTime);
        if (now > expirationTime.getTime()) {
            batch.update(doc.ref, { isLocked: true });
            lockedCount++;
        }
    });
    if (lockedCount > 0) {
        await batch.commit();
    }
    return { success: true, lockedCount };
});
//# sourceMappingURL=index.js.map