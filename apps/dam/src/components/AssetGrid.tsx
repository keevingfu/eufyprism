import React, { useState } from 'react';
import {
  Card,
  Col,
  Row,
  Image,
  Tag,
  Dropdown,
  Button,
  Space,
  Typography,
  Tooltip,
  Badge,
  Modal,
} from 'antd';
import {
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  MoreOutlined,
  FileImageOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  FolderZipOutlined,
  EyeOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { Asset, AssetType, PermissionLevel } from '../types/dam';
import { formatDistanceToNow } from 'date-fns';

const { Text, Title } = Typography;
const { Meta } = Card;

interface AssetGridProps {
  assets: Asset[];
  loading?: boolean;
  onEdit?: (asset: Asset) => void;
  onDelete?: (assetId: string) => void;
  onDownload?: (asset: Asset) => void;
  onShare?: (asset: Asset) => void;
  onView?: (asset: Asset) => void;
  userPermissions?: Record<string, PermissionLevel>;
}

export const AssetGrid: React.FC<AssetGridProps> = ({
  assets,
  loading = false,
  onEdit,
  onDelete,
  onDownload,
  onShare,
  onView,
  userPermissions = {},
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case AssetType.IMAGE:
        return <FileImageOutlined />;
      case AssetType.VIDEO:
        return <VideoCameraOutlined />;
      case AssetType.AUDIO:
        return <AudioOutlined />;
      case AssetType.DOCUMENT:
        return <FileTextOutlined />;
      case AssetType.ARCHIVE:
        return <FolderZipOutlined />;
      default:
        return <FileTextOutlined />;
    }
  };

  const hasPermission = (asset: Asset, level: PermissionLevel): boolean => {
    const userLevel = userPermissions[asset.id] || PermissionLevel.VIEW;
    const levels = [PermissionLevel.VIEW, PermissionLevel.USE, PermissionLevel.EDIT, PermissionLevel.MANAGE];
    return levels.indexOf(userLevel) >= levels.indexOf(level);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handlePreview = (asset: Asset) => {
    setPreviewAsset(asset);
    setPreviewVisible(true);
  };

  const renderAssetPreview = (asset: Asset) => {
    if (asset.type === AssetType.IMAGE && asset.thumbnailUrl) {
      return (
        <Image
          alt={asset.name}
          src={asset.thumbnailUrl}
          preview={false}
          style={{ height: 200, objectFit: 'cover' }}
          placeholder={
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getAssetIcon(asset.type)}
            </div>
          }
        />
      );
    }

    return (
      <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
        <span style={{ fontSize: 48 }}>
          {getAssetIcon(asset.type)}
        </span>
      </div>
    );
  };

  const getMenuItems = (asset: Asset) => {
    const items = [];

    if (onView) {
      items.push({
        key: 'view',
        icon: <EyeOutlined />,
        label: 'View Details',
        onClick: () => onView(asset),
      });
    }

    if (onDownload && hasPermission(asset, PermissionLevel.USE)) {
      items.push({
        key: 'download',
        icon: <DownloadOutlined />,
        label: 'Download',
        onClick: () => onDownload(asset),
      });
    }

    if (onShare && hasPermission(asset, PermissionLevel.USE)) {
      items.push({
        key: 'share',
        icon: <ShareAltOutlined />,
        label: 'Share',
        onClick: () => onShare(asset),
      });
    }

    if (onEdit && hasPermission(asset, PermissionLevel.EDIT)) {
      items.push({
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => onEdit(asset),
      });
    }

    if (onDelete && hasPermission(asset, PermissionLevel.MANAGE)) {
      items.push({
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => {
          Modal.confirm({
            title: 'Delete Asset',
            content: `Are you sure you want to delete "${asset.name}"?`,
            okText: 'Delete',
            okType: 'danger',
            onOk: () => onDelete(asset.id),
          });
        },
        danger: true,
      });
    }

    return items;
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        {assets.map((asset) => (
          <Col key={asset.id} xs={24} sm={12} md={8} lg={6}>
            <Badge.Ribbon
              text={`v${asset.versions.length}`}
              color="blue"
              style={{ display: asset.versions.length > 1 ? 'block' : 'none' }}
            >
              <Card
                hoverable
                loading={loading}
                cover={renderAssetPreview(asset)}
                actions={[
                  <Tooltip key="views" title="Views">
                    <Space>
                      <EyeOutlined />
                      {asset.analytics.views}
                    </Space>
                  </Tooltip>,
                  <Tooltip key="downloads" title="Downloads">
                    <Space>
                      <DownloadOutlined />
                      {asset.analytics.downloads}
                    </Space>
                  </Tooltip>,
                  <Dropdown
                    key="more"
                    menu={{ items: getMenuItems(asset) }}
                    trigger={['click']}
                  >
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>,
                ]}
                onClick={() => handlePreview(asset)}
              >
                <Meta
                  title={
                    <Tooltip title={asset.name}>
                      <Text ellipsis>{asset.name}</Text>
                    </Tooltip>
                  }
                  description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Space size="small">
                        <Text type="secondary">{formatFileSize(asset.size)}</Text>
                        <Text type="secondary">•</Text>
                        <Text type="secondary">
                          {formatDistanceToNow(new Date(asset.updatedAt), { addSuffix: true })}
                        </Text>
                      </Space>
                      <Space size={[0, 4]} wrap>
                        {asset.tags.slice(0, 3).map((tag) => (
                          <Tag key={tag.id} color={tag.color}>
                            {tag.name}
                          </Tag>
                        ))}
                        {asset.tags.length > 3 && (
                          <Tag>+{asset.tags.length - 3} more</Tag>
                        )}
                      </Space>
                      {asset.aiTags.length > 0 && (
                        <Space size={[0, 4]} wrap>
                          <TagsOutlined style={{ fontSize: 12 }} />
                          {asset.aiTags.slice(0, 2).map((aiTag, index) => (
                            <Tag key={index} color="blue" style={{ fontSize: 10 }}>
                              {aiTag.label} ({Math.round(aiTag.confidence * 100)}%)
                            </Tag>
                          ))}
                        </Space>
                      )}
                    </Space>
                  }
                />
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>

      <Modal
        open={previewVisible}
        title={previewAsset?.name}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        {previewAsset && (
          <div>
            {previewAsset.type === AssetType.IMAGE ? (
              <Image
                src={previewAsset.url}
                alt={previewAsset.name}
                style={{ width: '100%' }}
              />
            ) : (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <span style={{ fontSize: 64 }}>
                  {getAssetIcon(previewAsset.type)}
                </span>
                <Title level={4} style={{ marginTop: 20 }}>
                  {previewAsset.name}
                </Title>
                <Text type="secondary">{formatFileSize(previewAsset.size)}</Text>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};