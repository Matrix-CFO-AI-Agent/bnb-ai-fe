import { Layout, Button, List, Typography, Avatar, Skeleton, message } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { WalletOutlined, WarningOutlined, FileTextOutlined, PlusOutlined, MessageOutlined, LoadingOutlined, UserOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import ThemeToggle from './components/ThemeToggle';
import ChatInput from './components/ChatInput';
import TransitionView from './components/TransitionView';
import SidebarToggle from './components/SidebarToggle';
import WalletConnect from './components/WalletConnect';
import Think from './components/Think';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface ChatMessage {
  id: string;
  type: string;
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
}

interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  type: 'wallet' | 'risk' | 'tax';
}

interface TimeGroup {
  label: string;
  chats: Chat[];
}

interface LogGroup {
  group: string;
  items: TransactionLog[];
}

interface TransactionLog {
  id: string;
  content: string;
  timestamp: Date;
}

function App() {
  const [chatGroups, setChatGroups] = useState<TimeGroup[]>([
    {
      label: 'Today',
      chats: [
        {
          id: '1',
          title: 'Portfolio Analysis',
          messages: [{
            id: '1',
            type: 'system',
            content: 'Let me analyze your current portfolio performance and token distribution.',
            timestamp: new Date(),
            status: 'read'
          }],
          type: 'wallet'
        }
      ]
    },
    {
      label: 'Yesterday',
      chats: [
        {
          id: '2',
          title: 'Risk Assessment',
          messages: [{
            id: '2',
            type: 'system',
            content: 'I will help you evaluate your DeFi positions and potential risks.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            status: 'read'
          }],
          type: 'risk'
        }
      ]
    },
    {
      label: 'Previous 7 Days',
      chats: [
        {
          id: '3',
          title: 'Tax Planning',
          messages: [{
            id: '3',
            type: 'system',
            content: 'Let me help you plan your crypto tax strategy.',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            status: 'read'
          }],
          type: 'tax'
        }
      ]
    }
  ]);

  const [logGroups, setLogGroups] = useState<LogGroup[]>([
    {
      group: 'Today',
      items: [
        { id: '1', content: 'Swapped 2 ETH for 3600 USDC', timestamp: new Date() },
        { id: '2', content: 'Added liquidity to ETH/USDT pool', timestamp: new Date() }
      ]
    },
    {
      group: 'Yesterday',
      items: [
        { id: '3', content: 'Claimed 200 UNI rewards', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        { id: '4', content: 'Deposited 1000 USDC to Aave', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      ]
    },
    {
      group: 'Previous 7 Days',
      items: [
        { id: '5', content: 'Borrowed 2000 USDC against ETH', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        { id: '6', content: 'Repaid 1000 USDC loan', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }
      ]
    }
  ]);

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageSending, setMessageSending] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'welcome' | 'chat' | 'analysis'>('welcome');
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'warning' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });
  const notificationRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Simulate loading process
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Control notification display
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatGroups, selectedChat, messageSending]);

  const showNotification = (type: 'success' | 'warning' | 'error', msg: string) => {
    setNotification({
      show: true,
      type,
      message: msg
    });
  };

  // 更详细的思考文本映射
  const thinkingTexts = {
    wallet: [
      "Analyzing your wallet transactions...\nGathering data from Ethereum, BSC, and other chains...\nComputing historical balance changes...\nIdentifying recurring patterns in your transactions...\nEvaluating gas usage efficiency...",
      "Computing token distribution...\nCategorizing by token types (DeFi, NFT, Governance)...\nCalculating dollar-value exposure per asset...\nComparing against optimal portfolio allocation models...\nIdentifying high-risk concentration positions...",
      "Examining recent transfers...\nVerifying transaction confirmations across networks...\nAssessing cross-chain bridge activities...\nAnalyzing counterparty risk exposure...\nDetecting potential suspicious transactions..."
    ],
    risk: [
      "Evaluating market conditions...\nAggregating data from major exchanges...\nAssessing current market volatility metrics...\nModeling potential downturn scenarios...\nCalculating correlation factors between major assets...",
      "Calculating risk exposure...\nAnalyzing leverage positions across lending platforms...\nSimulating liquidation cascades...\nEvaluating collateral diversification health...\nAssessing impermanent loss potential in LP positions...",
      "Checking DeFi positions...\nVerifying smart contract audit statuses...\nCalculating protocol TVL trends...\nAssessing governance risks in utilized protocols...\nEvaluating historical reliability during high congestion periods..."
    ],
    tax: [
      "Compiling transaction history...\nCategorizing transactions by tax treatment...\nIdentifying cost basis for each position...\nCalculating holding periods for long/short term status...\nReconciling on-chain data with exchange reports...",
      "Applying relevant tax regulations...\nChecking jurisdiction-specific treatment of crypto assets...\nIdentifying taxable events in your history...\nCalculating gains/losses per asset class...\nAssessing potential reporting obligations...",
      "Searching for tax optimization opportunities...\nIdentifying loss-harvesting possibilities...\nEvaluating tax-efficient trading strategies...\nCalculating potential tax savings through timing adjustments...\nAnalyzing DeFi interactions for complex tax implications..."
    ]
  };

  // 每种类型的初始分析结果
  const initialAnalysisResults = {
    wallet: [
      "Based on my analysis of your wallet, I've found that:\n\n1. Your portfolio consists of 5 major assets: ETH (45%), USDT (30%), LINK (10%), UNI (10%), and various smaller holdings (5%).\n\n2. Your transaction volume has increased by 23% in the last month, with most activity on Ethereum mainnet.\n\n3. Gas optimization opportunity: You could save approximately 15% on fees by batching transactions or using Layer 2 solutions.\n\n4. Risk assessment: Your portfolio has a moderate concentration risk in stablecoins.\n\nWould you like me to provide more detailed analysis on any specific aspect?",
      "After analyzing your wallet activity, here's what I found:\n\n1. You currently hold approximately $12,500 in crypto assets across 3 chains.\n\n2. Your most profitable token has been ETH with a 34% gain since acquisition.\n\n3. I've detected regular DeFi interactions with Uniswap, Aave, and Compound.\n\n4. Opportunity: Based on your holding pattern, you might benefit from staking your ETH for additional yield.\n\nIs there a particular area you'd like to explore further?"
    ],
    risk: [
      "I've completed a risk assessment of your DeFi positions:\n\n1. Your current overall health factor across lending platforms is 1.78, which is reasonably safe but could be improved.\n\n2. Market Simulation: Your positions would remain safe even with a 35% market downturn.\n\n3. Collateral Diversification: Your reliance on ETH as collateral (78%) creates a concentration risk.\n\n4. Recommendation: Consider diversifying your collateral or increasing your health factor to above 2.0 for greater safety.\n\nWould you like advice on how to optimize your position?",
      "I've analyzed your risk exposure and found the following:\n\n1. Your current liquidation threshold is at a price of ETH = $1,450, providing a 32% safety buffer at current prices.\n\n2. Protocol Risk: 65% of your funds are in protocols with comprehensive audits and long operational history.\n\n3. Interest Rate Risk: You're exposed to variable rates that have fluctuated by up to 3% in the past month.\n\n4. Recommendation: Consider setting up automatic health factor monitoring and partial repayments to manage risk.\n\nDo you want me to explain any of these points in more detail?"
    ],
    tax: [
      "Based on your transaction history, here's my tax analysis:\n\n1. Estimated Tax Liability: Approximately $1,200 based on identified taxable events.\n\n2. Capital Gains Breakdown: $4,500 in long-term gains, $2,800 in short-term gains.\n\n3. DeFi Considerations: Identified 12 liquidity provisions and 8 yield farming rewards that may have tax implications.\n\n4. Optimization Strategy: Using FIFO accounting method appears most beneficial for your situation, potentially saving $320 compared to LIFO.\n\nWould you like a more detailed breakdown of any specific area?",
      "I've analyzed your crypto tax situation and found:\n\n1. You have approximately 120 taxable events across the last fiscal year.\n\n2. Staking rewards totaling $850 likely need to be reported as ordinary income.\n\n3. Identified potential missing cost basis information for 5 transactions that require attention.\n\n4. Tax Loss Harvesting Opportunity: You could realize about $1,500 in losses before year-end to offset other gains.\n\nDo you need help with documentation or specific transaction analysis?"
    ]
  };

  // 获取随机但详细的思考文本
  const getDetailedThinkingText = (chatType: string) => {
    const typeTexts = thinkingTexts[chatType as keyof typeof thinkingTexts] || thinkingTexts.wallet;
    return typeTexts[Math.floor(Math.random() * typeTexts.length)];
  };

  // 获取随机的初始分析结果
  const getInitialAnalysisResult = (chatType: string) => {
    const results = initialAnalysisResults[chatType as keyof typeof initialAnalysisResults] || initialAnalysisResults.wallet;
    return results[Math.floor(Math.random() * results.length)];
  };

  // 修改createNewChat函数，在创建后自动添加AI分析结果
  const createNewChat = (type: 'wallet' | 'risk' | 'tax') => {
    // 首先在 Today 分组中查找同类型的聊天
    const todayGroupIndex = chatGroups.findIndex(g => g.label === 'Today');
    const todayGroup = todayGroupIndex !== -1 ? chatGroups[todayGroupIndex] : null;
    const existingChatIndex = todayGroup ? todayGroup.chats.findIndex(chat => chat.type === type) : -1;

    if (todayGroup && existingChatIndex !== -1) {
      // 如果找到同类型的聊天，直接定位到该聊天
      const existingChat = todayGroup.chats[existingChatIndex];
      setSelectedChat(existingChat.id);
      setActiveView('chat');
      return;
    }

    // 如果不存在同类型的聊天，创建新的
    const initialMessages: { [key: string]: string } = {
      wallet: "Let me help you analyze all income and expenses of your wallet, including token transactions and transfers.",
      risk: "I will help you analyze the current lending market risks, including health factors and liquidation risks.",
      tax: "I can help you generate detailed crypto transaction tax reports and suggestions."
    };

    // 为新聊天创建唯一ID
    const chatId = Date.now().toString();
    
    // 创建初始消息
    const welcomeMessage: ChatMessage = {
      id: `${chatId}-welcome`,
      type: 'system',
      content: initialMessages[type],
      timestamp: new Date(),
      status: 'read'
    };

    // 创建思考消息（将被保留）
    const thinkingMessage: ChatMessage = {
      id: `${chatId}-thinking`,
      type: 'thinking',
      content: getDetailedThinkingText(type),
      timestamp: new Date(Date.now() + 1000),
    };

    // 创建分析结果消息
    const analysisMessage: ChatMessage = {
      id: `${chatId}-analysis`,
      type: 'system',
      content: getInitialAnalysisResult(type),
      timestamp: new Date(Date.now() + 2000),
      status: 'read'
    };

    const newChat: Chat = {
      id: chatId,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Analysis ${Date.now().toString().slice(-4)}`,
      messages: [
        welcomeMessage,
        thinkingMessage,
        analysisMessage
      ],
      type
    };

    setChatGroups(prev => {
      // 创建新的数组，避免直接修改状态
      const newGroups = [...prev];

      // 检查是否存在 Today 分组
      const todayIndex = newGroups.findIndex(g => g.label === 'Today');

      if (todayIndex !== -1) {
        // 如果存在 Today 分组，将新聊天添加到 Today 分组的开头
        const updatedChats = [newChat, ...newGroups[todayIndex].chats];
        newGroups[todayIndex] = {
          ...newGroups[todayIndex],
          chats: updatedChats
        };
      } else {
        // 如果不存在 Today 分组，创建新的 Today 分组
        newGroups.unshift({
          label: 'Today',
          chats: [newChat]
        });
      }

      return newGroups;
    });

    setSelectedChat(chatId);
    setActiveView('chat');
    message.success(`Created new ${type} analysis chat`);
  };

  // 修改handleSendMessage函数，添加并保留详细的思考过程
  const handleSendMessage = (content: string) => {
    if (!selectedChat || !content.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
      status: 'sending'
    };

    // 获取当前聊天类型
    const currentChat = chatGroups.find(g => g.chats.some(c => c.id === selectedChat))?.chats.find(c => c.id === selectedChat);
    const currentChatType = currentChat?.type || 'wallet';

    // Add user message
    setChatGroups(prev =>
      prev.map(group => ({
        ...group,
        chats: group.chats.map(chat =>
          chat.id === selectedChat
            ? { ...chat, messages: [...chat.messages, newMessage] }
            : chat
        )
      }))
    );

    // Simulate sending state
    setMessageSending(true);

    // Simulate response delay
    setTimeout(() => {
      // Update message status to sent
      setChatGroups(prev =>
        prev.map(group => ({
          ...group,
          chats: group.chats.map(chat =>
            chat.id === selectedChat
              ? {
                ...chat,
                messages: chat.messages.map(msg =>
                  msg.id === newMessage.id
                    ? { ...msg, status: 'sent' }
                    : msg
                )
              }
              : chat
          )
        }))
      );

      // 添加思考消息，但不会被移除
      const thinkingMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'thinking',
        content: getDetailedThinkingText(currentChatType),
        timestamp: new Date()
      };

      // 添加思考消息到聊天中
      setChatGroups(prev =>
        prev.map(group => ({
          ...group,
          chats: group.chats.map(chat =>
            chat.id === selectedChat
              ? { ...chat, messages: [...chat.messages, thinkingMessage] }
              : chat
          )
        }))
      );

      // Simulate AI reply with delay
      setTimeout(() => {
        // 将思考状态更改为已完成
        setChatGroups(prev =>
          prev.map(group => ({
            ...group,
            chats: group.chats.map(chat =>
              chat.id === selectedChat
                ? {
                  ...chat,
                  messages: chat.messages.map(msg =>
                    msg.id === thinkingMessage.id
                      ? { ...msg, type: 'thought-complete' }
                      : msg
                  )
                }
                : chat
            )
          }))
        );

        // 添加AI回复
        const aiMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'system',
          content: getAIResponse(content, currentChatType),
          timestamp: new Date(),
          status: 'read'
        };

        setChatGroups(prev =>
          prev.map(group => ({
            ...group,
            chats: group.chats.map(chat =>
              chat.id === selectedChat
                ? { ...chat, messages: [...chat.messages, aiMessage] }
                : chat
            )
          }))
        );

        setMessageSending(false);
      }, 2000);
    }, 800);
  };

  // Simple AI response simulation
  const getAIResponse = (userMessage: string, chatType: string): string => {
    const lowerMsg = userMessage.toLowerCase();

    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      return "Hello! I'm Matrix AI assistant, happy to help you.";
    }

    if (chatType === 'wallet') {
      if (lowerMsg.includes('balance')) {
        return "Based on your wallet analysis, you currently hold 2.3 ETH and 500 USDT. Your assets have grown by 12% in the last 30 days.";
      }
      if (lowerMsg.includes('transaction')) {
        return "Your recent transaction records show that you've made 3 transactions in the past week, including 1 Swap and 2 transfers.";
      }
      return "I've analyzed your wallet activity. Your main asset is ETH, accounting for 45%, followed by USDT at 30%. Your transaction activity is above average.";
    }

    if (chatType === 'risk') {
      return "Based on current market conditions, your lending position health factor is 1.8, above the safe level (1.5). Market volatility is low, liquidation risk is minimal.";
    }

    if (chatType === 'tax') {
      return "Based on your trading history, I estimate your cryptocurrency tax burden this year to be around $1,200. You might consider using the FIFO method to optimize your tax strategy.";
    }

    return "I understand your question, let me analyze it. According to my analysis, your Web3 assets are performing well, with potential for optimization.";
  };

  // Add sidebar toggle logic
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Set active view when selecting a chat
  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
    setActiveView('chat');
  };

  // Add gradient border card component
  const FeatureCard = ({ icon, title, type, tooltip, index }: any) => (
    <Button
      key={type}
      className="feature-card btn-ripple tooltip card-3d"
      data-tooltip={tooltip}
      onClick={() => {
        createNewChat(type as 'wallet' | 'risk' | 'tax');
        setActiveView('chat');
      }}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="p-8 text-center transition-all">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center gradient-border">
          <span className="text-2xl text-blue-500 icon-pulse">{icon}</span>
        </div>
        <Text className="text-gray-700 font-medium text-lg">{title}</Text>
      </div>
    </Button>
  );

  return (
    <Layout className="!min-h-screen bg-[#f5f7ff]">

      {/* Left Sidebar */}
      <Sider
        width={300}
        className={`bg-white m-4 flex flex-col rounded-xl gap-10 shadow-lg overflow-hidden fade-in sidebar-toggle ${sidebarCollapsed ? 'sidebar-hidden' : ''}`}
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        collapsedWidth={0}
      >
        {/* Logo and Slogan */}
        <div className='flex flex-col h-full'>
          <div className="p-6 flex-none  border-b border-gray-100">
            <Title level={3} className="m-0 flex items-center gap-2 gradient-text">
              <img src="/logo.png" alt="Matrix AI" className="w-8 h-8" />
              Matrix AI
            </Title>
            <Text className="text-gray-500">Your Web3 Financial Assistant</Text>
          </div>

          <div className='flex-1 flex flex-col'>
            {/* Chat List */}
            <div className="p-4 flex-1">
              <div className="flex justify-between items-center mb-4">
                <Text className="text-gray-600 font-medium">Conversations</Text>
                <Button
                  type="text"
                  icon={<PlusOutlined className="icon-zoom" />}
                  className="hover:bg-blue-50 text-blue-500 btn-ripple tooltip"
                  data-tooltip="Create new chat"
                  onClick={() => {
                    setSelectedChat(null);
                    setActiveView('welcome');
                  }}
                />
              </div>
              <div className="border-gradient mb-4"></div>
              <List
                className="chat-list"
                dataSource={chatGroups}
                renderItem={group => (
                  <div key={group.label} className='!mt-4'>
                    <Text className="text-gray-500 text-sm block mb-2">{group.label}</Text>
                    {group.chats.map(chat => (
                      <List.Item
                        key={chat.id}
                        className={`cursor-pointer rounded-lg p-3 mb-2 transition-all click-effect hover-lift message-list-item ${selectedChat === chat.id ? '!gradient-bg  bg-white' : 'hover:bg-gray-50'
                          }`}
                        onClick={() => handleSelectChat(chat.id)}
                      >
                        <div className="flex flex-col w-full">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-3">
                              <MessageOutlined className={selectedChat === chat.id ? "text-white" : "text-blue-500"} />
                              <Text className={selectedChat === chat.id ? "text-white" : "text-gray-700"}>
                                {chat.title}
                              </Text>
                            </div>
                            <Text className={`text-xs ${selectedChat === chat.id ? "text-white/80" : "text-gray-500"}`}>
                              {chat.messages[chat.messages.length - 1].timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Text>
                          </div>
                          <Text
                            className={`text-xs truncate ml-8 ${selectedChat === chat.id ? "text-white/70" : "text-gray-500"
                              }`}
                          >
                            {chat.messages[chat.messages.length - 1].content}
                          </Text>
                        </div>
                      </List.Item>
                    ))}
                  </div>
                )}
              />
            </div>

            {/* Transaction Logs */}
            <div className="p-4 mt-auto max-h-[200px] overflow-auto border-t border-gray-100">
              <Text className="text-gray-600 font-medium block mb-2">Transaction Logs</Text>
              <div className="border-gradient mb-4"></div>
              <List
                size="small"
                dataSource={logGroups}
                className="max-h-40 overflow-y-auto"
                renderItem={logGroup => (
                  <List.Item className="text-gray-600 py-2 px-3 rounded hover:bg-gray-50 hover-lift message-list-item">
                    {logGroup.group}
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
      </Sider>

      {/* Main Content */}
      <Layout className="m-4 ml-0 ">
        <div className="bg-white h-16 rounded-xl shadow-sm mb-4 px-6 flex justify-end items-center fade-in">
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <WalletConnect buttonType="primary" />
          </div>
        </div>
        <Content className="bg-white rounded-xl shadow-lg fade-in flex flex-col relative">
          <div className="page-transition-container">
            {/* Loading view */}
            <TransitionView show={loading} transitionKey="loading">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="loading-spinner"></div>
                <p className="mt-4 text-xl text-gray-600">Loading Matrix AI...</p>
              </div>
            </TransitionView>

            {/* Welcome page view */}
            <TransitionView show={!loading && activeView === 'welcome'} transitionKey="welcome">
              <div className="max-w-4xl mx-auto slide-in p-8">
                <div className="text-center mb-12 data-update">
                  <div className="relative w-64 h-64 mx-auto mb-8">
                    <div className="absolute inset-0 bg-blue-50 rounded-full animate-pulse"></div>
                    <img
                      src="/ai-assistant.png"
                      alt="AI Assistant"
                      className="relative z-10 w-full h-full object-contain"
                    />
                  </div>
                  <Title level={1} className="mb-4 gradient-text">Welcome to Matrix AI</Title>
                  <Text className="text-gray-500 text-lg block mb-12">
                    Your intelligent Web3 financial assistant powered by advanced AI
                  </Text>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: <WalletOutlined />, title: 'Wallet Analysis', type: 'wallet', tooltip: 'Analyze your wallet transactions' },
                    { icon: <WarningOutlined />, title: 'Risk Analysis', type: 'risk', tooltip: 'Assess your DeFi risk exposure' },
                    { icon: <FileTextOutlined />, title: 'Tax Assistant', type: 'tax', tooltip: 'Generate tax reports' }
                  ].map((feature, index) => (
                    <FeatureCard {...feature} index={index} key={feature.type} />
                  ))}
                </div>
              </div>
            </TransitionView>

            {/* Chat view */}
            <TransitionView show={!loading && activeView === 'chat' && !!selectedChat} transitionKey="chat">
              <div className="flex flex-col h-full">
                <div ref={chatContainerRef} className="chat-messages-container flex-grow p-6">
                  {chatGroups.find(g => g.chats.some(c => c.id === selectedChat))?.chats.find(c => c.id === selectedChat)?.messages.map((message, index) => (
                    <div key={message.id}>
                      {message.type === 'thinking' ? (
                        <Think content="Matrix AI is thinking" />
                      ) : (
                        <div
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4 message-list-item`}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {message.type === 'system' && (
                            <Avatar
                              className="!bg-transparent message-avatar mr-2 !mt-2 object-cover"
                              icon={<img src="/logo.png" alt="Matrix AI" className="w-4 h-4" />}
                              size="small"
                            />
                          )}

                          <div className={`message-bubble p-3 ${message.type === 'user'
                            ? 'message-bubble-user'
                            : 'message-bubble-system'
                            }`}>
                            <div className="flex items-center gap-2">
                              <div className="message-content">{message.content}</div>

                              {message.type === 'user' && message.status && (
                                <div className={`message-status status-${message.status}`}>
                                  {message.status === 'sending' && <LoadingOutlined className="icon-spin" />}
                                  {message.status === 'sent' && <CheckOutlined />}
                                  {message.status === 'delivered' && <CheckOutlined />}
                                  {message.status === 'read' && <CheckOutlined />}
                                  {message.status === 'error' && <CloseOutlined />}
                                </div>
                              )}
                            </div>
                            <div className="message-timestamp text-xs text-gray-500">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>

                          {message.type === 'user' && (
                            <Avatar
                              className="bg-gray-400 message-avatar ml-2 !mt-2 object-cover"
                              icon={<UserOutlined />}
                              size="small"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-100">
                  <ChatInput
                    onSend={handleSendMessage}
                    loading={messageSending}
                    placeholder="Enter message, press Enter to send..."
                  />
                </div>
              </div>
            </TransitionView>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
