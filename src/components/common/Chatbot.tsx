import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, User, Bot, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';

interface ChatbotSettings {
  welcome_message: string;
  fallback_message: string;
  is_enabled: boolean;
  auto_response_delay: number;
  human_handoff_threshold: number;
}

interface ChatbotScript {
  trigger_keywords: string[];
  response: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  const [scripts, setScripts] = useState<ChatbotScript[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [failedResponses, setFailedResponses] = useState(0);
  const [showHumanOption, setShowHumanOption] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchSettings();
    fetchScripts();
  }, []);

  useEffect(() => {
    if (isOpen && settings && messages.length === 0) {
      // Add welcome message when chat is opened
      addBotMessage(settings.welcome_message);
    }
  }, [isOpen, settings]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('chatbot_settings')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching chatbot settings:', error);
    }
  };

  const fetchScripts = async () => {
    try {
      const { data, error } = await supabase
        .from('chatbot_scripts')
        .select('trigger_keywords, response')
        .eq('is_active', true);

      if (error) throw error;
      setScripts(data || []);
    } catch (error) {
      console.error('Error fetching chatbot scripts:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    addUserMessage(input);
    setInput('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Process the message after a delay
    setTimeout(() => {
      processUserMessage(input.trim());
      setIsTyping(false);
    }, settings?.auto_response_delay || 1000);
  };

  const processUserMessage = (message: string) => {
    // Convert message to lowercase for matching
    const lowerMessage = message.toLowerCase();
    
    // Find matching script
    const matchingScript = scripts.find(script => 
      script.trigger_keywords.some(keyword => 
        lowerMessage.includes(keyword.toLowerCase())
      )
    );
    
    if (matchingScript) {
      // Reset failed responses counter
      setFailedResponses(0);
      setShowHumanOption(false);
      addBotMessage(matchingScript.response);
    } else {
      // Increment failed responses counter
      const newFailedCount = failedResponses + 1;
      setFailedResponses(newFailedCount);
      
      // Check if we should offer human support
      if (newFailedCount >= (settings?.human_handoff_threshold || 3)) {
        setShowHumanOption(true);
        addBotMessage(
          `${settings?.fallback_message || "I'm sorry, I don't understand."} Would you like to speak with a human agent?`
        );
      } else {
        addBotMessage(settings?.fallback_message || "I'm sorry, I don't understand.");
      }
    }
  };

  const handleHumanSupport = () => {
    addBotMessage("I'm connecting you with a customer support agent. Please allow 1-2 business days for a response via email.");
    // In a real implementation, this would create a support ticket
  };

  if (!settings?.is_enabled) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary-600 text-white rounded-full p-4 shadow-lg hover:bg-primary-700 transition-colors"
        aria-label="Open chat"
      >
        <MessageSquare size={24} />
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Chat header */}
          <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <Bot size={20} className="mr-2" />
              <h3 className="font-medium">MinddShopp Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Chat messages */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <div className="flex items-start">
                    {message.sender === 'bot' && (
                      <Bot size={16} className="mr-2 mt-1 flex-shrink-0" />
                    )}
                    <div dangerouslySetInnerHTML={{ __html: message.text }} />
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white text-gray-800 rounded-lg p-3 border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            {showHumanOption && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleHumanSupport}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700 transition-colors flex items-center"
                >
                  <User size={16} className="mr-2" />
                  Connect with Human Support
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <div className="p-4 border-t">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-primary-600 text-white px-4 py-2 rounded-r-md hover:bg-primary-700 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
              <span>Powered by MinddShopp AI</span>
              {user ? (
                <span>Logged in as {user.email}</span>
              ) : (
                <a href="/auth/signin" className="text-primary-600 hover:underline flex items-center">
                  <span>Sign in</span>
                  <ExternalLink size={12} className="ml-1" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;