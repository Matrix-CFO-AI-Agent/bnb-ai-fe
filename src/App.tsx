import { Layout, Button, List, Typography, Avatar } from 'antd';
import { useState } from 'react';
import { WalletOutlined, WarningOutlined, FileTextOutlined, PlusOutlined, MessageOutlined } from '@ant-design/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface ChatMessage {
  id: string;
  type: string;
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  type: 'wallet' | 'risk' | 'tax';
}

function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [logs, setLogs] = useState<any[]>([]);

  const createNewChat = (type: 'wallet' | 'risk' | 'tax') => {
    const initialMessages: { [key: string]: string } = {
      wallet: "让我帮你分析钱包的所有收支情况，包括代币交易和转账记录。",
      risk: "我将帮你分析当前借贷市场的风险情况，包括健康因子和清算风险。",
      tax: "我可以帮你生成详细的加密货币交易税务报告和建议。"
    };

    const newChat: Chat = {
      id: Date.now().toString(),
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Analysis ${chats.length + 1}`,
      messages: [
        {
          id: Date.now().toString(),
          type: 'system',
          content: initialMessages[type],
          timestamp: new Date()
        }
      ],
      type
    };

    setChats(prev => [...prev, newChat]);
    setSelectedChat(newChat.id);
  };

  return (
    <Layout className="min-h-screen bg-[#f5f7ff]">
      {/* Left Sidebar */}
      <Sider width={300} className="bg-white m-4 rounded-xl shadow-lg overflow-hidden">
        {/* Logo and Slogan */}
        <div className="p-6 border-b border-gray-100">
          <Title level={3} className="text-gray-800 m-0 flex items-center gap-2">
            <img src="/logo.png" alt="Matrix AI" className="w-8 h-8" />
            Matrix AI
          </Title>
          <Text className="text-gray-500">Your Web3 Financial Assistant</Text>
        </div>

        {/* Chat List */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Text className="text-gray-600 font-medium">Conversations</Text>
            <Button 
              type="text"
              icon={<PlusOutlined />}
              className="hover:bg-blue-50 text-blue-500"
              onClick={() => createNewChat('wallet')}
            />
          </div>
          <List
            className="chat-list"
            dataSource={chats}
            renderItem={chat => (
              <List.Item
                className={`cursor-pointer rounded-lg p-3 mb-2 transition-all ${
                  selectedChat === chat.id 
                    ? 'bg-blue-50 border-blue-100' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="flex items-center gap-3">
                  <MessageOutlined className="text-blue-500" />
                  <Text className="text-gray-700">{chat.title}</Text>
                </div>
              </List.Item>
            )}
          />
        </div>

        {/* Transaction Logs */}
        <div className="p-4 mt-auto border-t border-gray-100">
          <Text className="text-gray-600 font-medium block mb-2">Transaction Logs</Text>
          <List
            size="small"
            dataSource={logs}
            className="max-h-40 overflow-y-auto"
            renderItem={log => (
              <List.Item className="text-gray-600 py-2 px-3 rounded hover:bg-gray-50">
                {log.content}
              </List.Item>
            )}
          />
        </div>
      </Sider>

      {/* Main Content */}
      <Layout className="m-4 ml-0">
        <Header className="bg-white h-16 rounded-xl shadow-sm mb-4 px-6 flex justify-end items-center">
          <ConnectButton />
        </Header>
        <Content className="bg-white rounded-xl p-8 shadow-lg">
          {!selectedChat ? (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="relative w-64 h-64 mx-auto mb-8">
                  <div className="absolute inset-0 bg-blue-50 rounded-full animate-pulse"></div>
                  <img 
                    src="/ai-assistant.png" 
                    alt="AI Assistant" 
                    className="relative z-10 w-full h-full object-contain"
                  />
                </div>
                <Title level={1} className="text-gray-800 mb-4">Welcome to Matrix AI</Title>
                <Text className="text-gray-500 text-lg block mb-12">
                  Your intelligent Web3 financial assistant powered by advanced AI
                </Text>
              </div>

              <div className="grid grid-cols-3 gap-8">
                {[
                  { icon: <WalletOutlined />, title: 'Wallet Analysis', type: 'wallet' },
                  { icon: <WarningOutlined />, title: 'Risk Analysis', type: 'risk' },
                  { icon: <FileTextOutlined />, title: 'Tax Assistant', type: 'tax' }
                ].map((feature) => (
                  <Button
                    key={feature.type}
                    className="feature-card"
                    onClick={() => createNewChat(feature.type as 'wallet' | 'risk' | 'tax')}
                  >
                    <div className="p-8 text-center hover:scale-105 transition-all">
                      <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl text-blue-500">{feature.icon}</span>
                      </div>
                      <Text className="text-gray-700 font-medium text-lg">{feature.title}</Text>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat-container">
              {chats.find(chat => chat.id === selectedChat)?.messages.map(message => (
                <div 
                  key={message.id}
                  className={`mb-4 p-4 rounded-xl ${
                    message.type === 'system' 
                      ? 'bg-blue-50 border border-blue-100' 
                      : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  <Text className="text-gray-700">{message.content}</Text>
                </div>
              ))}
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
