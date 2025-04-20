import { Card, Button, Table, Space, Empty, Tabs, Spin, Tag, Tooltip } from 'antd';
import { DownloadOutlined, InfoCircleOutlined, LineChartOutlined, FilterOutlined, PieChartOutlined } from '@ant-design/icons';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';

interface WalletAnalysisProps {
  onClose: () => void;
}

interface TransactionRecord {
  key: string;
  date: string;
  type: string;
  amount: string;
  token: string;
  status: string;
  to?: string;
  from?: string;
}

// Mock data
const mockData: TransactionRecord[] = [
  {
    key: '1',
    date: '2023-10-28',
    type: 'Swap',
    amount: '1.5',
    token: 'ETH',
    status: 'completed',
    to: '0x123...789',
  },
  {
    key: '2',
    date: '2023-10-27',
    type: 'Send',
    amount: '500',
    token: 'USDT',
    status: 'completed',
    to: '0xabc...def',
  },
  {
    key: '3',
    date: '2023-10-25',
    type: 'Receive',
    amount: '0.8',
    token: 'ETH',
    status: 'completed',
    from: '0x456...012',
  },
];

// Simple SVG chart component
const SimpleBarChart = () => (
  <div className="p-4 bg-blue-50 rounded-xl my-4">
    <div className="flex justify-between items-end h-40 mt-4">
      {[65, 40, 85, 30, 55, 60, 75].map((height, i) => (
        <Tooltip key={i} title={`Day ${i + 1}: ${height}%`}>
          <div 
            className="w-8 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg cursor-pointer transition-all hover:from-blue-500 hover:to-blue-700"
            style={{ height: `${height}%` }}
          ></div>
        </Tooltip>
      ))}
    </div>
    <div className="flex justify-between mt-2">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
        <div key={i} className="text-xs text-gray-500 w-8 text-center">{day}</div>
      ))}
    </div>
  </div>
);

// Simple pie chart component
const SimplePieChart = () => (
  <div className="p-4 bg-blue-50 rounded-xl my-4">
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="45" fill="#93c5fd" />
        <path d="M50,50 L50,5 A45,45 0 0,1 88,73 z" fill="#3b82f6" />
        <path d="M50,50 L88,73 A45,45 0 0,1 12,73 z" fill="#1d4ed8" />
        <path d="M50,50 L12,73 A45,45 0 0,1 50,5 z" fill="#6366f1" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold">Total</div>
          <div className="text-2xl font-bold text-blue-700">2.3 ETH</div>
        </div>
      </div>
    </div>
    <div className="flex justify-around mt-4">
      <div className="flex items-center">
        <div className="w-3 h-3 bg-[#3b82f6] rounded-full mr-1"></div>
        <span className="text-xs">ETH (45%)</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 bg-[#1d4ed8] rounded-full mr-1"></div>
        <span className="text-xs">USDT (30%)</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 bg-[#6366f1] rounded-full mr-1"></div>
        <span className="text-xs">Other (25%)</span>
      </div>
    </div>
  </div>
);

const WalletAnalysis = ({ onClose }: WalletAnalysisProps) => {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState('transactions');
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState(mockData);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});

  const columns: ColumnsType<TransactionRecord> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      className: 'text-gray-700',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Swap', value: 'Swap' },
        { text: 'Send', value: 'Send' },
        { text: 'Receive', value: 'Receive' },
      ],
      onFilter: (value, record) => record.type.indexOf(value as string) === 0,
      filteredValue: filteredInfo.type as string[] || null,
      render: (text: string) => {
        const colorMap: { [key: string]: string } = {
          'Swap': 'blue',
          'Send': 'red',
          'Receive': 'green',
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
      className: 'font-medium',
    },
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
      filters: [
        { text: 'ETH', value: 'ETH' },
        { text: 'USDT', value: 'USDT' },
      ],
      onFilter: (value, record) => record.token.indexOf(value as string) === 0,
      filteredValue: filteredInfo.token as string[] || null,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          text === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {text}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View details">
            <Button type="text" icon={<InfoCircleOutlined />} size="small" className="text-blue-500" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Use antd's message notification
      const antd = require('antd');
      antd.message.success('Data exported successfully');
    }, 1500);
  };

  const handleTableChange = (_: any, filters: Record<string, any>) => {
    setFilteredInfo(filters);
  };

  const handleClearFilters = () => {
    setFilteredInfo({});
  };

  const tabItems = [
    {
      key: 'transactions',
      label: 'Transactions',
      children: (
        <>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex gap-2">
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                onClick={handleExport}
                loading={loading}
                className="btn-ripple"
              >
                Export
              </Button>
              <Button 
                icon={<FilterOutlined />} 
                onClick={handleClearFilters}
                className="btn-ripple"
              >
                Clear Filters
              </Button>
            </div>
            <div className="text-gray-600 text-sm">
              {dataSource.length} transactions found
            </div>
          </div>
          
          {dataSource.length > 0 ? (
            <Table 
              columns={columns}
              dataSource={dataSource}
              className="shadow-sm rounded-lg overflow-hidden"
              onChange={handleTableChange}
              pagination={{ pageSize: 5 }}
              rowClassName="hover:bg-blue-50 transition-colors"
            />
          ) : (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
              description={
                <span className="text-gray-500">No transaction data available</span>
              }
            />
          )}
        </>
      ),
    },
    {
      key: 'analytics',
      label: 'Analytics',
      children: (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="Weekly Activity" className="shadow-sm hover-lift">
              <SimpleBarChart />
            </Card>
            <Card title="Token Distribution" className="shadow-sm hover-lift">
              <SimplePieChart />
            </Card>
          </div>
          <Card title="Transaction Summary" className="mt-4 shadow-sm hover-lift">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-blue-500 text-lg mb-1">Total Sent</div>
                <div className="font-bold text-2xl">2.3 ETH</div>
                <div className="text-green-500 text-sm">+12% this week</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-purple-500 text-lg mb-1">Total Received</div>
                <div className="font-bold text-2xl">3.1 ETH</div>
                <div className="text-red-500 text-sm">-5% this week</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-green-500 text-lg mb-1">Net Balance</div>
                <div className="font-bold text-2xl">+0.8 ETH</div>
                <div className="text-blue-500 text-sm">~$1,320</div>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 fade-in">
      <div className="mb-4">
        <p className="text-gray-600 font-medium">
          Connected Wallet: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
        </p>
      </div>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={tabItems}
        className="wallet-tabs"
      />

      {!address && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-4">
          <p className="text-yellow-700">Please connect your wallet to view your analysis.</p>
        </div>
      )}
    </div>
  );
};

export default WalletAnalysis; 