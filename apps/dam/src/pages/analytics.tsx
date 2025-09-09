import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Select,
  Space,
  Typography,
  Table,
  Tag,
  Progress,
  Tabs,
  Empty,
  DatePicker,
} from 'antd';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUpOutlined,
  TrendingDownOutlined,
  DownloadOutlined,
  EyeOutlined,
  ShareAltOutlined,
  StarOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { NextPage } from 'next';
import axios from 'axios';
import { subDays } from 'date-fns';
import dayjs from 'dayjs';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalDownloads: number;
    totalUses: number;
    averagePerformance: number;
    viewsTrend: number;
    downloadsTrend: number;
  };
  timeSeriesData: Array<{
    date: string;
    views: number;
    downloads: number;
    uses: number;
  }>;
  assetTypeDistribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  topPerformingAssets: Array<{
    id: string;
    name: string;
    type: string;
    views: number;
    downloads: number;
    performanceScore: number;
    conversionRate: number;
  }>;
  tagAnalytics: Array<{
    tag: string;
    assetCount: number;
    totalViews: number;
    avgPerformance: number;
  }>;
  storageAnalytics: {
    totalSize: number;
    byType: Array<{
      type: string;
      size: number;
      percentage: number;
    }>;
    growth: Array<{
      date: string;
      size: number;
    }>;
  };
}

