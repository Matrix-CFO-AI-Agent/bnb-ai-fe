import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import './style.less';

interface ThinkProps {
  content?: string;
}

const Think: React.FC<ThinkProps> = ({ content = 'AI is thinking' }) => {
  return (
    <div className="think-wrapper">
      <div className="think">
        <div className="think-icon">
          <LoadingOutlined spin />
        </div>
        <div className="think-content">
          {content}
          <span className="think-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Think; 