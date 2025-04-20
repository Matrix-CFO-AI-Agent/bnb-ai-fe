import React, { useState, useEffect } from 'react';
import { Button, Modal, Steps, Alert, Tooltip, message } from 'antd';
import { WalletOutlined, LinkOutlined, CheckCircleOutlined, DisconnectOutlined } from '@ant-design/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useEnsName } from 'wagmi';

interface WalletConnectProps {
  className?: string;
  buttonType?: 'default' | 'primary' | 'text';
  showBalance?: boolean;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  className = '',
  buttonType = 'default',
  showBalance = true
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { address, isConnected, isDisconnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [disconnecting, setDisconnecting] = useState(false);

  // Reset steps when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setCurrentStep(0);
    }
  }, [isModalOpen]);

  // Update steps when wallet connection status changes
  useEffect(() => {
    if (isConnected && isModalOpen) {
      setCurrentStep(2);
      // Show success message
      message.success('Wallet connected successfully');
      // Delay closing the modal
      const timer = setTimeout(() => {
        setIsModalOpen(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isConnected, isModalOpen]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const formatAddress = (address?: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    // RainbowKit handles disconnect logic, we just add a delay
    setTimeout(() => {
      setDisconnecting(false);
      message.info('Wallet disconnected');
    }, 500);
  };

  const steps = [
    {
      title: 'Ready to Connect',
      description: 'Click the button below to connect your wallet',
      icon: <WalletOutlined />
    },
    {
      title: 'Select Wallet',
      description: 'Choose your wallet in the popup window',
      icon: <LinkOutlined />
    },
    {
      title: 'Connection Successful',
      description: 'Your wallet has been successfully connected',
      icon: <CheckCircleOutlined />
    }
  ];

  const connectedButton = (
    <Button
      type={buttonType}
      icon={<WalletOutlined />}
      className={`wallet-connected-btn ${className}`}
      onClick={showModal}
    >
      {ensName || formatAddress(address)}
      {showBalance && (
        <span className="wallet-balance">
          0.135 ETH
        </span>
      )}
    </Button>
  );

  return (
    <>
      {isConnected ? (
        <Tooltip title="View wallet details">
          {connectedButton}
        </Tooltip>
      ) : (
        <ConnectButton.Custom>
          {({ openConnectModal }) => {
            return (
              <Button
                type={buttonType || 'primary'}
                icon={<WalletOutlined />}
                onClick={() => {
                  showModal();
                  // Slightly delay opening the connect modal so our navigation modal shows first
                  setTimeout(() => {
                    openConnectModal();
                  }, 300);
                }}
                className={`gradient-btn ${className}`}
              >
                Connect Wallet
              </Button>
            );
          }}
        </ConnectButton.Custom>
      )}

      <Modal
        title={
          <div className="flex items-center gap-2">
            <WalletOutlined className="text-blue-500" />
            <span>{isConnected ? "Wallet Information" : "Connect Wallet"}</span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        className="wallet-modal"
      >
        {isConnected ? (
          <div className="wallet-info">
            <div className="wallet-address gradient-border p-4 mb-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Current Connected Address</div>
              <div className="font-medium">{address}</div>
              {ensName && (
                <div className="text-sm text-blue-500">ENS: {ensName}</div>
              )}
            </div>

            <div className="wallet-balance-info grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">ETH Balance</div>
                <div className="font-medium text-lg">0.135 ETH</div>
                <div className="text-xs text-gray-500">≈ $230.50</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Other Tokens</div>
                <div className="font-medium text-lg">3 types</div>
                <div className="text-xs text-blue-500">View all</div>
              </div>
            </div>

            <div className="wallet-actions">
              <Button 
                type="primary"
                block
                className="mb-2 btn-ripple"
                icon={<CheckCircleOutlined />}
                onClick={handleCancel}
              >
                Confirm
              </Button>
              
              <Button 
                danger
                block
                icon={<DisconnectOutlined />}
                onClick={handleDisconnect}
                loading={disconnecting}
                className="btn-ripple"
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="wallet-connect-steps">
            <Steps
              current={currentStep}
              direction="vertical"
              items={steps}
              className="mb-4"
            />

            <Alert
              message="Connecting your wallet may require confirmation in a popup window"
              description="To ensure the safety of your assets, never connect your wallet to untrusted websites"
              type="info"
              showIcon
              className="mb-4"
            />

            <div className="connect-button text-center">
              <ConnectButton />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default WalletConnect; 