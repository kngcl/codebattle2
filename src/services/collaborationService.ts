export interface CollaborationUser {
  id: string;
  name: string;
  avatar: string;
  cursorPosition?: { line: number; column: number };
  selection?: { start: number; end: number };
  color: string;
  isActive: boolean;
  lastSeen: Date;
}

export interface CollaborationSession {
  id: string;
  challengeId: string;
  ownerId: string;
  users: CollaborationUser[];
  code: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  maxUsers: number;
}

export interface CodeChange {
  id: string;
  sessionId: string;
  userId: string;
  type: 'insert' | 'delete' | 'replace';
  position: number;
  content: string;
  timestamp: Date;
}

export interface CursorUpdate {
  userId: string;
  sessionId: string;
  line: number;
  column: number;
  selection?: { start: number; end: number };
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'code_execution';
}

class CollaborationService {
  private socket: WebSocket | null = null;
  private sessionId: string | null = null;
  private userId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000;
  private isConnected = false;
  
  // Event handlers
  private onSessionUpdateHandlers: ((session: CollaborationSession) => void)[] = [];
  private onCodeChangeHandlers: ((change: CodeChange) => void)[] = [];
  private onCursorUpdateHandlers: ((update: CursorUpdate) => void)[] = [];
  private onUserJoinedHandlers: ((user: CollaborationUser) => void)[] = [];
  private onUserLeftHandlers: ((userId: string) => void)[] = [];
  private onChatMessageHandlers: ((message: ChatMessage) => void)[] = [];
  private onConnectionChangeHandlers: ((connected: boolean) => void)[] = [];

  // Mock WebSocket URL (in a real app, this would be your WebSocket server)
  private readonly wsUrl = process.env.NODE_ENV === 'production' 
    ? 'wss://api.codebattle.com/ws' 
    : 'ws://localhost:8080/ws';

  async createSession(challengeId: string, userId: string, isPublic = false): Promise<string> {
    try {
      // Mock session creation
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const mockSession: CollaborationSession = {
        id: sessionId,
        challengeId,
        ownerId: userId,
        users: [],
        code: '',
        language: 'python',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic,
        maxUsers: 10
      };
      
      // Store in localStorage for mock purposes
      const sessions = this.getMockSessions();
      sessions[sessionId] = mockSession;
      localStorage.setItem('codebattle_collaboration_sessions', JSON.stringify(sessions));
      
      return sessionId;
    } catch (error) {
      console.error('Failed to create collaboration session:', error);
      throw error;
    }
  }

