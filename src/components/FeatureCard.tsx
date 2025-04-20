import React, { memo } from 'react';
import { Button, Typography } from 'antd';
import { ReactNode } from 'react';

const { Text } = Typography;

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  type: string;
  tooltip: string;
  index: number;
  onClick: (type: string) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  type,
  tooltip,
  index,
  onClick
}) => {
  return (
    <Button
      key={type}
      className="feature-card btn-ripple tooltip card-3d"
      data-tooltip={tooltip}
      onClick={() => onClick(type)}
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
};

export default memo(FeatureCard); 