import { Card, Button, Table, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useAccount } from 'wagmi';

interface WalletAnalysisProps {
  onClose: () => void;
}

const WalletAnalysis = ({ onClose }: WalletAnalysisProps) => {
  const { address } = useAccount();

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
    },
  ];

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting data...');
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <p className="text-gray-600">
          Connected Wallet: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
        </p>
      </div>
      <Space className="mb-4">
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
          Export to Excel
        </Button>
      </Space>
      <Table columns={columns} dataSource={[]} />
    </div>
  );
};

export default WalletAnalysis; 