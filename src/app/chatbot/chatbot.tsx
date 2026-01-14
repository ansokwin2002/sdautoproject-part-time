'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, User, Bot, History, Plus, Settings, Phone, Mail, Clock, ShoppingCart, Wrench, HelpCircle, FileText, Star, Car, Truck, Zap, Search, DollarSign, Package, MapPin, CheckCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  id: string;
  options?: string[];
  isQuickSelect?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  currentFlow: string;
  flowData: any;
}

const CHAT_SESSIONS_KEY = 'automotive_chatbot_sessions';

// Professional conversation flows
const conversationFlows = {
  findParts: {
    title: "Find Car Parts",
    steps: {
      vehicleType: {
        question: "What type of vehicle are you looking for parts for?",
        options: ["Passenger Car", "Truck/SUV", "Motorcycle", "Commercial Vehicle"]
      },
      vehicleDetails: {
        question: "Please select your vehicle details:",
        options: ["Toyota", "Honda", "Ford", "BMW", "Mercedes", "Audi", "Volkswagen", "Nissan", "Other Brand"]
      },
      partCategory: {
        question: "What type of part do you need?",
        options: ["Engine Parts", "Brake System", "Suspension", "Electrical", "Body Parts", "Interior", "Exhaust System", "Transmission"]
      },
      specificPart: {
        question: "Which specific part are you looking for?",
        options: ["Brake Pads", "Oil Filter", "Air Filter", "Spark Plugs", "Battery", "Headlight", "Brake Discs", "I need help identifying"]
      }
    }
  },
  tradePrice: {
    title: "Trade Pricing",
    steps: {
      businessType: {
        question: "What type of business are you?",
        options: ["Auto Repair Shop", "Car Dealership", "Fleet Management", "Parts Retailer", "Individual Mechanic"]
      },
      volumeNeeds: {
        question: "What's your typical monthly parts volume?",
        options: ["Under £1,000", "£1,000 - £5,000", "£5,000 - £15,000", "Over £15,000"]
      },
      partTypes: {
        question: "Which part categories do you purchase most?",
        options: ["Engine Components", "Brake Systems", "Suspension Parts", "Electrical Components", "Body Parts", "Multiple Categories"]
      }
    }
  },
  orderTracking: {
    title: "Order Tracking",
    steps: {
      orderLookup: {
        question: "How would you like to track your order?",
        options: ["Order Number", "Email Address", "Phone Number", "Account Login"]
      },
      orderIssues: {
        question: "Are you experiencing any issues with your order?",
        options: ["Delivery Delay", "Wrong Item Received", "Missing Items", "Damaged Package", "No Issues - Just Checking"]
      }
    }
  },
  technical: {
    title: "Technical Support",
    steps: {
      issueType: {
        question: "What kind of technical support do you need?",
        options: ["Installation Guidance", "Part Compatibility", "Product Specifications", "Troubleshooting", "Maintenance Advice"]
      },
      urgency: {
        question: "How urgent is this matter?",
        options: ["Emergency (Vehicle Down)", "High Priority (Within 24hrs)", "Standard (This Week)", "Low Priority (When Convenient)"]
      }
    }
  },
  warranty: {
    title: "Warranty & Returns",
    steps: {
      issueType: {
        question: "What type of warranty or return issue?",
        options: ["Product Defect", "Wrong Part Ordered", "Part Doesn't Fit", "Warranty Claim", "Return Request"]
      },
      timeframe: {
        question: "When did you purchase/receive the item?",
        options: ["Within 7 Days", "1-4 Weeks Ago", "1-3 Months Ago", "3-12 Months Ago", "Over 1 Year Ago"]
      }
    }
  }
};

