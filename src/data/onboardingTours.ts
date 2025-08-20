export interface OnboardingStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  action?: () => void;
}

export const mainTour: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to CodeBattle!',
    content: 'Let\'s take a quick tour to help you get started with the platform. This logo will take you back to the home page anytime.',
    target: 'a[href="/"]', // Logo link
    placement: 'bottom'
  },
  {
    id: 'navigation',
    title: 'Navigation Menu',
    content: 'Here you\'ll find all the main sections: Challenges to solve coding problems, Tournaments for competitions, Live for real-time coding, and Leaderboard to see rankings.',
    target: '.hidden.md\\:flex .flex.items-center.space-x-8', // Desktop navigation
    placement: 'bottom'
  },
  {
    id: 'search',
    title: 'Quick Search',
    content: 'Use this search bar to quickly find challenges, tournaments, or other content. Pro tip: Press Cmd/Ctrl+K to open it from anywhere!',
    target: 'button[title="Search challenges..."], .max-w-md button', // Search button
    placement: 'bottom'
  },
  {
    id: 'user-menu',
    title: 'User Menu',
    content: 'Access your profile, settings, and account options here. You\'ll also see notifications and can logout when needed.',
    target: '.hidden.md\\:flex.items-center.space-x-4', // User menu area
    placement: 'bottom'
  },
  {
    id: 'challenges',
    title: 'Start with Challenges',
    content: 'Ready to code? Click on Challenges to browse coding problems organized by difficulty and topic. Perfect for practicing your skills!',
    target: 'a[href="/challenges"]',
    placement: 'bottom',
    action: () => {
      // Optional: Could navigate to challenges page
    }
  },
  {
    id: 'tournaments',
    title: 'Join Tournaments',
    content: 'Feel competitive? Tournaments let you compete against other developers in real-time. Check the schedule and join upcoming events!',
    target: 'a[href="/tournaments"]',
    placement: 'bottom'
  },
  {
    id: 'live-coding',
    title: 'Live Coding Sessions',
    content: 'Join live coding sessions to practice with others, participate in group challenges, and learn from the community.',
    target: 'a[href="/live"]',
    placement: 'bottom'
  },
  {
    id: 'leaderboard',
    title: 'Track Your Progress',
    content: 'The Leaderboard shows how you rank against other users. Solve challenges and participate in tournaments to climb the rankings!',
    target: 'a[href="/leaderboard"]',
    placement: 'bottom'
  }
];

export const challengesTour: OnboardingStep[] = [
  {
    id: 'challenge-list',
    title: 'Browse Challenges',
    content: 'Here you\'ll find all available coding challenges. Each card shows the difficulty level, topic, and how many people have solved it.',
    target: '.grid.grid-cols-1', // Challenge grid
    placement: 'top'
  },
  {
    id: 'filters',
    title: 'Filter Challenges',
    content: 'Use these filters to find challenges by difficulty, topic, or status. Great for focusing on specific areas you want to improve.',
    target: '.flex.flex-wrap.gap-2', // Filter buttons
    placement: 'bottom'
  },
  {
    id: 'challenge-card',
    title: 'Challenge Details',
    content: 'Each challenge card shows important information: difficulty level, success rate, topic tags, and participant count. Click to start solving!',
    target: '.bg-gray-900\\/60:first-child', // First challenge card
    placement: 'right'
  }
];

export const profileTour: OnboardingStep[] = [
  {
    id: 'profile-stats',
    title: 'Your Statistics',
    content: 'Track your coding journey with detailed statistics: problems solved, tournaments joined, current ranking, and more.',
    target: '.grid.grid-cols-1.md\\:grid-cols-3', // Stats grid
    placement: 'bottom'
  },
  {
    id: 'activity-chart',
    title: 'Activity Tracking',
    content: 'This chart shows your coding activity over time. Stay consistent to see your progress grow!',
    target: '.bg-gray-900\\/60.backdrop-blur-sm', // Activity chart container
    placement: 'top'
  },
  {
    id: 'achievements',
    title: 'Achievements & Badges',
    content: 'Earn achievements and badges by completing challenges, participating in tournaments, and reaching milestones.',
    target: '.space-y-4:last-child', // Achievements section
    placement: 'left'
  }
];

export const getTourByPage = (pathname: string): OnboardingStep[] | null => {
  switch (pathname) {
    case '/':
      return mainTour;
    case '/challenges':
      return challengesTour;
    case '/profile':
      return profileTour;
    default:
      return null;
  }
};