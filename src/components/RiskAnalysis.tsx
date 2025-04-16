import { Card, Statistic, Progress, Button, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useAccount } from 'wagmi';

interface RiskAnalysisProps {
  onClose: () => void;
}

const RiskAnalysis = ({ onClose }: RiskAnalysisProps) => {
  const { address } = useAccount();

  // Mock data - replace with actual data from Aave
  const healthFactor = 1.1;
  const ethPriceChange = -2.5;

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <p className="text-gray-600">
          Connected Wallet: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <Statistic
            title="Health Factor"
            value={healthFactor}
            precision={2}
            valueStyle={{ color: healthFactor < 1.2 ? '#cf1322' : '#3f8600' }}
          />
          <Progress
            percent={Math.min(healthFactor * 100, 100)}
            status={healthFactor < 1.2 ? 'exception' : 'success'}
            showInfo={false}
            className="mt-4"
          />
          {healthFactor < 1.2 && (
            <p className="text-red-500 mt-2">
              Warning: Health factor is low. Consider adding more collateral.
            </p>
          )}
        </Card>

        <Card>
          <Statistic
            title="ETH Price Change (24h)"
            value={ethPriceChange}
            precision={2}
            valueStyle={{ color: ethPriceChange < 0 ? '#cf1322' : '#3f8600' }}
            prefix={ethPriceChange < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
            suffix="%"
          />
          {ethPriceChange < 0 && (
            <p className="text-red-500 mt-2">
              Warning: ETH price is decreasing. Monitor your positions.
            </p>
          )}
        </Card>
      </div>

      <Space className="mt-4">
        <Button type="primary">Add Collateral</Button>
        <Button>View Position Details</Button>
      </Space>
    </div>
  );
};

export default RiskAnalysis; 