const Analytics: NextPage = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    subDays(new Date(), 30),
    new Date(),
  ]);
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'downloads' | 'uses'>('views');

  useEffect(() => {
    const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/analytics', {
        params: {
          from: dateRange[0].toISOString(),
          to: dateRange[1].toISOString(),
        },
      });
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };
    
    fetchAnalytics();
  }, [dateRange]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatStorageSize = (bytes: number): string => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  const renderTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <TrendingUpOutlined style={{ color: '#52c41a' }} />;
    } else if (trend < 0) {
      return <TrendingDownOutlined style={{ color: '#ff4d4f' }} />;
    }
    return null;
  };

  if (loading || !analyticsData) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: 24 }}>
          <Empty description="Loading analytics..." />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Row justify="space-between" align="middle" style={{ height: '100%' }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>Asset Performance Analytics</Title>
          </Col>
          <Col>
            <Space>
              <RangePicker
                value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    setDateRange([dates[0].toDate(), dates[1].toDate()]);
                  }
                }}
              />
            </Space>
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: 24 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Overview Statistics */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Views"
                  value={analyticsData.overview.totalViews}
                  prefix={<EyeOutlined />}
                  suffix={
                    <Space>
                      {renderTrendIcon(analyticsData.overview.viewsTrend)}
                      <Text type="secondary">{Math.abs(analyticsData.overview.viewsTrend)}%</Text>
                    </Space>
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Downloads"
                  value={analyticsData.overview.totalDownloads}
                  prefix={<DownloadOutlined />}
                  suffix={
                    <Space>
                      {renderTrendIcon(analyticsData.overview.downloadsTrend)}
                      <Text type="secondary">{Math.abs(analyticsData.overview.downloadsTrend)}%</Text>
                    </Space>
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Uses"
                  value={analyticsData.overview.totalUses}
                  prefix={<ShareAltOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Avg Performance Score"
                  value={analyticsData.overview.averagePerformance}
                  prefix={<StarOutlined />}
                  suffix="/100"
                  precision={1}
                />
              </Card>
            </Col>
          </Row>

          {/* Tabs for Different Analytics Views */}
          <Tabs 
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: 'Usage Trends',
                children: (
              <Card title="Asset Usage Over Time">
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Select
                      value={selectedMetric}
                      onChange={setSelectedMetric}
                      style={{ marginBottom: 16 }}
                    >
                      <Select.Option value="views">Views</Select.Option>
                      <Select.Option value="downloads">Downloads</Select.Option>
                      <Select.Option value="uses">Uses</Select.Option>
                    </Select>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={analyticsData.timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey={selectedMetric}
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Col>
                </Row>
              </Card>
                )
              },
              {
                key: '2',
                label: 'Asset Distribution',
                children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card title="Asset Types Distribution">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analyticsData.assetTypeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.type}: ${entry.percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {analyticsData.assetTypeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="Storage Usage by Type">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analyticsData.storageAnalytics.byType}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis tickFormatter={(value) => formatStorageSize(value)} />
                        <Tooltip formatter={(value: number) => formatStorageSize(value)} />
                        <Bar dataKey="size" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>
                )
              },
              {
                key: '3',
                label: 'Top Performing Assets',
                children: (
              <Card>
                <Table
                  dataSource={analyticsData.topPerformingAssets}
                  rowKey="id"
                  columns={[
                    {
                      title: 'Asset Name',
                      dataIndex: 'name',
                      key: 'name',
                      render: (text, record) => (
                        <Space>
                          {record.type === 'IMAGE' && <FileImageOutlined />}
                          {record.type === 'VIDEO' && <VideoCameraOutlined />}
                          {record.type === 'DOCUMENT' && <FileTextOutlined />}
                          {text}
                        </Space>
                      ),
                    },
                    {
                      title: 'Type',
                      dataIndex: 'type',
                      key: 'type',
                      render: (type) => <Tag>{type}</Tag>,
                    },
                    {
                      title: 'Views',
                      dataIndex: 'views',
                      key: 'views',
                      sorter: (a, b) => a.views - b.views,
                    },
                    {
                      title: 'Downloads',
                      dataIndex: 'downloads',
                      key: 'downloads',
                      sorter: (a, b) => a.downloads - b.downloads,
                    },
                    {
                      title: 'Performance Score',
                      dataIndex: 'performanceScore',
                      key: 'performanceScore',
                      render: (score) => (
                        <Progress
                          percent={score}
                          size="small"
                          status={score >= 80 ? 'success' : score >= 60 ? 'normal' : 'exception'}
                        />
                      ),
                      sorter: (a, b) => a.performanceScore - b.performanceScore,
                    },
                    {
                      title: 'Conversion Rate',
                      dataIndex: 'conversionRate',
                      key: 'conversionRate',
                      render: (rate) => `${(rate * 100).toFixed(1)}%`,
                      sorter: (a, b) => a.conversionRate - b.conversionRate,
                    },
                  ]}
                  pagination={{ pageSize: 10 }}
                />
              </Card>
                )
              },
              {
                key: '4',
                label: 'Tag Performance',
                children: (
              <Card>
                <Table
                  dataSource={analyticsData.tagAnalytics}
                  rowKey="tag"
                  columns={[
                    {
                      title: 'Tag',
                      dataIndex: 'tag',
                      key: 'tag',
                      render: (tag) => <Tag color="blue">{tag}</Tag>,
                    },
                    {
                      title: 'Asset Count',
                      dataIndex: 'assetCount',
                      key: 'assetCount',
                      sorter: (a, b) => a.assetCount - b.assetCount,
                    },
                    {
                      title: 'Total Views',
                      dataIndex: 'totalViews',
                      key: 'totalViews',
                      sorter: (a, b) => a.totalViews - b.totalViews,
                    },
                    {
                      title: 'Avg Performance',
                      dataIndex: 'avgPerformance',
                      key: 'avgPerformance',
                      render: (score) => (
                        <Progress
                          percent={score}
                          size="small"
                          status={score >= 80 ? 'success' : score >= 60 ? 'normal' : 'exception'}
                        />
                      ),
                      sorter: (a, b) => a.avgPerformance - b.avgPerformance,
                    },
                  ]}
                  pagination={{ pageSize: 10 }}
                />
              </Card>
                )
              },
              {
                key: '5',
                label: 'Storage Growth',
                children: (
              <Card title="Storage Usage Over Time">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analyticsData.storageAnalytics.growth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => formatStorageSize(value)} />
                    <Tooltip formatter={(value: number) => formatStorageSize(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="size" stroke="#8884d8" name="Storage Used" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
                )
              }
            ]}
          />
        </Space>
      </Content>
    </Layout>
  );
};

export default Analytics;