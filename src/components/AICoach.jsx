import React, { useState, useEffect, useRef } from 'react';
import { googleAIService } from '../services/googleAIService';
import {
  saveChatMessage,
  listenToChatMessages,
} from '../services/firebaseClient';

const AICoach = ({ user, teamContext = {} }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user?.uid) return;
    const sessionId = 'session_001';
    const unsub = listenToChatMessages(user.uid, sessionId, items => {
      setMessages(
        items.map(m => ({
          id: m.id,
          type: m.role === 'assistant' ? 'coach' : 'user',
          text: m.text,
          timestamp: m.createdAt?.toDate?.() || new Date(),
        }))
      );
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const sessionId = 'session_001';
    await saveChatMessage(user.uid, sessionId, {
      role: 'user',
      text: inputMessage,
    });
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simula typing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await googleAIService.chatWithCoach(
        inputMessage,
        teamContext
      );

      await saveChatMessage(user.uid, sessionId, {
        role: 'assistant',
        text: response,
      });
    } catch (error) {
      console.error('❌ Chat error:', error);

      await saveChatMessage(user.uid, sessionId, {
        role: 'assistant',
        text: '❌ Scusa, ho avuto un problema. Riprova tra un momento!',
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'coach',
        text: '🏆 Chat resettata! Come posso aiutarti?',
        timestamp: new Date(),
      },
    ]);
  };

  const styles = {
    container: {
      backgroundColor: '#1F2937',
      borderRadius: '0.75rem',
      height: '600px',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #374151',
    },
    header: {
      backgroundColor: '#374151',
      padding: '1rem',
      borderRadius: '0.75rem 0.75rem 0 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #4B5563',
    },
    title: {
      color: '#E5E7EB',
      fontSize: '1.25rem',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    clearButton: {
      backgroundColor: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    message: {
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'flex-start',
    },
    userMessage: {
      flexDirection: 'row-reverse',
    },
    messageContent: {
      maxWidth: '80%',
      padding: '0.75rem 1rem',
      borderRadius: '1rem',
      fontSize: '0.875rem',
      lineHeight: '1.5',
      whiteSpace: 'pre-wrap',
    },
    userMessageContent: {
      backgroundColor: '#3B82F6',
      color: 'white',
      borderBottomRightRadius: '0.25rem',
    },
    coachMessageContent: {
      backgroundColor: '#374151',
      color: '#E5E7EB',
      borderBottomLeftRadius: '0.25rem',
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1rem',
      fontWeight: 'bold',
      flexShrink: 0,
    },
    userAvatar: {
      backgroundColor: '#3B82F6',
      color: 'white',
    },
    coachAvatar: {
      backgroundColor: '#10B981',
      color: 'white',
    },
    inputContainer: {
      padding: '1rem',
      borderTop: '1px solid #374151',
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'flex-end',
    },
    input: {
      flex: 1,
      backgroundColor: '#374151',
      border: '1px solid #4B5563',
      borderRadius: '0.5rem',
      padding: '0.75rem',
      color: '#E5E7EB',
      fontSize: '0.875rem',
      resize: 'none',
      minHeight: '40px',
      maxHeight: '120px',
    },
    sendButton: {
      backgroundColor: '#10B981',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.75rem 1.5rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.2s',
    },
    sendButtonDisabled: {
      backgroundColor: '#6B7280',
      cursor: 'not-allowed',
    },
    typingIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#9CA3AF',
      fontSize: '0.875rem',
      fontStyle: 'italic',
    },
    typingDots: {
      display: 'flex',
      gap: '0.25rem',
    },
    typingDot: {
      width: '4px',
      height: '4px',
      backgroundColor: '#9CA3AF',
      borderRadius: '50%',
      animation: 'typing 1.4s infinite ease-in-out',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>🤖 Coach Virtuale eFootball</div>
        <button style={styles.clearButton} onClick={clearChat}>
          🗑️ Pulisci Chat
        </button>
      </div>

      {/* Messages */}
      <div style={styles.messagesContainer}>
        {messages.map(message => (
          <div
            key={message.id}
            style={{
              ...styles.message,
              ...(message.type === 'user' ? styles.userMessage : {}),
            }}
          >
            <div
              style={{
                ...styles.avatar,
                ...(message.type === 'user'
                  ? styles.userAvatar
                  : styles.coachAvatar),
              }}
            >
              {message.type === 'user' ? '👤' : '🤖'}
            </div>
            <div
              style={{
                ...styles.messageContent,
                ...(message.type === 'user'
                  ? styles.userMessageContent
                  : styles.coachMessageContent),
              }}
            >
              {message.text}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div style={styles.message}>
            <div style={styles.coachAvatar}>🤖</div>
            <div style={styles.typingIndicator}>
              Coach sta scrivendo
              <div style={styles.typingDots}>
                <div style={styles.typingDot}></div>
                <div
                  style={{ ...styles.typingDot, animationDelay: '0.2s' }}
                ></div>
                <div
                  style={{ ...styles.typingDot, animationDelay: '0.4s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={styles.inputContainer}>
        <textarea
          style={styles.input}
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Scrivi la tua domanda al coach..."
          disabled={isLoading}
          rows={1}
        />
        <button
          style={{
            ...styles.sendButton,
            ...(isLoading ? styles.sendButtonDisabled : {}),
          }}
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
        >
          {isLoading ? '⏳' : '🚀'} Invia
        </button>
      </div>

      <style jsx>{`
        @keyframes typing {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AICoach;
