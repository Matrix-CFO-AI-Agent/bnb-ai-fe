import React, { memo } from 'react';
import { Typography } from 'antd';
import { WalletOutlined, WarningOutlined, FileTextOutlined } from '@ant-design/icons';
import FeatureCard from './FeatureCard';

const { Title, Text } = Typography;

interface WelcomeViewProps {
  onFeatureSelect: (type: 'wallet' | 'risk' | 'tax') => void;
}

const features = [
  { 
    icon: <WalletOutlined />, 
    title: 'Wallet Analysis', 
    type: 'wallet', 
    tooltip: 'Analyze your wallet transactions' 
  },
  { 
    icon: <WarningOutlined />, 
    title: 'Risk Analysis', 
    type: 'risk', 
    tooltip: 'Assess your DeFi risk exposure' 
  },
  { 
    icon: <FileTextOutlined />, 
    title: 'Tax Assistant', 
    type: 'tax', 
    tooltip: 'Generate tax reports' 
  }
];

const WelcomeView: React.FC<WelcomeViewProps> = ({ onFeatureSelect }) => {
  const handleFeatureClick = (type: string) => {
    onFeatureSelect(type as 'wallet' | 'risk' | 'tax');
  };
  
  return (
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
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.type}
            {...feature}
            index={index}
            onClick={handleFeatureClick}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(WelcomeView); 