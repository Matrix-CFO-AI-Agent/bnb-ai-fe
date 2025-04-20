import React, { useState, useEffect, ReactNode } from 'react';

interface TransitionViewProps {
  children: ReactNode;
  show: boolean;
  transitionKey?: string;
}

const TransitionView: React.FC<TransitionViewProps> = ({ 
  children,
  show,
  transitionKey = 'default'
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isActive, setIsActive] = useState(show);
  
  useEffect(() => {
    let timeoutId: number;
    
    if (show) {
      setIsVisible(true);
      // Short delay to ensure DOM is updated before adding active class
      timeoutId = window.setTimeout(() => {
        setIsActive(true);
      }, 10);
    } else {
      setIsActive(false);
      // Wait for transition to complete before hiding
      timeoutId = window.setTimeout(() => {
        setIsVisible(false);
      }, 500); // Match CSS transition time
    }
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [show]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`page-view ${isActive ? 'page-enter-active' : 'page-enter'}`}
      key={transitionKey}
    >
      {children}
    </div>
  );
};

export default TransitionView; 