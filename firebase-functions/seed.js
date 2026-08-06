
const MOCK_DEBATES = [
  {
    id: "debate-1",
    title: "Should artificial intelligence be granted copyright for original artwork?",
    category: "Ethics",
    creatorId: "user-system",
    creatorName: "Town Hall Curator",
    isLocked: false,
    expirationTime: dateAhead(24),
    createdAt: dateAgo(24)
  },
  {
    id: "debate-2",
    title: "Is Universal Basic Income (UBI) viable in highly automated economies?",
    category: "Society",
    creatorId: "user-system",
    creatorName: "Town Hall Curator",
    isLocked: false,
    expirationTime: dateAhead(48),
    createdAt: dateAgo(48)
  },
  {
    id: "debate-3",
    title: "Will quantum computing render modern cryptography obsolete by 2030?",
    category: "Technology",
    creatorId: "user-system",
    creatorName: "Cybersecurity Board",
    isLocked: true,
    expirationTime: dateAgo(1),
    createdAt: dateAgo(72)
  }
];

const MOCK_ARGUMENTS = {
  "debate-1": [
    {
      id: "arg-1-1",
      text: "AI outputs are the result of complex neural computations initiated by human prompts, representing a new form of collaborative authorship.",
      side: "pro",
      authorId: "user-alice",
      authorName: "Alice Vance",
      authorBadges: ["verified_researcher"],
      upvotes: 4,
      downvotes: 1,
      consensusMetric: 13.0,
      evidence: [{ title: "The Philosophy of Prompt Artistry", url: "https://example.com/prompt-art" }],
      createdAt: dateAgo(12)
    },
    {
      id: "arg-1-2",
      text: "Without copyright protections, AI-driven creative industries will struggle to secure investment and scale their tools.",
      side: "pro",
      authorId: "user-bob",
      authorName: "Bob Smith",
      authorBadges: [],
      upvotes: 2,
      downvotes: 0,
      consensusMetric: 2.0,
      evidence: [],
      createdAt: dateAgo(8)
    },
    {
      id: "arg-1-3",
      text: "Copyright is fundamentally a human right designed to incentivize human creativity. Machine learning models do not have intent or expression.",
      side: "con",
      authorId: "user-carol",
      authorName: "Carol Danvers",
      authorBadges: ["verified_researcher"],
      upvotes: 6,
      downvotes: 0,
      consensusMetric: 18.0,
      evidence: [{ title: "WIPO Human Authorship Precedents", url: "https://example.com/wipo-human" }],
      createdAt: dateAgo(10)
    },
    {
      id: "arg-1-4",
      text: "AI models train on millions of copyrighted artworks without consent. Giving them copyright protection legitimizes systemic theft.",
      side: "con",
      authorId: "user-dave",
      authorName: "Dave Rogers",
      authorBadges: [],
      upvotes: 1,
      downvotes: 2,
      consensusMetric: -1.0,
      evidence: [],
      createdAt: dateAgo(5)
    }
  ],
  "debate-2": [
    {
      id: "arg-2-1",
      text: "Automation will eliminate administrative and labor-intensive jobs faster than new fields are created. UBI is the only floor to prevent mass destitution.",
      side: "pro",
      authorId: "user-elena",
      authorName: "Elena Rostova",
      authorBadges: [],
      upvotes: 5,
      downvotes: 1,
      consensusMetric: 4.0,
      evidence: [{ title: "McKinsey Automation Report 2026", url: "https://example.com/mckinsey-jobs" }],
      createdAt: dateAgo(20)
    },
    {
      id: "arg-2-2",
      text: "Funding UBI requires extreme tax hikes that could stifle economic growth and push manufacturing overseas, hurting working families.",
      side: "con",
      authorId: "user-frank",
      authorName: "Frank Miller",
      authorBadges: ["verified_researcher"],
      upvotes: 3,
      downvotes: 0,
      consensusMetric: 9.0,
      evidence: [],
      createdAt: dateAgo(15)
    }
  ],
  "debate-3": [
    {
      id: "arg-3-1",
      text: "Shor's algorithm running on a sufficiently coherent quantum computer can solve prime factorization in polynomial time, breaking RSA instantly.",
      side: "pro",
      authorId: "user-alice",
      authorName: "Alice Vance",
      authorBadges: ["verified_researcher"],
      upvotes: 8,
      downvotes: 0,
      consensusMetric: 20.0,
      evidence: [{ title: "NIST Post-Quantum Cryptography Roadmap", url: "https://example.com/nist-pqc" }],
      createdAt: dateAgo(50)
    }
  ]
};