  async joinSession(sessionId: string, userId: string): Promise<CollaborationSession> {
    try {
      this.sessionId = sessionId;
      this.userId = userId;

      // In a real implementation, this would connect to WebSocket
      await this.connectWebSocket(sessionId, userId);
      
      // Mock session retrieval
      const sessions = this.getMockSessions();
      const session = sessions[sessionId];
      
      if (!session) {
        throw new Error('Session not found');
      }

      // Add user to session if not already present
      const existingUserIndex = session.users.findIndex(u => u.id === userId);
      const userColor = this.generateUserColor();
      
      if (existingUserIndex === -1) {
        const newUser: CollaborationUser = {
          id: userId,
          name: `User_${userId.slice(0, 8)}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
          color: userColor,
          isActive: true,
          lastSeen: new Date()
        };
        
        session.users.push(newUser);
        this.notifyUserJoined(newUser);
      } else {
        session.users[existingUserIndex].isActive = true;
        session.users[existingUserIndex].lastSeen = new Date();
      }
      
      sessions[sessionId] = session;
      localStorage.setItem('codebattle_collaboration_sessions', JSON.stringify(sessions));
      
      return session;
    } catch (error) {
      console.error('Failed to join collaboration session:', error);
      throw error;
    }
  }

  async leaveSession(): Promise<void> {
    if (!this.sessionId || !this.userId) return;

    try {
      // Mock leaving session
      const sessions = this.getMockSessions();
      const session = sessions[this.sessionId];
      
      if (session) {
        const userIndex = session.users.findIndex(u => u.id === this.userId);
        if (userIndex !== -1) {
          session.users[userIndex].isActive = false;
          session.users[userIndex].lastSeen = new Date();
        }
        
        sessions[this.sessionId] = session;
        localStorage.setItem('codebattle_collaboration_sessions', JSON.stringify(sessions));
        
        this.notifyUserLeft(this.userId);
      }
      
      this.disconnectWebSocket();
      this.sessionId = null;
      this.userId = null;
    } catch (error) {
      console.error('Failed to leave session:', error);
      throw error;
    }
  }

  sendCodeChange(change: Omit<CodeChange, 'id' | 'sessionId' | 'userId' | 'timestamp'>): void {
    if (!this.sessionId || !this.userId || !this.isConnected) return;

    const fullChange: CodeChange = {
      id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date(),
      ...change
    };

    // In a real implementation, send via WebSocket
    this.mockBroadcastChange(fullChange);
  }

  sendCursorUpdate(line: number, column: number, selection?: { start: number; end: number }): void {
    if (!this.sessionId || !this.userId || !this.isConnected) return;

    const update: CursorUpdate = {
      userId: this.userId,
      sessionId: this.sessionId,
      line,
      column,
      selection,
      timestamp: new Date()
    };

    // In a real implementation, send via WebSocket
    this.mockBroadcastCursorUpdate(update);
  }

  sendChatMessage(message: string): void {
    if (!this.sessionId || !this.userId || !this.isConnected) return;

    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: this.sessionId,
      userId: this.userId,
      userName: `User_${this.userId.slice(0, 8)}`,
      message,
      timestamp: new Date(),
      type: 'text'
    };

    // In a real implementation, send via WebSocket
    this.mockBroadcastChatMessage(chatMessage);
  }

  // Event subscription methods
  onSessionUpdate(handler: (session: CollaborationSession) => void): () => void {
    this.onSessionUpdateHandlers.push(handler);
    return () => {
      const index = this.onSessionUpdateHandlers.indexOf(handler);
      if (index > -1) this.onSessionUpdateHandlers.splice(index, 1);
    };
  }

  onCodeChange(handler: (change: CodeChange) => void): () => void {
    this.onCodeChangeHandlers.push(handler);
    return () => {
      const index = this.onCodeChangeHandlers.indexOf(handler);
      if (index > -1) this.onCodeChangeHandlers.splice(index, 1);
    };
  }

  onCursorUpdate(handler: (update: CursorUpdate) => void): () => void {
    this.onCursorUpdateHandlers.push(handler);
    return () => {
      const index = this.onCursorUpdateHandlers.indexOf(handler);
      if (index > -1) this.onCursorUpdateHandlers.splice(index, 1);
    };
  }

  onUserJoined(handler: (user: CollaborationUser) => void): () => void {
    this.onUserJoinedHandlers.push(handler);
    return () => {
      const index = this.onUserJoinedHandlers.indexOf(handler);
      if (index > -1) this.onUserJoinedHandlers.splice(index, 1);
    };
  }

  onUserLeft(handler: (userId: string) => void): () => void {
    this.onUserLeftHandlers.push(handler);
    return () => {
      const index = this.onUserLeftHandlers.indexOf(handler);
      if (index > -1) this.onUserLeftHandlers.splice(index, 1);
    };
  }

  onChatMessage(handler: (message: ChatMessage) => void): () => void {
    this.onChatMessageHandlers.push(handler);
    return () => {
      const index = this.onChatMessageHandlers.indexOf(handler);
      if (index > -1) this.onChatMessageHandlers.splice(index, 1);
    };
  }

  onConnectionChange(handler: (connected: boolean) => void): () => void {
    this.onConnectionChangeHandlers.push(handler);
    return () => {
      const index = this.onConnectionChangeHandlers.indexOf(handler);
      if (index > -1) this.onConnectionChangeHandlers.splice(index, 1);
    };
  }

  isSessionActive(): boolean {
    return this.isConnected && !!this.sessionId;
  }

  getCurrentSession(): CollaborationSession | null {
    if (!this.sessionId) return null;
    
    const sessions = this.getMockSessions();
    return sessions[this.sessionId] || null;
  }

  // Private methods
  private async connectWebSocket(sessionId: string, userId: string): Promise<void> {
    try {
      // Mock WebSocket connection
      await new Promise(resolve => setTimeout(resolve, 500));
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifyConnectionChange(true);
      
      // Start mock activity simulation
      this.startMockActivity();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.scheduleReconnect();
    }
  }

  private disconnectWebSocket(): void {
    this.isConnected = false;
    this.notifyConnectionChange(false);
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }

    setTimeout(() => {
      this.reconnectAttempts++;
      if (this.sessionId && this.userId) {
        this.connectWebSocket(this.sessionId, this.userId);
      }
    }, this.reconnectInterval * Math.pow(2, this.reconnectAttempts));
  }

  private getMockSessions(): { [key: string]: CollaborationSession } {
    try {
      const stored = localStorage.getItem('codebattle_collaboration_sessions');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private generateUserColor(): string {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
      '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private startMockActivity(): void {
    // Simulate occasional cursor updates and users joining/leaving
    const interval = setInterval(() => {
      if (!this.isConnected) {
        clearInterval(interval);
        return;
      }

      // Simulate random cursor updates
      if (Math.random() < 0.1) {
        const mockUpdate: CursorUpdate = {
          userId: 'mock_user_' + Math.floor(Math.random() * 3),
          sessionId: this.sessionId!,
          line: Math.floor(Math.random() * 20) + 1,
          column: Math.floor(Math.random() * 50) + 1,
          timestamp: new Date()
        };
        this.onCursorUpdateHandlers.forEach(handler => handler(mockUpdate));
      }
    }, 5000);
  }

  private mockBroadcastChange(change: CodeChange): void {
    // Simulate network delay
    setTimeout(() => {
      this.onCodeChangeHandlers.forEach(handler => handler(change));
    }, 50 + Math.random() * 100);
  }

  private mockBroadcastCursorUpdate(update: CursorUpdate): void {
    // Don't broadcast own cursor updates back
    if (update.userId === this.userId) return;
    
    setTimeout(() => {
      this.onCursorUpdateHandlers.forEach(handler => handler(update));
    }, 20 + Math.random() * 50);
  }

  private mockBroadcastChatMessage(message: ChatMessage): void {
    setTimeout(() => {
      this.onChatMessageHandlers.forEach(handler => handler(message));
    }, 30 + Math.random() * 100);
  }

  private notifyUserJoined(user: CollaborationUser): void {
    this.onUserJoinedHandlers.forEach(handler => handler(user));
  }

  private notifyUserLeft(userId: string): void {
    this.onUserLeftHandlers.forEach(handler => handler(userId));
  }

  private notifyConnectionChange(connected: boolean): void {
    this.onConnectionChangeHandlers.forEach(handler => handler(connected));
  }
}

export const collaborationService = new CollaborationService();