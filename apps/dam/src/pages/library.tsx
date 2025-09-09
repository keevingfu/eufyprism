import React, { useState, useEffect } from 'react';
import {
  Layout,
  Input,
  Select,
  Button,
  Space,
  Row,
  Col,
  Card,
  Drawer,
  Empty,
  Spin,
  Typography,
  Segmented,
  Statistic,
  Tag,
  message,
} from 'antd';
import {
  SearchOutlined,
  UploadOutlined,
  AppstoreOutlined,
  BarsOutlined,
  ReloadOutlined,
  FolderOpenOutlined,
  CloudServerOutlined,
} from '@ant-design/icons';
import type { NextPage } from 'next';
import { AssetGrid } from '../components/AssetGrid';
import { UploadZone } from '../components/UploadZone';
import DateRangeFilter from '../components/DateRangeFilter';
import { Asset, AssetType, AssetFilter, Tag as AssetTag } from '../types/dam';
import axios from 'axios';
import type { Dayjs } from 'dayjs';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const Library: NextPage = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadDrawerVisible, setUploadDrawerVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<AssetFilter>({});
  const [availableTags, setAvailableTags] = useState<AssetTag[]>([]);
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalSize: 0,
    recentUploads: 0,
  });

  // Fetch tags
  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/tags');
      setAvailableTags(response.data);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/assets', { params: filters });
        setAssets(response.data.assets);
        setStats(response.data.stats);
      } catch (error) {
        message.error('Failed to fetch assets');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssets();
    fetchTags();
  }, [filters]);

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value });
  };

  const handleTypeFilter = (types: AssetType[]) => {
    setFilters({ ...filters, type: types });
  };

  const handleTagFilter = (tags: string[]) => {
    setFilters({ ...filters, tags });
  };

  const handleDateRangeFilter = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setFilters({
        ...filters,
        dateRange: {
          from: dates[0].toDate(),
          to: dates[1].toDate(),
        },
      });
    } else {
      const { dateRange: _, ...rest } = filters;
      setFilters(rest);
    }
  };

  const handleUpload = async (uploads: {file: File; tags: string[]}[]) => {
    try {
      const formData = new FormData();
      uploads.forEach((upload) => {
        formData.append('files', upload.file);
        formData.append('tags', JSON.stringify(upload.tags));
      });

      await axios.post('/api/assets/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Assets uploaded successfully');
      fetchAssets();
      setUploadDrawerVisible(false);
    } catch (error) {
      message.error('Failed to upload assets');
    }
  };

  const handleDownload = async (asset: Asset) => {
    try {
      const response = await axios.get(`/api/assets/${asset.id}/download`);
      window.open(response.data.url, '_blank');
    } catch (error) {
      message.error('Failed to download asset');
    }
  };

  const handleDelete = async (assetId: string) => {
    try {
      await axios.delete(`/api/assets/${assetId}`);
      message.success('Asset deleted successfully');
      fetchAssets();
    } catch (error) {
      message.error('Failed to delete asset');
    }
  };

  const formatStorageSize = (bytes: number): string => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Row justify="space-between" align="middle" style={{ height: '100%' }}>
          <Col>
            <Space align="center">
              <FolderOpenOutlined style={{ fontSize: 24 }} />
              <Title level={4} style={{ margin: 0 }}>Digital Asset Library</Title>
            </Space>
          </Col>
          <Col>
            <Space>
              <Statistic
                title="Total Assets"
                value={stats.totalAssets}
                prefix={<CloudServerOutlined />}
              />
              <Statistic
                title="Storage Used"
                value={formatStorageSize(stats.totalSize)}
              />
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={() => setUploadDrawerVisible(true)}
              >
                Upload Assets
              </Button>
            </Space>
          </Col>
        </Row>
      </Header>

      <Layout>
        <Sider width={300} style={{ background: '#fff', padding: 16 }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card title="Filters" size="small">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Input.Search
                  placeholder="Search assets..."
                  onSearch={handleSearch}
                  prefix={<SearchOutlined />}
                />

                <Select
                  mode="multiple"
                  placeholder="Asset types"
                  style={{ width: '100%' }}
                  onChange={handleTypeFilter}
                  options={[
                    { label: 'Images', value: AssetType.IMAGE },
                    { label: 'Videos', value: AssetType.VIDEO },
                    { label: 'Documents', value: AssetType.DOCUMENT },
                    { label: 'Audio', value: AssetType.AUDIO },
                    { label: 'Archives', value: AssetType.ARCHIVE },
                  ]}
                />

                <Select
                  mode="multiple"
                  placeholder="Tags"
                  style={{ width: '100%' }}
                  onChange={handleTagFilter}
                  options={availableTags.map((tag) => ({
                    label: tag.name,
                    value: tag.name,
                  }))}
                />

                <DateRangeFilter
                  onChange={handleDateRangeFilter}
                />
              </Space>
            </Card>

            <Card title="Quick Stats" size="small">
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Row justify="space-between">
                  <Text>Recent uploads (7d)</Text>
                  <Text strong>{stats.recentUploads}</Text>
                </Row>
                <Row justify="space-between">
                  <Text>AI-tagged assets</Text>
                  <Text strong>{assets.filter(a => a.aiTags.length > 0).length}</Text>
                </Row>
                <Row justify="space-between">
                  <Text>Multi-version assets</Text>
                  <Text strong>{assets.filter(a => a.versions.length > 1).length}</Text>
                </Row>
              </Space>
            </Card>

            <Card title="Popular Tags" size="small">
              <Space size={[0, 8]} wrap>
                {availableTags.slice(0, 10).map((tag) => (
                  <Tag
                    key={tag.id}
                    color={tag.color}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleTagFilter([tag.name])}
                  >
                    {tag.name}
                  </Tag>
                ))}
              </Space>
            </Card>
          </Space>
        </Sider>

        <Content style={{ padding: 24 }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Text type="secondary">
                  Showing {assets.length} assets
                  {filters.search && ` matching "${filters.search}"`}
                </Text>
              </Col>
              <Col>
                <Space>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={fetchAssets}
                    loading={loading}
                  >
                    Refresh
                  </Button>
                  <Segmented
                    value={viewMode}
                    onChange={(value) => setViewMode(value as 'grid' | 'list')}
                    options={[
                      { label: 'Grid', value: 'grid', icon: <AppstoreOutlined /> },
                      { label: 'List', value: 'list', icon: <BarsOutlined /> },
                    ]}
                  />
                </Space>
              </Col>
            </Row>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 100 }}>
                <Spin size="large" />
              </div>
            ) : assets.length > 0 ? (
              <AssetGrid
                assets={assets}
                onDownload={handleDownload}
                onDelete={handleDelete}
                // Add other handlers as needed
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_DEFAULT}
                description="No assets found"
              >
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => setUploadDrawerVisible(true)}
                >
                  Upload First Asset
                </Button>
              </Empty>
            )}
          </Space>
        </Content>
      </Layout>

      <Drawer
        title="Upload Assets"
        placement="right"
        width={600}
        onClose={() => setUploadDrawerVisible(false)}
        open={uploadDrawerVisible}
      >
        <UploadZone
          onUpload={handleUpload}
          availableTags={availableTags}
        />
      </Drawer>
    </Layout>
  );
};

export default Library;