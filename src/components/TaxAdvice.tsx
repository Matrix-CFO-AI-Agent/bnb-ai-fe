import { Card, Button, Table, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useAccount } from 'wagmi';

interface TaxAdviceProps {
  onClose: () => void;
}

const TaxAdvice = ({ onClose }: TaxAdviceProps) => {
  const { address } = useAccount();

  const columns = [
    {
      title: 'Transaction Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Amount (USD)',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Tax Category',
      dataIndex: 'category',
      key: 'category',
    },
  ];

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting tax data...');
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <p className="text-gray-600">
          Connected Wallet: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">IRS 1040 Form Preview</h3>
        <p className="text-gray-600 mb-4">
          Based on your transaction history, we've prepared the following tax information.
        </p>
      </div>

      <Space className="mb-4">
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
          Download Tax Report
        </Button>
      </Space>

      <Table columns={columns} dataSource={[]} />
    </div>
  );
};

export default TaxAdvice; 