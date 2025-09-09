'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, User, Bot, History, Plus, Settings, Phone, Mail, Clock, ShoppingCart, Wrench, HelpCircle, FileText, Star } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  id: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

const CHAT_SESSIONS_KEY = 'chatbot_sessions';

function ChatMessage({ message }: { message: Message }) {
  const messageDate = new Date(message.timestamp);
  return (
    <div className={`flex gap-3 mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      {message.role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
        <div className={`p-4 rounded-2xl shadow-sm transition-all hover:shadow-md ${
          message.role === 'user' 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : 'bg-gray-100 text-gray-800 rounded-bl-md border border-gray-200'
        }`}>
          <div className="text-sm leading-relaxed">{message.content}</div>
        </div>
        <div className="text-xs text-gray-500 mt-2 px-2">
          {messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      {message.role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 order-2 shadow-sm">
          <User className="h-4 w-4 text-gray-600" />
        </div>
      )}
    </div>
  );
}

export function Chatbot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentSession, setCurrentSession] = useState<ChatSession>(() => ({
    id: Date.now().toString(),
    title: 'New Chat',
    messages: [{
      role: 'assistant',
      content: 'Hi there! 👋 Welcome to our customer support. I\'m here to help you with any questions or concerns. How can I assist you today?',
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    }],
    createdAt: new Date().toISOString()
  }));
  
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CHAT_SESSIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickResponses, setShowQuickResponses] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { icon: ShoppingCart, title: "Product & Pricing", options: [
      "I'm looking for a specific product",
      "I need a quote/price estimate", 
      "Trade pricing inquiry",
      "Bulk order discount",
      "Product comparison help"
    ]},
    { icon: Wrench, title: "Technical Support", options: [
      "Installation assistance needed",
      "Part compatibility check",
      "Technical specifications",
      "Troubleshooting help",
      "Maintenance guidance"
    ]},
    { icon: FileText, title: "Orders & Delivery", options: [
      "Track my order status",
      "Modify existing order",
      "Delivery information",
      "Return/exchange request",
      "Invoice or receipt needed"
    ]},
    { icon: HelpCircle, title: "General Support", options: [
      "Account assistance",
      "Payment methods inquiry",
      "Warranty information",
      "Business hours/contact",
      "General question"
    ]}
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession.messages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  const handleQuickResponse = (response: string) => {
    const userMessage: Message = { 
      role: 'user', 
      content: response,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };
    
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage]
    };
    setCurrentSession(updatedSession);
    setShowQuickResponses(false);
    setShowCategories(false);
    setIsLoading(true);
    
    setTimeout(() => {
      const botResponse = generateBotResponse(response);
      const botMessage: Message = {
        role: 'assistant',
        content: botResponse,
        timestamp: new Date().toISOString(),
        id: (Date.now() + 1).toString()
      };
      
      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, botMessage],
        title: response.substring(0, 30) + (response.length > 30 ? '...' : '')
      };
      
      setCurrentSession(finalSession);
      setIsLoading(false);
      
      // Save to sessions
      setChatSessions(prev => {
        const existing = prev.find(s => s.id === finalSession.id);
        if (existing) {
          return prev.map(s => s.id === finalSession.id ? finalSession : s);
        }
        return [finalSession, ...prev];
      });
    }, 1200);
  };

  const generateBotResponse = (userMessage: string): string => {
    const responses: { [key: string]: string } = {
      "I'm looking for a specific product": "I'd be happy to help you find the right product! Could you please tell me more details about what you're looking for? For example, the product category, brand preferences, or specific features you need?",
      "I need a quote/price estimate": "I can help you get a detailed quote. Please provide me with the product details, quantities needed, and your location for shipping. I'll get you the most competitive pricing available.",
      "Trade pricing inquiry": "Thank you for your interest in our trade pricing program! We offer special wholesale rates for qualified businesses. Could you please share your company details and the type of products you're interested in?",
      "Installation assistance needed": "I'm here to guide you through the installation process. Please let me know what product you're installing and any specific challenges you're facing. I can provide step-by-step guidance or connect you with our technical team.",
      "Part compatibility check": "I'll help verify compatibility for you. Please provide your vehicle/equipment details (make, model, year) and the part number or description you're considering. I'll check our compatibility database for you.",
      "Track my order status": "I can help you track your order right away. Please provide your order number or the email address associated with your purchase, and I'll give you the latest status and tracking information.",
      "Account assistance": "I'm here to help with your account. Whether you need to update information, reset your password, or have questions about your account features, I can assist you or direct you to the right team.",
      "General question": "I'm here to help with any questions you might have! Please feel free to ask about our products, services, policies, or anything else I can assist you with."
    };
    
    return responses[userMessage] || "Thank you for reaching out! I understand your inquiry and I'm here to help. Could you provide a bit more detail about what you need assistance with so I can give you the most accurate and helpful response?";
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const userMessage: Message = { 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };
    
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage]
    };
    setCurrentSession(updatedSession);
    setInput('');
    setIsLoading(true);
    setShowQuickResponses(false);
    setShowCategories(false);

    setTimeout(() => {
      const botMessage: Message = { 
        role: 'assistant', 
        content: "Thank you for your message! I've received your inquiry and I'm processing it now. Let me get the most accurate information for you or connect you with the right specialist who can provide detailed assistance.",
        timestamp: new Date().toISOString(),
        id: (Date.now() + 1).toString()
      };
      
      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, botMessage],
        title: input.trim().substring(0, 30) + (input.trim().length > 30 ? '...' : '')
      };
      
      setCurrentSession(finalSession);
      setIsLoading(false);
      
      // Save to sessions
      setChatSessions(prev => {
        const existing = prev.find(s => s.id === finalSession.id);
        if (existing) {
          return prev.map(s => s.id === finalSession.id ? finalSession : s);
        }
        return [finalSession, ...prev];
      });
    }, 1800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{
        role: 'assistant',
        content: 'Hi there! 👋 Welcome to our customer support. I\'m here to help you with any questions or concerns. How can I assist you today?',
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      }],
      createdAt: new Date().toISOString()
    };
    
    setCurrentSession(newSession);
    setShowQuickResponses(true);
    setShowCategories(true);
    setShowHistory(false);
  };

  const loadChatSession = (session: ChatSession) => {
    setCurrentSession(session);
    setShowHistory(false);
    setShowQuickResponses(false);
    setShowCategories(false);
  };

  const deleteChatSession = (sessionId: string) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSession.id === sessionId) {
      startNewChat();
    }
  };

  return (
    <Card className={`fixed bottom-20 right-4 w-96 h-[700px] flex flex-col shadow-2xl z-50 border-0 bg-white rounded-xl overflow-hidden transform transition-all duration-300 ease-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center backdrop-blur-sm">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Customer Support</CardTitle>
              <div className="text-sm text-blue-100 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Online now
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowHistory(!showHistory)} 
              className="text-white hover:bg-white hover:bg-opacity-20 p-2"
              title="Chat History"
            >
              <History className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={startNewChat} 
              className="text-white hover:bg-white hover:bg-opacity-20 p-2"
              title="New Chat"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="text-white hover:bg-white hover:bg-opacity-20 p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0 bg-gray-50">
        {showHistory ? (
          <div className="h-full p-4">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <History className="h-4 w-4" />
              Chat History
            </h3>
            <ScrollArea className="h-full">
              {chatSessions.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No chat history yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {chatSessions.map((session) => (
                    <div key={session.id} className="group">
                      <Button
                        variant="ghost"
                        className="w-full text-left p-3 h-auto hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg"
                        onClick={() => loadChatSession(session)}
                      >
                        <div className="flex justify-between items-start w-full">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-800 truncate">
                              {session.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(session.createdAt).toLocaleDateString()} • {session.messages.length} messages
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChatSession(session.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 h-auto text-red-500 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        ) : (
          <ScrollArea className="h-full w-full p-4">
            {currentSession.messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            
            {showCategories && (
              <div className="space-y-4 mt-4">
                <p className="text-sm text-gray-600 font-medium">What can I help you with?</p>
                {categories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                      <category.icon className="h-4 w-4" />
                      {category.title}
                    </div>
                    <div className="grid gap-1">
                      {category.options.map((option, optionIndex) => (
                        <Button
                          key={optionIndex}
                          variant="outline"
                          className="w-full text-left justify-start h-auto p-3 text-sm font-normal hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                          onClick={() => handleQuickResponse(option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {isLoading && (
              <div className="flex gap-3 mb-4 animate-fadeIn">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-bl-md p-4 max-w-[80%] shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
        )}
      </CardContent>
      
      <CardFooter className="p-0 bg-white border-t">
        {/* Input Area */}
        <div className="w-full p-4 space-y-3">
          <div className="flex w-full gap-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                placeholder="Type your message here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="w-full h-14 text-base px-4 pr-16 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl transition-all duration-200 placeholder-gray-500"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-white px-1">
                {input.length}/500
              </div>
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || input.trim() === ''}
              className="bg-blue-500 hover:bg-blue-600 px-6 h-14 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Footer Info */}
          <div className="flex items-center justify-between w-full pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Powered by Professional Support
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                24/7
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                4.9/5
              </span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function ChatbotTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 rounded-full p-4 shadow-lg z-50 bg-blue-500 hover:bg-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-xl"
        onClick={toggleChatbot}
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        )}
      </Button>
      <Chatbot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

<style jsx>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
`}</style>