function ChatMessage({ message, onOptionSelect }: { message: Message; onOptionSelect?: (option: string) => void }) {
  const messageDate = new Date(message.timestamp);
  
  return (
    <div className={`flex gap-3 mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      {message.role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      <div className={`max-w-[85%] ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
        <div className={`p-4 rounded-2xl shadow-sm transition-all hover:shadow-md ${
          message.role === 'user' 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md' 
            : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
        }`}>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
          
          {message.options && message.isQuickSelect && onOptionSelect && (
            <div className="mt-4 grid gap-2">
              {message.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto p-3 bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300 text-blue-800 transition-all duration-200"
                  onClick={() => onOptionSelect(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-2 px-2">
          {messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
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
      content: 'Welcome to Professional Automotive Parts! 🚗\n\nI\'m your dedicated parts specialist, here to provide expert assistance with all your automotive needs.\n\nHow can I help you today?',
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    }],
    createdAt: new Date().toISOString(),
    currentFlow: '',
    flowData: {}
  }));
  
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const mainCategories = [
    { 
      icon: Search, 
      title: "Find Car Parts", 
      description: "Search for specific parts by vehicle",
      flow: "findParts",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    { 
      icon: DollarSign, 
      title: "Trade Pricing", 
      description: "Get wholesale pricing for businesses",
      flow: "tradePrice",
      color: "bg-green-500 hover:bg-green-600"
    },
    { 
      icon: Package, 
      title: "Track My Order", 
      description: "Check order status and delivery",
      flow: "orderTracking",
      color: "bg-orange-500 hover:bg-orange-600"
    },
    { 
      icon: Wrench, 
      title: "Technical Support", 
      description: "Installation and compatibility help",
      flow: "technical",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    { 
      icon: ShoppingCart, 
      title: "Warranty & Returns", 
      description: "Product warranty and return assistance",
      flow: "warranty",
      color: "bg-red-500 hover:bg-red-600"
    },
    { 
      icon: Phone, 
      title: "Speak to Expert", 
      description: "Connect with our parts specialists",
      flow: "expert",
      color: "bg-indigo-500 hover:bg-indigo-600"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession.messages]);

  const handleFlowStart = (flowKey: string) => {
    if (flowKey === 'expert') {
      const expertMessage: Message = {
        role: 'assistant',
        content: '📞 Connect with Our Expert Team\n\nFor complex inquiries or immediate assistance, you can reach our parts specialists:\n\n🕐 Business Hours: Mon-Fri 8:00 AM - 6:00 PM\n📞 Phone: 0800 123 4567\n📧 Email: parts@automotive.com\n📧 Technical: technical@automotive.com\n\nAverage response time: Under 15 minutes during business hours.\n\nWould you like me to help you with anything else in the meantime?',
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
        options: ["Find Car Parts", "Check Order Status", "Start Over"],
        isQuickSelect: true
      };
      
      const updatedSession = {
        ...currentSession,
        messages: [...currentSession.messages, expertMessage],
        title: 'Expert Contact'
      };
      setCurrentSession(updatedSession);
      return;
    }

    const flow = conversationFlows[flowKey as keyof typeof conversationFlows];
    if (!flow) return;

    const firstStep = Object.keys(flow.steps)[0];
    const stepData = flow.steps[firstStep];
    
    const botMessage: Message = {
      role: 'assistant',
      content: stepData.question,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
      options: stepData.options,
      isQuickSelect: true
    };
    
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, botMessage],
      currentFlow: flowKey,
      flowData: { currentStep: firstStep, stepIndex: 0 },
      title: flow.title
    };
    
    setCurrentSession(updatedSession);
  };

  const handleOptionSelect = (option: string) => {
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: option,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };

    let updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage]
    };

    setCurrentSession(updatedSession);
    setIsLoading(true);

    // Process the flow
    setTimeout(() => {
      const processedSession = processFlowStep(updatedSession, option);
      setCurrentSession(processedSession);
      setIsLoading(false);

      // Save session
      setChatSessions(prev => {
        const existing = prev.find(s => s.id === processedSession.id);
        if (existing) {
          return prev.map(s => s.id === processedSession.id ? processedSession : s);
        }
        return [processedSession, ...prev];
      });
    }, 1000);
  };

  const processFlowStep = (session: ChatSession, selectedOption: string): ChatSession => {
    if (!session.currentFlow) {
      // Check if it's a main category selection
      const selectedFlow = mainCategories.find(cat => cat.title === selectedOption)?.flow;
      if (selectedFlow) {
        const flow = conversationFlows[selectedFlow];
        if (flow) {
          const firstStep = Object.keys(flow.steps)[0];
          const stepData = flow.steps[firstStep];
          
          const botMessage: Message = {
            role: 'assistant',
            content: stepData.question,
            timestamp: new Date().toISOString(),
            id: Date.now().toString(),
            options: stepData.options,
            isQuickSelect: true
          };
          
          return {
            ...session,
            messages: [...session.messages, botMessage],
            currentFlow: selectedFlow,
            flowData: { currentStep: firstStep, stepIndex: 0, [firstStep]: selectedOption }
          };
        }
      }
      
      // Handle restart options
      if (['Find Car Parts', 'Check Order Status', 'Start Over'].includes(selectedOption)) {
        const flowMap = {
          'Find Car Parts': 'findParts',
          'Check Order Status': 'orderTracking',
          'Start Over': ''
        };
        
        if (selectedOption === 'Start Over') {
          return startNewFlow(session);
        } else {
          const flowKey = flowMap[selectedOption];
          if (flowKey) {
            const flow = conversationFlows[flowKey];
            const firstStep = Object.keys(flow.steps)[0];
            const stepData = flow.steps[firstStep];
            
            const botMessage: Message = {
              role: 'assistant',
              content: stepData.question,
              timestamp: new Date().toISOString(),
              id: Date.now().toString(),
              options: stepData.options,
              isQuickSelect: true
            };
            
            return {
              ...session,
              messages: [...session.messages, botMessage],
              currentFlow: flowKey,
              flowData: { currentStep: firstStep, stepIndex: 0 }
            };
          }
        }
      }
      
      return session;
    }

    const flow = conversationFlows[session.currentFlow];
    const currentStepKey = session.flowData.currentStep;
    const stepIndex = session.flowData.stepIndex;
    const steps = Object.keys(flow.steps);
    
    // Store the current selection
    const updatedFlowData = {
      ...session.flowData,
      [currentStepKey]: selectedOption
    };

    // Check if there's a next step
    if (stepIndex + 1 < steps.length) {
      const nextStepKey = steps[stepIndex + 1];
      const nextStepData = flow.steps[nextStepKey];
      
      const botMessage: Message = {
        role: 'assistant',
        content: nextStepData.question,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
        options: nextStepData.options,
        isQuickSelect: true
      };
      
      return {
        ...session,
        messages: [...session.messages, botMessage],
        flowData: {
          ...updatedFlowData,
          currentStep: nextStepKey,
          stepIndex: stepIndex + 1
        }
      };
    } else {
      // Flow completed, generate summary
      const summaryMessage = generateFlowSummary(session.currentFlow, updatedFlowData);
      
      return {
        ...session,
        messages: [...session.messages, summaryMessage],
        flowData: updatedFlowData
      };
    }
  };

  const generateFlowSummary = (flowKey: string, flowData: any): Message => {
    let content = '';
    let options = ["Start New Search", "Speak to Expert", "Start Over"];

    switch (flowKey) {
      case 'findParts':
        content = `✅ **Part Search Summary**\n\n` +
          `🚗 Vehicle: ${flowData.vehicleType || 'Not specified'}\n` +
          `🏷️ Brand: ${flowData.vehicleDetails || 'Not specified'}\n` +
          `🔧 Category: ${flowData.partCategory || 'Not specified'}\n` +
          `🎯 Part: ${flowData.specificPart || 'Not specified'}\n\n` +
          `**Next Steps:**\n` +
          `• Our parts specialist will search our inventory\n` +
          `• You'll receive availability and pricing within 15 minutes\n` +
          `• We'll send results to your preferred contact method\n\n` +
          `**Reference ID:** PAR${Date.now().toString().slice(-6)}`;
        break;
        
      case 'tradePrice':
        content = `💼 **Trade Pricing Request**\n\n` +
          `🏢 Business: ${flowData.businessType || 'Not specified'}\n` +
          `📊 Volume: ${flowData.volumeNeeds || 'Not specified'}\n` +
          `🛠️ Parts: ${flowData.partTypes || 'Not specified'}\n\n` +
          `**What happens next:**\n` +
          `• Account manager will review your requirements\n` +
          `• Custom pricing structure prepared within 2 hours\n` +
          `• Direct contact to discuss terms and setup\n\n` +
          `**Application ID:** TRD${Date.now().toString().slice(-6)}`;
        break;
        
      case 'orderTracking':
        content = `📦 **Order Tracking Request**\n\n` +
          `🔍 Lookup Method: ${flowData.orderLookup || 'Not specified'}\n` +
          `⚠️ Issue Type: ${flowData.orderIssues || 'Standard tracking'}\n\n` +
          `**Immediate Actions:**\n` +
          `• Order status being retrieved from our system\n` +
          `• Tracking details will be provided shortly\n` +
          `• Any issues will be escalated to fulfillment team\n\n` +
          `**Inquiry ID:** ORD${Date.now().toString().slice(-6)}`;
        break;
        
      case 'technical':
        content = `🔧 **Technical Support Request**\n\n` +
          `🛠️ Issue: ${flowData.issueType || 'Not specified'}\n` +
          `⏱️ Priority: ${flowData.urgency || 'Standard'}\n\n` +
          `**Response Timeline:**\n` +
          `${flowData.urgency === 'Emergency (Vehicle Down)' ? 
            '• PRIORITY: Technical specialist will contact you within 30 minutes' :
            '• Technical specialist will contact you within 2-4 hours'}\n` +
          `• Detailed solution and parts recommendations provided\n` +
          `• Follow-up support included\n\n` +
          `**Ticket ID:** TEC${Date.now().toString().slice(-6)}`;
        break;
        
      case 'warranty':
        content = `🛡️ **Warranty & Returns**\n\n` +
          `📋 Issue: ${flowData.issueType || 'Not specified'}\n` +
          `📅 Timeframe: ${flowData.timeframe || 'Not specified'}\n\n` +
          `**Processing Steps:**\n` +
          `• Warranty status and coverage being verified\n` +
          `• Return authorization will be issued if applicable\n` +
          `• Resolution provided within 24 hours\n\n` +
          `**Case ID:** WAR${Date.now().toString().slice(-6)}`;
        break;
    }

    return {
      role: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
      options,
      isQuickSelect: true
    };
  };

  const startNewFlow = (session: ChatSession): ChatSession => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: 'Welcome back! How can I assist you with your automotive parts needs today?',
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };

    return {
      ...session,
      messages: [...session.messages, welcomeMessage],
      currentFlow: '',
      flowData: {}
    };
  };

  const startNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{
        role: 'assistant',
        content: 'Welcome to Professional Automotive Parts! 🚗\n\nI\'m your dedicated parts specialist, here to provide expert assistance with all your automotive needs.\n\nHow can I help you today?',
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      }],
      createdAt: new Date().toISOString(),
      currentFlow: '',
      flowData: {}
    };
    
    setCurrentSession(newSession);
    setShowHistory(false);
  };

  const loadChatSession = (session: ChatSession) => {
    setCurrentSession(session);
    setShowHistory(false);
  };

  const deleteChatSession = (sessionId: string) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSession.id === sessionId) {
      startNewChat();
    }
  };

  const shouldShowMainCategories = () => {
    return !currentSession.currentFlow && 
           currentSession.messages.length <= 1;
  };

  return (
    <Card className={`fixed bottom-28 right-4 w-[calc(100vw-32px)] sm:w-96 h-[calc(100vh-40px)] sm:h-[700px] flex flex-col shadow-2xl z-50 border-0 bg-white rounded-xl overflow-hidden transform transition-all duration-300 ease-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
      <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center backdrop-blur-sm">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Automotive Parts Pro</CardTitle>
              <div className="text-sm text-blue-100 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Expert Available
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
                    <div key={session.id} className="group relative">
                      <div
                        role="button"
                        tabIndex={0}
                        className="w-full text-left p-3 pr-10 h-auto hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg cursor-pointer transition-colors duration-150"
                        onClick={() => loadChatSession(session)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') loadChatSession(session); }}
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-800 truncate">
                            {session.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(session.createdAt).toLocaleDateString('en-US')} • {session.messages.length} messages
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChatSession(session.id);
                        }}
                        className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 h-auto text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                        title={`Delete chat: ${session.title}`}
                      >
                        <X className="h-3.5 w-3.5" />
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
              <ChatMessage 
                key={msg.id} 
                message={msg} 
                onOptionSelect={handleOptionSelect}
              />
            ))}
            
            {shouldShowMainCategories() && (
              <div className="space-y-4 mt-4">
                <p className="text-sm text-gray-600 font-medium">Select a service to get started:</p>
                <div className="grid gap-3">
                  {mainCategories.map((category, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`w-full text-left justify-start h-auto p-4 ${category.color} text-white border-0 hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-md`}
                      onClick={() => handleFlowStart(category.flow)}
                    >
                      <div className="flex items-start gap-3">
                        <category.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-sm">{category.title}</div>
                          <div className="text-xs opacity-90 mt-1">{category.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="flex gap-3 mb-4 animate-fadeIn">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-4 max-w-[80%] shadow-sm">
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
      
      <CardFooter className="p-4 bg-white border-t">
        <div className="w-full space-y-3">
          {/* Footer Info */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Professional Automotive Service
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Mon-Fri 8-6
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
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 rounded-full p-4 shadow-lg z-50 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-110 hover:shadow-xl hidden"
        onClick={toggleChatbot}
        size="icon"
      >
        <Car className="h-6 w-6 text-white" />
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