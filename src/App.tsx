import { useState, useEffect } from "react";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc, 
  deleteDoc,
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Timestamp,
  addDoc,
  runTransaction
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { 
  auth, 
  db, 
  functions, 
  onAuthStateChanged, 
  signInAnonymously,
  googleProvider
} from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";

import type { UserProfile, Debate, Argument, Rebuttal, VoteRecord, Source } from "./types";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { DebateCard } from "./components/DebateCard";
import { AuthModal } from "./components/AuthModal";
import { CreateDebateModal } from "./components/CreateDebateModal";
import { DebateDetail } from "./components/DebateDetail";
import { Toast } from "./components/Toast";

import { 
  Plus, 
  BookOpen, 
  Search,
  ChevronDown,
  Check
} from "lucide-react";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayNameInput, setDisplayNameInput] = useState("");

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState("");

  const [isCreatingDebateModalOpen, setIsCreatingDebateModalOpen] = useState(false);
  const [debates, setDebates] = useState<Debate[]>([]);
  const [selectedDebate, setSelectedDebate] = useState<Debate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  
  const [newDebateTitle, setNewDebateTitle] = useState("");
  const [newDebateDescription, setNewDebateDescription] = useState("");
  const [newDebateCategory, setNewDebateCategory] = useState("Society");
  const [newDebateDuration, setNewDebateDuration] = useState("none");
  const [isCreatingDebate, setIsCreatingDebate] = useState(false);
  const [debateError, setDebateError] = useState("");

  const [proArguments, setProArguments] = useState<Argument[]>([]);
  const [conArguments, setConArguments] = useState<Argument[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, VoteRecord>>({});
  
  const [proArgText, setProArgText] = useState("");
  const [proSources, setProSources] = useState<Source[]>([{ title: "", url: "" }]);
  const [isSubmittingPro, setIsSubmittingPro] = useState(false);
  const [proError, setProError] = useState("");

  const [conArgText, setConArgText] = useState("");
  const [conSources, setConSources] = useState<Source[]>([{ title: "", url: "" }]);
  const [isSubmittingCon, setIsSubmittingCon] = useState(false);
  const [conError, setConError] = useState("");

  const handleAddSource = (side: "pro" | "con") => {
    if (side === "pro") {
      setProSources(prev => [...prev, { title: "", url: "" }]);
    } else {
      setConSources(prev => [...prev, { title: "", url: "" }]);
    }
  };

  const handleUpdateSource = (
    side: "pro" | "con",
    index: number,
    field: "title" | "url",
    value: string
  ) => {
    if (side === "pro") {
      setProSources(prev => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    } else {
      setConSources(prev => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    }
  };

  const handleRemoveSource = (side: "pro" | "con", index: number) => {
    if (side === "pro") {
      setProSources(prev => prev.filter((_, i) => i !== index));
    } else {
      setConSources(prev => prev.filter((_, i) => i !== index));
    }
  };

  const [rebuttalsMap, setRebuttalsMap] = useState<Record<string, Rebuttal[]>>({});
  const [openRebuttalArgId, setOpenRebuttalArgId] = useState<string | null>(null);
  const [rebuttalInput, setRebuttalInput] = useState("");
  const [isSubmittingRebuttal, setIsSubmittingRebuttal] = useState(false);
  const [rebuttalError, setRebuttalError] = useState("");

  const CATEGORIES = ["All", "Society", "Technology", "Philosophy", "Science", "Entertainment", "Politics", "Miscellaneous"];

  const getAnonymousName = (uid: string) => {
    let hash = 0;
    for (let i = 0; i < uid.length; i++) {
      hash = (hash << 5) - hash + uid.charCodeAt(i);
      hash |= 0;
    }
    const num = (Math.abs(hash) % 899999) + 100000;
    return `anonymous_${num}`;
  };

  const isUserSignedIn = Boolean(user && !user.isAnonymous);

  // Auth + Debates listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.isAnonymous) {
          const anonName = getAnonymousName(currentUser.uid);
          setProfile({
            uid: currentUser.uid,
            displayName: anonName,
            createdAt: serverTimestamp(),
          });
        } else {
          const userDocRef = doc(db, "agora-debates_users", currentUser.uid);
          onSnapshot(userDocRef, async (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setProfile({
                uid: currentUser.uid,
                displayName: data.displayName || "Debater_" + currentUser.uid.substring(0, 4),
                createdAt: data.createdAt,
              });
              setDisplayNameInput(data.displayName || "");
            } else {
              const defaultName = currentUser.displayName || currentUser.email?.split("@")[0] || "Debater_" + currentUser.uid.substring(0, 4);
              const newProfile: UserProfile = {
                uid: currentUser.uid,
                displayName: defaultName,
                createdAt: serverTimestamp(),
              };
              await setDoc(userDocRef, newProfile).catch(() => {});
              setProfile(newProfile);
              setDisplayNameInput(defaultName);
            }
          }, (err) => {
            console.warn("User profile snapshot warning:", err);
          });
        }
      } else {
        try {
          await signInAnonymously(auth);
        } catch (error: any) {
          console.warn("Firebase Auth fallback to local guest mode:", error?.message || error);
          const guestId = "guest_" + Math.random().toString(36).substring(2, 8);
          setUser({ uid: guestId, isAnonymous: true } as any);
          setProfile({
            uid: guestId,
            displayName: getAnonymousName(guestId),
            createdAt: serverTimestamp(),
          });
        }
      }
    });

    const qDebates = query(collection(db, "agora-debates_debates"), orderBy("createdAt", "desc"));
    const unsubscribeDebates = onSnapshot(qDebates, async (snapshot) => {
      const list: Debate[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Debate);
      });
      setDebates(list);
      
      const pathParts = window.location.pathname.split("/debates/");
      const debateIdFromPath = pathParts[1] ? pathParts[1].replace(/\/$/, "") : null;
      if (debateIdFromPath) {
        const found = list.find(d => d.id === debateIdFromPath);
        if (found) setSelectedDebate(found);
      } else if (selectedDebate) {
        const updated = list.find(d => d.id === selectedDebate.id);
        if (updated) setSelectedDebate(updated);
      }
    }, async (err) => {
      console.warn("Debates snapshot warning, falling back to direct fetch:", err);
      try {
        const { getDocs } = await import("firebase/firestore");
        const snapshot = await getDocs(qDebates);
        const list: Debate[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Debate);
        });
        setDebates(list);
      } catch (fetchErr) {
        console.error("Failed to fallback fetch debates:", fetchErr);
      }
    });

    const handlePopState = () => {
      const pathParts = window.location.pathname.split("/debates/");
      const debateIdFromPath = pathParts[1] ? pathParts[1].replace(/\/$/, "") : null;
      if (!debateIdFromPath) {
        setSelectedDebate(null);
      }
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      unsubscribeAuth();
      unsubscribeDebates();
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (selectedDebate) {
      document.title = `Agora Debates | ${selectedDebate.title}`;
    } else {
      document.title = "Agora Debates";
    }
  }, [selectedDebate]);

  const selectDebate = (debate: Debate | null) => {
    setSelectedDebate(debate);
    if (debate) {
      window.history.pushState({}, "", `/debates/${debate.id}`);
    } else {
      window.history.pushState({}, "", "/");
    }
  };

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleShareDebate = () => {
    if (!selectedDebate) return;
    const shareUrl = `${window.location.origin}/debates/${selectedDebate.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setToast({ message: "Debate link copied to clipboard!", type: "success" });
    }).catch(() => {
      setToast({ message: `Share URL: ${shareUrl}`, type: "info" });
    });
  };

  useEffect(() => {
    if (!selectedDebate) return;

    const argsRef = collection(db, "agora-debates_debates", selectedDebate.id, "arguments");
    const q = query(argsRef, orderBy("consensusMetric", "desc"));
    
    const unsubscribeArgs = onSnapshot(q, (snapshot) => {
      const pros: Argument[] = [];
      const cons: Argument[] = [];
      snapshot.forEach((docSnap) => {
        const arg = { id: docSnap.id, ...docSnap.data() } as Argument;
        if (arg.side === "pro") pros.push(arg);
        else cons.push(arg);
      });
      const getNetVotes = (a: Argument) => (typeof a.consensusMetric === 'number' ? a.consensusMetric : ((a.upvotes || 0) - (a.downvotes || 0)));
      pros.sort((a, b) => getNetVotes(b) - getNetVotes(a));
      cons.sort((a, b) => getNetVotes(b) - getNetVotes(a));

      setProArguments(pros);
      setConArguments(cons);
    }, (err) => {
      console.warn("Arguments snapshot warning:", err);
    });

    const unsubscribers: (() => void)[] = [];
    const setupVoteListeners = (args: Argument[]) => {
      args.forEach(arg => {
        if (!user) return;
        const voteRef = doc(db, "agora-debates_debates", selectedDebate.id, "arguments", arg.id, "votes", user.uid);
        const unsub = onSnapshot(voteRef, (snap) => {
          if (snap.exists()) {
            setUserVotes(prev => ({
              ...prev,
              [arg.id]: snap.data() as VoteRecord
            }));
          } else {
            setUserVotes(prev => {
              const updated = { ...prev };
              delete updated[arg.id];
              return updated;
            });
          }
        }, (err) => {
          console.warn("Vote snapshot warning:", err);
        });
        unsubscribers.push(unsub);
      });
    };

    const unsubTotal = onSnapshot(argsRef, (snap) => {
      unsubscribers.forEach(u => u());
      const activeArgs: Argument[] = [];
      snap.forEach(d => {
        activeArgs.push({ id: d.id, ...d.data() } as Argument);
      });
      setupVoteListeners(activeArgs);
    }, (err) => {
      console.warn("Total args snapshot warning:", err);
    });

    return () => {
      unsubscribeArgs();
      unsubTotal();
      unsubscribers.forEach((u) => u());
    };
  }, [selectedDebate, user]);

  useEffect(() => {
    if (!selectedDebate || !openRebuttalArgId) return;

    const rebuttalsRef = collection(
      db, 
      "agora-debates_debates", 
      selectedDebate.id, 
      "arguments", 
      openRebuttalArgId, 
      "rebuttals"
    );
    const q = query(rebuttalsRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Rebuttal[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Rebuttal);
      });
      setRebuttalsMap(prev => ({
        ...prev,
        [openRebuttalArgId]: list
      }));

      snapshot.forEach(rebuttal => {
        if (!user) return;
        const voteRef = doc(
          db, 
          "agora-debates_debates", 
          selectedDebate.id, 
          "arguments", 
          openRebuttalArgId, 
          "rebuttals", 
          rebuttal.id, 
          "votes", 
          user.uid
        );
        onSnapshot(voteRef, (vSnap) => {
          if (vSnap.exists()) {
            setUserVotes(prev => ({
              ...prev,
              [rebuttal.id]: vSnap.data() as VoteRecord
            }));
          }
        });
      });
    });

    return () => unsubscribe();
  }, [selectedDebate, openRebuttalArgId, user]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        const defaultName = authEmail.split("@")[0] || "User";
        const userDocRef = doc(db, "agora-debates_users", cred.user.uid);
        await setDoc(userDocRef, {
          uid: cred.user.uid,
          displayName: defaultName,
          createdAt: serverTimestamp(),
        });
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      }
      setIsAuthModalOpen(false);
      setAuthEmail("");
      setAuthPassword("");
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed.");
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { uid, email, displayName } = result.user;
      const userDocRef = doc(db, "agora-debates_users", uid);
      const snap = await getDoc(userDocRef);
      if (!snap.exists()) {
        await setDoc(userDocRef, {
          uid,
          displayName: displayName || email?.split("@")[0] || "User",
          createdAt: serverTimestamp(),
        });
      }
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setAuthError(err.message || "Google Sign-in failed");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Sign out failed", e);
    }
  };

  const handleUpdateDisplayName = async (newName?: string) => {
    const val = (newName !== undefined ? newName : displayNameInput).trim();
    if (!isUserSignedIn || !val) return;
    try {
      if (!user) return;
      const userDocRef = doc(db, "agora-debates_users", user.uid);
      await updateDoc(userDocRef, {
        displayName: val
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateDebate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUserSignedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!newDebateTitle.trim() || !profile || !user) return;
    
    setIsCreatingDebate(true);
    setDebateError("");

    let expirationTime = null;
    if (newDebateDuration !== "none") {
      const durationMinutes = parseInt(newDebateDuration, 10);
      if (!isNaN(durationMinutes)) {
        expirationTime = Timestamp.fromDate(new Date(Date.now() + durationMinutes * 60 * 1000));
      }
    }

    try {
      const debatesColl = collection(db, "agora-debates_debates");
      const payload: any = {
        title: newDebateTitle.trim(),
        category: newDebateCategory,
        creatorId: user.uid,
        creatorName: profile.displayName,
        isLocked: false,
        expirationTime: expirationTime,
        createdAt: serverTimestamp()
      };
      if (newDebateDescription.trim()) {
        payload.description = newDebateDescription.trim();
      }

      const docRef = await addDoc(debatesColl, payload);

      const createdDebate: Debate = {
        id: docRef.id,
        title: newDebateTitle.trim(),
        description: newDebateDescription.trim() || undefined,
        category: newDebateCategory,
        creatorId: user.uid,
        creatorName: profile.displayName,
        isLocked: false,
        expirationTime: expirationTime,
        createdAt: new Date()
      };

      setNewDebateTitle("");
      setNewDebateDescription("");
      setNewDebateDuration("none");
      setIsCreatingDebateModalOpen(false);
      selectDebate(createdDebate);
    } catch (err: any) {
      setDebateError(err.message || "Failed to create debate topic.");
    } finally {
      setIsCreatingDebate(false);
    }
  };

  const handleSubmitArgument = async (side: "pro" | "con") => {
    if (!selectedDebate || !profile || !user) return;
    
    const isPro = side === "pro";
    const text = isPro ? proArgText : conArgText;
    const sources = isPro ? proSources : conSources;
    const setSubmitting = isPro ? setIsSubmittingPro : setIsSubmittingCon;
    const setError = isPro ? setProError : setConError;

    if (!text.trim()) {
      setError("Argument text is required.");
      return;
    }

    setSubmitting(true);
    setError("");

    const evidenceList: Source[] = [];
    for (const src of sources) {
      const cleanTitle = src.title.trim();
      let cleanUrl = src.url.trim();
      if (cleanTitle || cleanUrl) {
        if (!cleanUrl) {
          cleanUrl = "#";
        } else if (!/^https?:\/\//i.test(cleanUrl) && cleanUrl !== "#") {
          cleanUrl = "https://" + cleanUrl;
        }
        evidenceList.push({
          title: cleanTitle || cleanUrl,
          url: cleanUrl
        });
      }
    }

    try {
      const argsColl = collection(db, "agora-debates_debates", selectedDebate.id, "arguments");
      await addDoc(argsColl, {
        text: text.trim(),
        side: side,
        authorId: user.uid,
        authorName: profile.displayName,
        upvotes: 0,
        downvotes: 0,
        consensusMetric: 0,
        evidence: evidenceList,
        createdAt: serverTimestamp()
      });

      if (isPro) {
        setProArgText("");
        setProSources([{ title: "", url: "" }]);
      } else {
        setConArgText("");
        setConSources([{ title: "", url: "" }]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to post argument.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitRebuttal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebate || !openRebuttalArgId || !rebuttalInput.trim() || !profile || !user) return;

    setIsSubmittingRebuttal(true);
    setRebuttalError("");

    try {
      const rebuttalsColl = collection(
        db, 
        "agora-debates_debates", 
        selectedDebate.id, 
        "arguments", 
        openRebuttalArgId, 
        "rebuttals"
      );
      await addDoc(rebuttalsColl, {
        text: rebuttalInput.trim(),
        authorId: user.uid,
        authorName: profile.displayName,
        upvotes: 0,
        downvotes: 0,
        consensusMetric: 0,
        createdAt: serverTimestamp()
      });
      setRebuttalInput("");
    } catch (err: any) {
      setRebuttalError(err.message || "Failed to submit rebuttal.");
    } finally {
      setIsSubmittingRebuttal(false);
    }
  };

  const handleDeleteDebate = async (debateToDelete: Debate) => {
    if (!user || user.uid !== debateToDelete.creatorId) return;

    try {
      const debateRef = doc(db, "agora-debates_debates", debateToDelete.id);
      await deleteDoc(debateRef);
      setToast({ message: `Deleted debate "${debateToDelete.title}"`, type: "success" });
      if (selectedDebate && selectedDebate.id === debateToDelete.id) {
        selectDebate(null);
      }
    } catch (err: any) {
      console.error("Failed to delete debate:", err);
      setToast({ message: "Failed to delete debate: " + (err.message || "Permission denied."), type: "error" });
    }
  };

  const handleDeleteArgument = async (argToDelete: Argument) => {
    if (!user || !selectedDebate || user.uid !== argToDelete.authorId) return;

    try {
      const argRef = doc(db, "agora-debates_debates", selectedDebate.id, "arguments", argToDelete.id);
      await deleteDoc(argRef);
      setToast({ message: "Argument deleted.", type: "success" });
    } catch (err: any) {
      console.error("Failed to delete argument:", err);
      setToast({ message: "Failed to delete argument: " + (err.message || "Permission denied."), type: "error" });
    }
  };

  const handleVote = async (argumentId: string, voteType: "up" | "down", rebuttalId?: string) => {
    if (!selectedDebate || !profile || !user) return;

    const targetId = rebuttalId || argumentId;
    const existing = userVotes[targetId];
    const typeToSend = (existing && existing.type === voteType) ? "unvote" : voteType;

    let callableSuccess = false;
    try {
      const voteFn = httpsCallable(functions, "agoraDebatesVote");
      await voteFn({
        debateId: selectedDebate.id,
        argumentId,
        rebuttalId,
        voteType: typeToSend
      });
      callableSuccess = true;
    } catch (err: any) {
      console.warn("Cloud function vote failed, attempting direct Firestore transaction:", err);
    }

    if (callableSuccess) return;

    try {
      const argRef = doc(db, "agora-debates_debates", selectedDebate.id, "arguments", argumentId);
      const targetRef = rebuttalId
        ? doc(db, "agora-debates_debates", selectedDebate.id, "arguments", argumentId, "rebuttals", rebuttalId)
        : argRef;

      const voteRef = rebuttalId
        ? doc(db, "agora-debates_debates", selectedDebate.id, "arguments", argumentId, "rebuttals", rebuttalId, "votes", user.uid)
        : doc(db, "agora-debates_debates", selectedDebate.id, "arguments", argumentId, "votes", user.uid);

      await runTransaction(db, async (transaction) => {
        const targetSnap = await transaction.get(targetRef);
        if (!targetSnap.exists()) return;

        const voteSnap = await transaction.get(voteRef);
        const currentVote = voteSnap.exists() ? voteSnap.data() : null;

        const targetData = targetSnap.data();
        let upvotes = targetData.upvotes || 0;
        let downvotes = targetData.downvotes || 0;

        if (typeToSend === "unvote") {
          if (currentVote?.type === "up") upvotes = Math.max(0, upvotes - 1);
          if (currentVote?.type === "down") downvotes = Math.max(0, downvotes - 1);
          transaction.delete(voteRef);
        } else {
          if (!currentVote) {
            if (typeToSend === "up") upvotes += 1;
            if (typeToSend === "down") downvotes += 1;
          } else if (currentVote.type !== typeToSend) {
            if (typeToSend === "up") {
              upvotes += 1;
              downvotes = Math.max(0, downvotes - 1);
            } else {
              downvotes += 1;
              upvotes = Math.max(0, upvotes - 1);
            }
          }
          transaction.set(voteRef, {
            type: typeToSend,
            voterId: user.uid,
            createdAt: serverTimestamp()
          });
        }

        const consensusMetric = upvotes - downvotes;
        transaction.update(targetRef, {
          upvotes,
          downvotes,
          consensusMetric
        });
      });
    } catch (err: any) {
      console.error("Direct vote transaction error:", err);
      setToast({ message: "Voting failed: " + (err.message || "Failed to record vote."), type: "error" });
    }
  };

  const isDebateExpired = (debate: Debate) => {
    if (!debate.expirationTime) return false;
    const expDate = debate.expirationTime instanceof Timestamp
      ? debate.expirationTime.toDate() 
      : new Date(debate.expirationTime);
    return Date.now() > expDate.getTime();
  };

  const formatExpiration = (debate: Debate) => {
    if (!debate.expirationTime) return "No expiration";
    const date = debate.expirationTime instanceof Timestamp
      ? debate.expirationTime.toDate()
      : new Date(debate.expirationTime);
    return date.toLocaleString();
  };

  const filteredDebates = debates.filter(d => {
    const matchesCategory = categoryFilter === "All" || d.category === categoryFilter;
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (d.description && d.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          d.creatorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      <Navbar
        user={user}
        profile={profile}
        displayNameInput={displayNameInput}
        onDisplayNameChange={(val) => {
          setDisplayNameInput(val);
          if (val.trim()) {
            handleUpdateDisplayName(val.trim());
          }
        }}
        isUserSignedIn={isUserSignedIn}
        onHomeClick={() => selectDebate(null)}
        onOpenAuth={() => { setIsAuthModalOpen(true); setIsSignUp(false); setAuthError(""); }}
        onSignOut={handleSignOut}
      />

      {/* Main Content View */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        
        {!selectedDebate ? (
          <section>
            {/* Registry Header Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', margin: 0, textTransform: 'none', letterSpacing: 'normal' }}>Debate Registry</h2>
                <p className="meta" style={{ color: 'var(--color-fg-muted)', margin: '0.25rem 0 0 0' }}>
                  Browse active topics or select one to view and contribute arguments.
                </p>
              </div>

              <button 
                className="btn btn-primary" 
                onClick={() => {
                  if (!isUserSignedIn) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsCreatingDebateModalOpen(true);
                  }
                }}
              >
                <Plus size={16} /> Start New Debate
              </button>
            </div>

            {/* Filters and Search Bar */}
            <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
              
              {/* Search Input */}
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  className="input"
                  style={{ paddingLeft: '2.3rem', width: '100%' }}
                  placeholder="Search debate topics, descriptions, or creators..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Custom Category Dropdown */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="meta" style={{ fontWeight: 600, color: 'var(--color-fg-muted)' }}>Category:</span>
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="btn"
                  style={{
                    padding: '0.5rem 0.85rem',
                    fontSize: '0.85rem',
                    minWidth: '170px',
                    justifyContent: 'space-between',
                    backgroundColor: '#ffffff',
                    borderColor: isCategoryDropdownOpen ? 'var(--color-primary)' : 'var(--color-border)',
                    boxShadow: isCategoryDropdownOpen ? '0 0 0 3px rgba(37, 99, 235, 0.15)' : 'var(--shadow-sm)'
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{categoryFilter}</span>
                  <ChevronDown size={14} style={{
                    transform: isCategoryDropdownOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                    color: 'var(--color-fg-muted)'
                  }} />
                </button>

                {isCategoryDropdownOpen && (
                  <>
                    <div 
                      onClick={() => setIsCategoryDropdownOpen(false)}
                      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      right: 0,
                      width: '190px',
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-md)',
                      padding: '0.35rem',
                      zIndex: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.15rem'
                    }}>
                      {CATEGORIES.map(cat => {
                        const isSelected = categoryFilter === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setCategoryFilter(cat);
                              setIsCategoryDropdownOpen(false);
                            }}
                            className="btn btn-ghost btn-sm"
                            style={{
                              width: '100%',
                              justifyContent: 'space-between',
                              padding: '0.45rem 0.65rem',
                              borderRadius: '6px',
                              backgroundColor: isSelected ? 'var(--color-primary-subtle)' : 'transparent',
                              color: isSelected ? 'var(--color-primary)' : 'var(--color-fg)',
                              fontWeight: isSelected ? 700 : 500
                            }}
                          >
                            <span>{cat}</span>
                            {isSelected && <Check size={14} color="var(--color-primary)" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Debates List / Grid */}
            {filteredDebates.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-fg-muted)' }}>
                <BookOpen size={36} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                <p style={{ margin: 0, fontWeight: 500 }}>No debates found matching your search.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                {filteredDebates.map((d) => (
                  <DebateCard 
                    key={d.id}
                    debate={d}
                    onSelectDebate={selectDebate}
                    isExpired={isDebateExpired(d)}
                    formatExpiration={formatExpiration}
                    currentUserId={user?.uid}
                    onDelete={(_e, debateToDelete) => handleDeleteDebate(debateToDelete)}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          /* DEBATE VIEW */
          <DebateDetail 
            debate={selectedDebate}
            onBack={() => selectDebate(null)}
            onShare={handleShareDebate}
            isExpired={isDebateExpired(selectedDebate)}
            formatExpiration={formatExpiration}
            proArguments={proArguments}
            conArguments={conArguments}
            userVotes={userVotes}
            onVote={handleVote}
            openRebuttalArgId={openRebuttalArgId}
            setOpenRebuttalArgId={setOpenRebuttalArgId}
            rebuttalsMap={rebuttalsMap}
            setRebuttalsMap={setRebuttalsMap}
            currentUserId={user?.uid}
            onDeleteDebate={handleDeleteDebate}
            onDeleteArgument={handleDeleteArgument}
            proArgText={proArgText}
            setProArgText={setProArgText}
            proSources={proSources}
            onAddProSource={() => handleAddSource("pro")}
            onUpdateProSource={(i, f, v) => handleUpdateSource("pro", i, f, v)}
            onRemoveProSource={(i) => handleRemoveSource("pro", i)}
            isSubmittingPro={isSubmittingPro}
            proError={proError}
            onSubmitPro={() => handleSubmitArgument("pro")}
            conArgText={conArgText}
            setConArgText={setConArgText}
            conSources={conSources}
            onAddConSource={() => handleAddSource("con")}
            onUpdateConSource={(i, f, v) => handleUpdateSource("con", i, f, v)}
            onRemoveConSource={(i) => handleRemoveSource("con", i)}
            isSubmittingCon={isSubmittingCon}
            conError={conError}
            onSubmitCon={() => handleSubmitArgument("con")}
            rebuttalInput={rebuttalInput}
            setRebuttalInput={setRebuttalInput}
            isSubmittingRebuttal={isSubmittingRebuttal}
            rebuttalError={rebuttalError}
            onSubmitRebuttal={handleSubmitRebuttal}
          />
        )}
      </main>

      <Footer />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        isSignUp={isSignUp}
        setIsSignUp={setIsSignUp}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        authError={authError}
        setAuthError={setAuthError}
        onSubmit={handleAuthSubmit}
        onGoogleSignIn={handleGoogleSignIn}
      />

      {/* Start New Debate Modal */}
      <CreateDebateModal 
        isOpen={isCreatingDebateModalOpen}
        onClose={() => setIsCreatingDebateModalOpen(false)}
        title={newDebateTitle}
        setTitle={setNewDebateTitle}
        description={newDebateDescription}
        setDescription={setNewDebateDescription}
        category={newDebateCategory}
        setCategory={setNewDebateCategory}
        duration={newDebateDuration}
        setDuration={setNewDebateDuration}
        isCreating={isCreatingDebate}
        error={debateError}
        onSubmit={handleCreateDebate}
        categories={CATEGORIES}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
