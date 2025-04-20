import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Tooltip title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      <div className={`theme-toggle ${className}`} onClick={toggleTheme}>
        <SunOutlined className="theme-icon theme-icon-light" />
        <MoonOutlined className="theme-icon theme-icon-dark" />
        <div className="theme-toggle-thumb"></div>
      </div>
    </Tooltip>
  );
};

export default ThemeToggle; 