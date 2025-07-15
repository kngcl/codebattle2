export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  rating: number;
  solvedChallenges: number;
  joinedAt: string;
  avatar?: string;
  bio?: string;
  achievements: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  testCases: TestCase[];
  timeLimit: number;
  memoryLimit: number;
  createdAt: string;
  submissionCount: number;
  successRate: number;
  tags: string[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isPublic: boolean;
}

export interface Submission {
  id: string;
  challengeId: string;
  userId: string;
  code: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Pending';
  score: number;
  submittedAt: string;
  executionTime: number;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  challenges: string[];
  participants: TournamentParticipant[];
  status: 'upcoming' | 'active' | 'completed';
  prize: string;
  rules: string[];
}

export interface TournamentParticipant {
  userId: string;
  username: string;
  score: number;
  rank: number;
  completedChallenges: number;
}

// Mock data
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'CodeMaster',
    email: 'codemaster@example.com',
    role: 'admin',
    rating: 2450,
    solvedChallenges: 156,
    joinedAt: '2023-01-15T00:00:00Z',
    bio: 'Full-stack developer with 5+ years experience',
    achievements: ['First Place Winner', 'Problem Setter', 'Top Contributor']
  },
  {
    id: '2',
    username: 'AlgoNinja',
    email: 'algo@example.com',
    role: 'user',
    rating: 2100,
    solvedChallenges: 89,
    joinedAt: '2023-03-20T00:00:00Z',
    bio: 'Algorithms enthusiast',
    achievements: ['Speed Demon', 'Problem Solver']
  },
  {
    id: '3',
    username: 'DataWhiz',
    email: 'data@example.com',
    role: 'user',
    rating: 1950,
    solvedChallenges: 67,
    joinedAt: '2023-05-10T00:00:00Z',
    bio: 'Data structures expert',
    achievements: ['Consistent Performer']
  }
];

export const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
    category: 'Array',
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isPublic: true },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]', isPublic: true },
      { input: '[3,3]\n6', expectedOutput: '[0,1]', isPublic: false }
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    createdAt: '2023-01-01T00:00:00Z',
    submissionCount: 1543,
    successRate: 78.5,
    tags: ['Array', 'Hash Table']
  },
  {
    id: '2',
    title: 'Binary Tree Inorder Traversal',
    description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
    difficulty: 'Medium',
    category: 'Tree',
    testCases: [
      { input: '[1,null,2,3]', expectedOutput: '[1,3,2]', isPublic: true },
      { input: '[]', expectedOutput: '[]', isPublic: true },
      { input: '[1]', expectedOutput: '[1]', isPublic: false }
    ],
    timeLimit: 2000,
    memoryLimit: 512,
    createdAt: '2023-01-02T00:00:00Z',
    submissionCount: 892,
    successRate: 65.2,
    tags: ['Tree', 'Stack', 'Recursion']
  },
  {
    id: '3',
    title: 'Maximum Subarray',
    description: 'Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.',
    difficulty: 'Hard',
    category: 'Dynamic Programming',
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', isPublic: true },
      { input: '[1]', expectedOutput: '1', isPublic: true },
      { input: '[5,4,-1,7,8]', expectedOutput: '23', isPublic: false }
    ],
    timeLimit: 3000,
    memoryLimit: 1024,
    createdAt: '2023-01-03T00:00:00Z',
    submissionCount: 645,
    successRate: 52.8,
    tags: ['Array', 'Dynamic Programming']
  }
];

export const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: 'Spring Coding Championship',
    description: 'Annual spring championship with challenging problems',
    startDate: '2024-03-15T10:00:00Z',
    endDate: '2024-03-15T14:00:00Z',
    maxParticipants: 100,
    currentParticipants: 45,
    challenges: ['1', '2', '3'],
    participants: [
      { userId: '1', username: 'CodeMaster', score: 2850, rank: 1, completedChallenges: 3 },
      { userId: '2', username: 'AlgoNinja', score: 2650, rank: 2, completedChallenges: 3 },
      { userId: '3', username: 'DataWhiz', score: 2400, rank: 3, completedChallenges: 2 }
    ],
    status: 'upcoming',
    prize: '$500 + Trophy',
    rules: [
      'Each problem has a time limit',
      'Partial scoring based on test cases passed',
      'No external libraries allowed',
      'Code must be original'
    ]
  },
  {
    id: '2',
    name: 'Algorithm Sprint',
    description: 'Quick 2-hour algorithm challenge',
    startDate: '2024-02-20T18:00:00Z',
    endDate: '2024-02-20T20:00:00Z',
    maxParticipants: 50,
    currentParticipants: 32,
    challenges: ['1', '2'],
    participants: [
      { userId: '2', username: 'AlgoNinja', score: 1950, rank: 1, completedChallenges: 2 },
      { userId: '3', username: 'DataWhiz', score: 1850, rank: 2, completedChallenges: 2 },
      { userId: '1', username: 'CodeMaster', score: 1750, rank: 3, completedChallenges: 1 }
    ],
    status: 'completed',
    prize: '$200 + Certificate',
    rules: [
      'Time-based scoring',
      'Fastest correct solution wins',
      'Only standard libraries allowed'
    ]
  }
];

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    challengeId: '1',
    userId: '1',
    code: 'def twoSum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]',
    language: 'python',
    status: 'Accepted',
    score: 100,
    submittedAt: '2024-01-15T10:30:00Z',
    executionTime: 45
  },
  {
    id: '2',
    challengeId: '2',
    userId: '2',
    code: 'def inorderTraversal(root):\n    result = []\n    def inorder(node):\n        if node:\n            inorder(node.left)\n            result.append(node.val)\n            inorder(node.right)\n    inorder(root)\n    return result',
    language: 'python',
    status: 'Accepted',
    score: 95,
    submittedAt: '2024-01-16T14:15:00Z',
    executionTime: 78
  }
];

// Storage utilities
export const getStorageData = (key: string, defaultValue: any) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStorageData = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Initialize data in localStorage
export const initializeData = () => {
  if (!localStorage.getItem('codebattle_users')) {
    setStorageData('codebattle_users', mockUsers);
  }
  if (!localStorage.getItem('codebattle_challenges')) {
    setStorageData('codebattle_challenges', mockChallenges);
  }
  if (!localStorage.getItem('codebattle_tournaments')) {
    setStorageData('codebattle_tournaments', mockTournaments);
  }
  if (!localStorage.getItem('codebattle_submissions')) {
    setStorageData('codebattle_submissions', mockSubmissions);
  }
};