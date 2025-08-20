import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Users, MessageSquare, Share, Wifi, WifiOff, UserPlus, Settings, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import AdvancedCodeEditor from '../CodeEditor/AdvancedCodeEditor';
import { 
  collaborationService, 
  CollaborationSession, 
  CollaborationUser, 
  CodeChange, 
  CursorUpdate,
  ChatMessage 
} from '../../services/collaborationService';

interface CollaborativeCodeEditorProps {
  challengeId: string;
  userId: string;
  initialCode?: string;
  language?: string;
  onCodeChange?: (code: string) => void;
  onSubmit?: (code: string, language: string) => void;
  height?: string;
}

const CollaborativeCodeEditor: React.FC<CollaborativeCodeEditorProps> = ({
  challengeId,
  userId,
  initialCode = '',
  language = 'python',
  onCodeChange,
  onSubmit,
  height = '500px'
}) => {
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [code, setCode] = useState(initialCode);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [cursors, setCursors] = useState<Map<string, CursorUpdate>>(new Map());
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  
  const { actualTheme } = useTheme();
  const { showSuccess, showError } = useToast();
  const isDark = actualTheme === 'dark';

  // Initialize collaboration
  useEffect(() => {
    const initializeCollaboration = async () => {
      try {
        setIsConnecting(true);
        
        // Check if there's an existing session in URL or create a new one
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session');
        
        let currentSessionId: string;
        if (sessionId) {
          // Join existing session
          const joinedSession = await collaborationService.joinSession(sessionId, userId);
          setSession(joinedSession);
          currentSessionId = sessionId;
          showSuccess('Joined session', 'Successfully joined collaboration session');
        } else {
          // Create new session
          currentSessionId = await collaborationService.createSession(challengeId, userId, true);
          const newSession = await collaborationService.joinSession(currentSessionId, userId);
          setSession(newSession);
          
          // Update URL with session ID
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('session', currentSessionId);
          window.history.replaceState({}, '', newUrl.toString());
          
          showSuccess('Session created', 'New collaboration session started');
        }
        
        setIsConnecting(false);
      } catch (error) {
        console.error('Failed to initialize collaboration:', error);
        showError('Connection failed', 'Could not start collaboration session');
        setIsConnecting(false);
      }
    };

    initializeCollaboration();

    // Cleanup on unmount
    return () => {
      collaborationService.leaveSession();
    };
  }, [challengeId, userId, showSuccess, showError]);

  // Subscribe to collaboration events
  useEffect(() => {
    if (!session) return;

    const unsubscribeConnection = collaborationService.onConnectionChange((connected) => {
      setIsConnected(connected);
      if (connected) {
        showSuccess('Connected', 'Real-time collaboration is active');
      } else {
        showError('Disconnected', 'Lost connection to collaboration server');
      }
    });

    const unsubscribeCodeChange = collaborationService.onCodeChange((change) => {
      if (change.userId !== userId) {
        applyCodeChange(change);
        if (soundEnabled) playNotificationSound('codeChange');
      }
    });

    const unsubscribeCursorUpdate = collaborationService.onCursorUpdate((update) => {
      if (update.userId !== userId) {
        setCursors(prev => new Map(prev.set(update.userId, update)));
        
        // Remove old cursor updates
        setTimeout(() => {
          setCursors(prev => {
            const updated = new Map(prev);
            updated.delete(update.userId);
            return updated;
          });
        }, 5000);
      }
    });

    const unsubscribeUserJoined = collaborationService.onUserJoined((user) => {
      setSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          users: [...prev.users.filter(u => u.id !== user.id), user]
        };
      });
      
      if (user.id !== userId) {
        showSuccess('User joined', `${user.name} joined the session`);
        if (soundEnabled) playNotificationSound('userJoined');
      }
    });

    const unsubscribeUserLeft = collaborationService.onUserLeft((leftUserId) => {
      setSession(prev => {
        if (!prev) return null;
        const user = prev.users.find(u => u.id === leftUserId);
        return {
          ...prev,
          users: prev.users.map(u => 
            u.id === leftUserId ? { ...u, isActive: false } : u
          )
        };
      });
      
      if (leftUserId !== userId) {
        const user = session.users.find(u => u.id === leftUserId);
        if (user) {
          showSuccess('User left', `${user.name} left the session`);
        }
      }
    });

    const unsubscribeChatMessage = collaborationService.onChatMessage((message) => {
      setChatMessages(prev => [...prev, message]);
      
      if (message.userId !== userId) {
        if (soundEnabled) playNotificationSound('chatMessage');
        
        // Show notification if chat is closed
        if (!showChat) {
          showSuccess('New message', `${message.userName}: ${message.message.substring(0, 50)}${message.message.length > 50 ? '...' : ''}`);
        }
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
  }, [session, userId, soundEnabled, showChat, showSuccess, showError]);

  const applyCodeChange = useCallback((change: CodeChange) => {
    setCode(currentCode => {
      let newCode: string;
      
      switch (change.type) {
        case 'insert':
          newCode = currentCode.slice(0, change.position) + change.content + currentCode.slice(change.position);
          break;
        case 'delete':
          newCode = currentCode.slice(0, change.position) + currentCode.slice(change.position + change.content.length);
          break;
        case 'replace':
          newCode = currentCode.slice(0, change.position) + change.content + currentCode.slice(change.position + (change.content.length));
          break;
        default:
          return currentCode;
      }
      
      onCodeChange?.(newCode);
      return newCode;
    });
  }, [onCodeChange]);

  const handleCodeChange = useCallback((newCode: string) => {
    const oldCode = code;
    setCode(newCode);
    onCodeChange?.(newCode);
    
    // Send code change to other users
    if (newCode !== oldCode) {
      const change = calculateCodeChange(oldCode, newCode);
      if (change) {
        collaborationService.sendCodeChange(change);
      }
    }
  }, [code, onCodeChange]);

  const calculateCodeChange = (oldCode: string, newCode: string): Omit<CodeChange, 'id' | 'sessionId' | 'userId' | 'timestamp'> | null => {
    // Simple diff algorithm - in production, use a more sophisticated approach like operational transforms
    if (newCode.length > oldCode.length) {
      // Find insertion point
      for (let i = 0; i < oldCode.length; i++) {
        if (oldCode[i] !== newCode[i]) {
          return {
            type: 'insert',
            position: i,
            content: newCode.slice(i, i + (newCode.length - oldCode.length))
          };
        }
      }
      // Insertion at the end
      return {
        type: 'insert',
        position: oldCode.length,
        content: newCode.slice(oldCode.length)
      };
    } else if (newCode.length < oldCode.length) {
      // Find deletion point
      for (let i = 0; i < newCode.length; i++) {
        if (oldCode[i] !== newCode[i]) {
          return {
            type: 'delete',
            position: i,
            content: oldCode.slice(i, i + (oldCode.length - newCode.length))
          };
        }
      }
      // Deletion at the end
      return {
        type: 'delete',
        position: newCode.length,
        content: oldCode.slice(newCode.length)
      };
    }
    
    // Same length - replacement
    for (let i = 0; i < oldCode.length; i++) {
      if (oldCode[i] !== newCode[i]) {
        // Find the end of the change
        let endIndex = i;
        while (endIndex < oldCode.length && oldCode[endIndex] !== newCode[endIndex]) {
          endIndex++;
        }
        
        return {
          type: 'replace',
          position: i,
          content: newCode.slice(i, endIndex)
        };
      }
    }
    
    return null;
  };

  const handleSendChatMessage = () => {
    if (!newChatMessage.trim()) return;
    
    collaborationService.sendChatMessage(newChatMessage);
    setNewChatMessage('');
    chatInputRef.current?.focus();
  };

  const shareSession = async () => {
    const sessionUrl = `${window.location.origin}${window.location.pathname}?session=${session?.id}`;
    
    try {
      await navigator.clipboard.writeText(sessionUrl);
      showSuccess('Link copied', 'Collaboration link copied to clipboard');
    } catch (error) {
      showError('Failed to copy', 'Could not copy session link');
    }
  };

  const playNotificationSound = (type: 'codeChange' | 'userJoined' | 'chatMessage') => {
    // Simple audio feedback
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
  };

  const activeUsers = session?.users.filter(u => u.isActive) || [];
  const unreadMessages = chatMessages.filter(m => m.userId !== userId && !showChat).length;

  return (
    <div className={`relative ${isDark ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-2xl border ${isDark ? 'border-gray-800' : 'border-gray-200'} overflow-hidden`}>
      {/* Collaboration Header */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} px-4 py-3 border-b flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-400" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-400" />
            )}
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {session && (
            <div className="flex items-center gap-1">
              {activeUsers.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden"
                  style={{ borderColor: user.color }}
                  title={user.name}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {activeUsers.length > 3 && (
                <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'} flex items-center justify-center text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  +{activeUsers.length - 3}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-all ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900'
            }`}
            title={soundEnabled ? 'Disable sounds' : 'Enable sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setShowUserList(!showUserList)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-sm">{activeUsers.length}</span>
          </button>
          
          <button
            onClick={() => setShowChat(!showChat)}
            className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </button>
          
          <button
            onClick={shareSession}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              isDark 
                ? 'bg-purple-700 hover:bg-purple-600 text-purple-200' 
                : 'bg-purple-200 hover:bg-purple-300 text-purple-700'
            }`}
          >
            <Share className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>

      <div className="relative flex">
        {/* Main Editor */}
        <div className="flex-1">
          <div ref={editorRef} className="relative">
            <AdvancedCodeEditor
              initialCode={code}
              language={language}
              onCodeChange={handleCodeChange}
              onSubmit={onSubmit}
              height={height}
              enableAutocomplete={true}
              enableBracketMatching={true}
            />
            
            {/* Collaborative Cursors */}
            {Array.from(cursors.entries()).map(([userId, cursor]) => {
              const user = session?.users.find(u => u.id === userId);
              if (!user) return null;
              
              return (
                <div
                  key={userId}
                  className="absolute pointer-events-none z-10"
                  style={{
                    top: `${cursor.line * 1.6}em`,
                    left: `${cursor.column * 0.6}em`,
                    transform: 'translateY(-2px)'
                  }}
                >
                  <div
                    className="w-0.5 h-5 animate-pulse"
                    style={{ backgroundColor: user.color }}
                  />
                  <div
                    className="absolute -top-6 left-0 px-2 py-1 rounded text-xs text-white whitespace-nowrap"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User List Panel */}
        {showUserList && (
          <div className={`w-64 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-l`}>
            <div className="p-4">
              <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Active Users ({activeUsers.length})
              </h3>
              <div className="space-y-2">
                {activeUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                      style={{ borderColor: user.color, borderWidth: 2 }}
                    />
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user.name}
                        {user.id === session?.ownerId && (
                          <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-black text-xs rounded">Owner</span>
                        )}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Active now
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Panel */}
        {showChat && (
          <div className={`w-80 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-l flex flex-col`}>
            <div className="p-4 border-b border-gray-700">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Chat
              </h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-3" style={{ height: height }}>
              {chatMessages.map((message) => {
                const user = session?.users.find(u => u.id === message.userId);
                return (
                  <div key={message.id} className="flex gap-3">
                    {user && (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-6 h-6 rounded-full flex-shrink-0"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {message.userName}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {message.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder="Type a message..."
                  className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <button
                  onClick={handleSendChatMessage}
                  disabled={!newChatMessage.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborativeCodeEditor;