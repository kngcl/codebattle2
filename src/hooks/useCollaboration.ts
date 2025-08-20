import { useState, useEffect, useCallback } from 'react';
import { 
  collaborationService, 
  CollaborationSession, 
  CollaborationUser, 
  CodeChange, 
  CursorUpdate,
  ChatMessage 
} from '../services/collaborationService';

export interface UseCollaborationOptions {
  challengeId: string;
  userId: string;
  onCodeChange?: (code: string) => void;
  onUserJoined?: (user: CollaborationUser) => void;
  onUserLeft?: (userId: string) => void;
  onChatMessage?: (message: ChatMessage) => void;
  enableSounds?: boolean;
}

export interface UseCollaborationResult {
  // Session state
  session: CollaborationSession | null;
  isConnected: boolean;
  isConnecting: boolean;
  
  // Users
  activeUsers: CollaborationUser[];
  currentUser: CollaborationUser | null;
  
  // Chat
  chatMessages: ChatMessage[];
  unreadCount: number;
  
  // Actions
  createSession: (isPublic?: boolean) => Promise<string>;
  joinSession: (sessionId: string) => Promise<void>;
  leaveSession: () => Promise<void>;
  sendChatMessage: (message: string) => void;
  sendCodeChange: (change: Omit<CodeChange, 'id' | 'sessionId' | 'userId' | 'timestamp'>) => void;
  sendCursorUpdate: (line: number, column: number, selection?: { start: number; end: number }) => void;
  shareSessionLink: () => Promise<void>;
  
  // UI state
  markChatAsRead: () => void;
}

export const useCollaboration = (options: UseCollaborationOptions): UseCollaborationResult => {
  const { challengeId, userId, onCodeChange, onUserJoined, onUserLeft, onChatMessage, enableSounds = true } = options;
  
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatReadTimestamp, setChatReadTimestamp] = useState<Date>(new Date());

  // Computed values
  const activeUsers = session?.users.filter(u => u.isActive) || [];
  const currentUser = session?.users.find(u => u.id === userId) || null;

  // Actions
  const createSession = useCallback(async (isPublic = false): Promise<string> => {
    setIsConnecting(true);
    try {
      const sessionId = await collaborationService.createSession(challengeId, userId, isPublic);
      const newSession = await collaborationService.joinSession(sessionId, userId);
      setSession(newSession);
      
      // Update URL with session ID
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('session', sessionId);
      window.history.replaceState({}, '', newUrl.toString());
      
      return sessionId;
    } finally {
      setIsConnecting(false);
    }
  }, [challengeId, userId]);

  const joinSession = useCallback(async (sessionId: string): Promise<void> => {
    setIsConnecting(true);
    try {
      const joinedSession = await collaborationService.joinSession(sessionId, userId);
      setSession(joinedSession);
      
      // Update URL with session ID
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('session', sessionId);
      window.history.replaceState({}, '', newUrl.toString());
    } finally {
      setIsConnecting(false);
    }
  }, [userId]);

  const leaveSession = useCallback(async (): Promise<void> => {
    await collaborationService.leaveSession();
    setSession(null);
    setIsConnected(false);
    setChatMessages([]);
    setUnreadCount(0);
    
    // Remove session from URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('session');
    window.history.replaceState({}, '', newUrl.toString());
  }, []);

  const sendChatMessage = useCallback((message: string): void => {
    collaborationService.sendChatMessage(message);
  }, []);

  const sendCodeChange = useCallback((change: Omit<CodeChange, 'id' | 'sessionId' | 'userId' | 'timestamp'>): void => {
    collaborationService.sendCodeChange(change);
  }, []);

  const sendCursorUpdate = useCallback((line: number, column: number, selection?: { start: number; end: number }): void => {
    collaborationService.sendCursorUpdate(line, column, selection);
  }, []);

  const shareSessionLink = useCallback(async (): Promise<void> => {
    if (!session) throw new Error('No active session');
    
    const sessionUrl = `${window.location.origin}${window.location.pathname}?session=${session.id}`;
    await navigator.clipboard.writeText(sessionUrl);
  }, [session]);

  const markChatAsRead = useCallback((): void => {
    setChatReadTimestamp(new Date());
    setUnreadCount(0);
  }, []);

  // Sound notification helper
  const playNotificationSound = useCallback((type: 'codeChange' | 'userJoined' | 'chatMessage'): void => {
    if (!enableSounds) return;
    
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      const frequencies = {
        codeChange: 800,
        userJoined: 600,
        chatMessage: 400
      };
      
      oscillator.frequency.setValueAtTime(frequencies[type], context.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.1);
    } catch (error) {
      // Audio context might not be available
      console.warn('Could not play notification sound:', error);
    }
  }, [enableSounds]);

  // Subscribe to collaboration events
  useEffect(() => {
    const unsubscribeConnection = collaborationService.onConnectionChange(setIsConnected);

    const unsubscribeCodeChange = collaborationService.onCodeChange((change) => {
      if (change.userId !== userId) {
        playNotificationSound('codeChange');
      }
    });

    const unsubscribeCursorUpdate = collaborationService.onCursorUpdate((update) => {
      // Cursor updates are handled by individual components
    });

    const unsubscribeUserJoined = collaborationService.onUserJoined((user) => {
      setSession(prev => {
        if (!prev) return null;
        const updated = {
          ...prev,
          users: [...prev.users.filter(u => u.id !== user.id), user]
        };
        return updated;
      });
      
      if (user.id !== userId) {
        playNotificationSound('userJoined');
        onUserJoined?.(user);
      }
    });

    const unsubscribeUserLeft = collaborationService.onUserLeft((leftUserId) => {
      setSession(prev => {
        if (!prev) return null;
        const updated = {
          ...prev,
          users: prev.users.map(u => 
            u.id === leftUserId ? { ...u, isActive: false } : u
          )
        };
        return updated;
      });
      
      if (leftUserId !== userId) {
        onUserLeft?.(leftUserId);
      }
    });

    const unsubscribeChatMessage = collaborationService.onChatMessage((message) => {
      setChatMessages(prev => [...prev, message]);
      
      if (message.userId !== userId) {
        playNotificationSound('chatMessage');
        setUnreadCount(prev => prev + 1);
        onChatMessage?.(message);
      }
    });

    return () => {
      unsubscribeConnection();
      unsubscribeCodeChange();
      unsubscribeCursorUpdate();
      unsubscribeUserJoined();
      unsubscribeUserLeft();
      unsubscribeChatMessage();
    };
  }, [userId, playNotificationSound, onUserJoined, onUserLeft, onChatMessage]);

  // Auto-initialize from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    
    if (sessionId && !session && !isConnecting) {
      joinSession(sessionId).catch(console.error);
    }
  }, [session, isConnecting, joinSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      collaborationService.leaveSession().catch(console.error);
    };
  }, []);

  return {
    // Session state
    session,
    isConnected,
    isConnecting,
    
    // Users
    activeUsers,
    currentUser,
    
    // Chat
    chatMessages,
    unreadCount,
    
    // Actions
    createSession,
    joinSession,
    leaveSession,
    sendChatMessage,
    sendCodeChange,
    sendCursorUpdate,
    shareSessionLink,
    
    // UI state
    markChatAsRead
  };
};