import React from 'react';
import { useRouter } from 'next/router';
import { Result, Button, Layout, Card, Row, Col, Statistic, Typography, Space } from 'antd';
import {
  FolderOpenOutlined,
  CloudServerOutlined,
  BarChartOutlined,
  TagsOutlined,
  SecurityScanOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import type { NextPage } from 'next';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home: NextPage = () => {
  const router = useRouter();

  const features = [
    {
      icon: <CloudServerOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      title: '10TB+ Storage',
      description: 'Scalable storage solution with MinIO integration',
    },
    {
      icon: <TagsOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
      title: 'AI Tagging',
      description: 'Automatic asset tagging with TensorFlow.js',
    },
    {
      icon: <SecurityScanOutlined style={{ fontSize: 48, color: '#722ed1' }} />,
      title: 'Permission Control',
      description: 'Granular access control with 4 permission levels',
    },
    {
      icon: <BarChartOutlined style={{ fontSize: 48, color: '#fa8c16' }} />,
      title: 'Performance Analytics',
      description: 'Track usage, conversion rates, and ROI',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '50px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Result
            icon={<FolderOpenOutlined style={{ fontSize: 72, color: '#1890ff' }} />}
            title={<Title level={2}>Eufy E28 Digital Asset Management</Title>}
            subTitle="Enterprise-grade asset management with AI-powered organization"
            extra={[
              <Button
                key="library"
                type="primary"
                size="large"
                icon={<FolderOpenOutlined />}
                onClick={() => router.push('/library')}
              >
                Open Asset Library
              </Button>,
              <Button
                key="analytics"
                size="large"
                icon={<BarChartOutlined />}
                onClick={() => router.push('/analytics')}
              >
                View Analytics
              </Button>,
            ]}
          />

          <Row gutter={[24, 24]} style={{ marginTop: 50 }}>
            <Col span={24}>
              <Card>
                <Title level={4}>System Overview</Title>
                <Row gutter={16}>
                  <Col xs={24} sm={8}>
                    <Statistic
                      title="Total Storage Capacity"
                      value="10"
                      suffix="TB+"
                      prefix={<CloudServerOutlined />}
                    />
                  </Col>
                  <Col xs={24} sm={8}>
                    <Statistic
                      title="AI Models"
                      value="3"
                      suffix="Active"
                      prefix={<RocketOutlined />}
                    />
                  </Col>
                  <Col xs={24} sm={8}>
                    <Statistic
                      title="Version History"
                      value="10"
                      suffix="Versions"
                      prefix={<SecurityScanOutlined />}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            {features.map((feature, index) => (
              <Col key={index} xs={24} sm={12} lg={6}>
                <Card hoverable style={{ height: '100%', textAlign: 'center' }}>
                  <Space direction="vertical" size="large">
                    {feature.icon}
                    <Title level={4}>{feature.title}</Title>
                    <Paragraph type="secondary">{feature.description}</Paragraph>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          <Card style={{ marginTop: 24 }}>
            <Title level={4}>Key Features</Title>
            <Paragraph>
              <ul>
                <li><strong>Intelligent Asset Organization:</strong> AI-powered tagging with MobileNet and COCO-SSD for automatic categorization</li>
                <li><strong>Scalable Storage:</strong> MinIO integration supporting 10TB+ with easy expansion</li>
                <li><strong>Version Control:</strong> Keep track of up to 10 versions per asset with rollback capabilities</li>
                <li><strong>Performance Analytics:</strong> Track usage patterns, conversion rates, and asset ROI</li>
                <li><strong>Granular Permissions:</strong> 4-tier permission system (View, Use, Edit, Manage)</li>
                <li><strong>Bulk Operations:</strong> Efficient bulk upload, tagging, and management</li>
                <li><strong>Real-time Search:</strong> Fast asset discovery with multi-criteria filtering</li>
              </ul>
            </Paragraph>
          </Card>

          <Card style={{ marginTop: 24 }}>
            <Title level={4}>Technology Stack</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Paragraph>
                  <strong>Frontend:</strong>
                  <ul>
                    <li>Next.js 14 with TypeScript</li>
                    <li>Ant Design UI Components</li>
                    <li>TensorFlow.js for AI tagging</li>
                    <li>Recharts for analytics visualization</li>
                  </ul>
                </Paragraph>
              </Col>
              <Col xs={24} sm={12}>
                <Paragraph>
                  <strong>Backend & Storage:</strong>
                  <ul>
                    <li>MinIO for object storage</li>
                    <li>Sharp for image processing</li>
                    <li>Next.js API routes</li>
                    <li>AI models: MobileNet & COCO-SSD</li>
                  </ul>
                </Paragraph>
              </Col>
            </Row>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;