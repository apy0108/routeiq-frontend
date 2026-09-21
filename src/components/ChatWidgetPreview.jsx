import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, RotateCcw, AlertCircle } from 'lucide-react';
import { sendChatMessage } from '../api';

export default function ChatWidgetPreview({
  botName = 'ChatIQ Bot',
  welcomeMessage = 'Hello! How can I help you today?',
  primaryColor = '#4f46e5',
  position = 'bottom-right',
  botId = '',
  className = ''
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: welcomeMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => 'sess_' + Math.random().toString(36).substring(2, 9));
  const messagesEndRef = useRef(null);

  // Sync welcome message if user changes it
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'welcome-msg') {
        return [{
          id: 'welcome-msg',
          sender: 'bot',
          text: welcomeMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
      }
      return prev;
    });
  }, [welcomeMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputValue || !inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    const userMsg = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await sendChatMessage(botId, userText, sessionId);
      const botReply = res.reply || res.response || res.message || 'No response returned from the server.';
      
      setMessages(prev => [
        ...prev,
        {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: 'bot_err_' + Date.now(),
          sender: 'bot',
          text: 'Unable to connect. Make sure the bot is trained.',
          isError: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome-msg',
        sender: 'bot',
        text: welcomeMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className={`w-full max-w-sm mx-auto bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[480px] ${className}`}>
      
      {/* Widget Header with dynamic color */}
      <div
        className="px-4 py-3 text-white flex items-center justify-between transition-colors"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-tight">
              {botName || 'ChatIQ Assistant'}
            </h3>
            <p className="text-[11px] text-white/80">Online</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          title="Reset conversation"
          className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Position tag */}
      <div className="px-3 py-1 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <span>Position preview</span>
        <span className="font-mono text-gray-600 bg-gray-200/70 px-1.5 py-0.5 rounded text-[10px]">
          {position === 'bottom-left' ? 'Bottom Left' : 'Bottom Right'}
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'text-white'
                  : msg.isError
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
              }`}
              style={msg.sender === 'user' ? { backgroundColor: primaryColor } : {}}
            >
              {msg.isError && (
                <div className="flex items-center gap-1 font-semibold text-red-800 mb-0.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Connection Notice</span>
                </div>
              )}
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
            <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-2 w-16 text-gray-400">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:200ms]" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:400ms]" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form
        onSubmit={handleSend}
        className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isTyping}
          className="p-2 rounded-lg text-white disabled:opacity-40 transition-colors"
          style={{ backgroundColor: primaryColor }}
          title="Send message"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
