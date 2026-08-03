  const voteRef = db.doc(voteDocPath);

  // 2. Fetch voter profile to calculate reliability weight
  const voterProfileRef = db.collection("agora-debates_users").doc(uid);
  const voterProfileSnap = await voterProfileRef.get();
  
  let reliabilityWeight = 1.0;
  const voterData = voterProfileSnap.exists ? voterProfileSnap.data()! : {};

  // Add weight for account age
  const createdAt = voterData.createdAt;
  if (createdAt) {
