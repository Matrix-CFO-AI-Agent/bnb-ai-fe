import React from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

interface SidebarToggleProps {
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ 
  collapsed, 
  onToggle,
  className = ''
}) => {
  return (
    <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        className={`btn-ripple ${className}`}
        aria-label="Toggle sidebar"
      />
    </Tooltip>
  );
};

export default SidebarToggle; 