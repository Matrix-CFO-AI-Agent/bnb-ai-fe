import React, { useState, useRef, KeyboardEvent } from 'react';
import { Input, Button, Tooltip } from 'antd';
import { SendOutlined, LoadingOutlined, SmileOutlined, PaperClipOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface ChatInputProps {
  onSend: (message: string) => void;
  loading?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  loading = false,
  placeholder = 'Enter message...'
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textAreaRef = useRef<any>(null);

  const handleSend = () => {
    if (message.trim() && !loading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`chat-input-container p-3 rounded-xl border border-gray-200 transition-all ${isFocused ? 'shadow-md border-blue-300' : ''}`}>
      <TextArea
        ref={textAreaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        autoSize={{ minRows: 1, maxRows: 5 }}
        className="border-0 focus:outline-none focus:shadow-none"
        disabled={loading}
      />
      
      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-2">
          <Tooltip title="Add emoji">
            <Button
              type="text"
              icon={<SmileOutlined />}
              size="small"
              className="text-gray-500 hover:text-blue-500 btn-ripple"
            />
          </Tooltip>
          <Tooltip title="Upload file">
            <Button
              type="text"
              icon={<PaperClipOutlined />}
              size="small"
              className="text-gray-500 hover:text-blue-500 btn-ripple"
            />
          </Tooltip>
        </div>
        
        <Tooltip title={loading ? 'Processing...' : 'Send message'}>
          <Button
            type="primary"
            icon={loading ? <LoadingOutlined /> : <SendOutlined />}
            onClick={handleSend}
            disabled={!message.trim() || loading}
            className="btn-ripple"
          />
        </Tooltip>
      </div>
      
      {loading && (
        <div className="typing-indicator mt-2 text-xs text-gray-500">
          AI assistant is thinking
          <span className="typing-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatInput; 