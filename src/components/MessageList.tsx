import React, { useRef, useEffect, memo } from 'react';
import { Avatar } from 'antd';
import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface ChatMessage {
  id: string;
  type: string;
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
}

interface MessageListProps {
  messages: ChatMessage[];
  showScrollBottom?: boolean;
  onScrollToBottom?: () => void;
}

// Single message component, using memo for render optimization
const Message = memo(({ message }: { message: ChatMessage }) => (
  <div 
    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4 message-list-item`}
  >
    {message.type === 'system' && (
      <Avatar 
        className="bg-blue-500 message-avatar mr-2" 
        icon={<LoadingOutlined className="icon-spin" />}
        size="small"
      />
    )}
    
    <div className={`message-bubble p-3 ${
      message.type === 'user' 
        ? 'message-bubble-user' 
        : 'message-bubble-system'
    }`}>
      <div className="message-content">{message.content}</div>
      <div className="message-timestamp text-xs">
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      
      {message.type === 'user' && message.status && (
        <div className={`message-status status-${message.status}`}>
          {message.status === 'sending' && 'Sending...'}
          {message.status === 'sent' && 'Sent'}
          {message.status === 'delivered' && 'Delivered'}
          {message.status === 'read' && 'Read'}
          {message.status === 'error' && 'Failed to send'}
        </div>
      )}
    </div>
    
    {message.type === 'user' && (
      <Avatar 
        className="bg-gray-400 message-avatar ml-2" 
        icon={<UserOutlined />}
        size="small"
      />
    )}
  </div>
));

Message.displayName = 'Message';

// Optimized message list component using virtual scrolling
const MessageList: React.FC<MessageListProps> = ({ 
  messages,
  showScrollBottom = true,
  onScrollToBottom 
}) => {
  const listRef = useRef<List>(null);
  const prevMessagesLengthRef = useRef<number>(messages.length);
  
  // Scroll to bottom
  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      scrollToBottom();
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length]);

  // Render single message
  const renderMessage = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const message = messages[index];
    return (
      <div style={style} className="px-2">
        <Message message={message} />
      </div>
    );
  };

  return (
    <div className="chat-messages-container flex-grow relative p-6">
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            height={height}
            width={width}
            itemCount={messages.length}
            itemSize={100} // Approximate height of each message
            overscanCount={5} // Number of items to render in advance
          >
            {renderMessage}
          </List>
        )}
      </AutoSizer>

      {showScrollBottom && messages.length > 5 && (
        <button 
          className="scroll-bottom-button absolute bottom-4 right-4 bg-blue-500 text-white rounded-full p-2 shadow-md hover:bg-blue-600 transition-all"
          onClick={() => {
            scrollToBottom();
            if (onScrollToBottom) onScrollToBottom();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default memo(MessageList); 