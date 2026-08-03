export interface UserProfile {
  uid: string;
  displayName: string;
  createdAt: any;
}

export interface Debate {
  id: string;
  title: string;
  description?: string;
  category: string;
  creatorId: string;
  creatorName: string;
  isLocked: boolean;
  expirationTime: any;
  createdAt: any;
}

export interface Source {
  title: string;
  url: string;
}

export interface Argument {
  id: string;
  text: string;
  side: "pro" | "con";
  authorId: string;
  authorName: string;
  upvotes: number;
  downvotes: number;
  consensusMetric: number;
  evidence: Source[];
  createdAt: any;
}

export interface Rebuttal {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  upvotes: number;
  downvotes: number;
  consensusMetric: number;
  createdAt: any;
}

export interface VoteRecord {
  type: "up" | "down";
  weight?: number;
}
