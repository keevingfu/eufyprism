import React, { useState } from 'react';
import {
  Upload,
  Button,
  Progress,
  Space,
  Typography,
  Tag,
  Select,
  Form,
  Modal,
  message,
  Row,
  Col,
  Card,
  List,
} from 'antd';
import {
  InboxOutlined,
  CloudUploadOutlined,
  FileOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { UploadProps, RcFile, UploadFile } from 'antd/es/upload/interface';
import { AssetUpload, Tag as AssetTag } from '../types/dam';

const { Dragger } = Upload;
const { Text, Title } = Typography;

interface UploadZoneProps {
  onUpload: (uploads: AssetUpload[]) => Promise<void>;
  availableTags?: AssetTag[];
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
}

interface FileUploadStatus {
  file: RcFile;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  tags: string[];
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onUpload,
  availableTags = [],
  maxFileSize = 100, // 100MB default
  acceptedTypes = ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar'],
}) => {
  const [fileList, setFileList] = useState<FileUploadStatus[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    // Check file size
    const isValidSize = file.size / 1024 / 1024 < maxFileSize;
    if (!isValidSize) {
      message.error(`File must be smaller than ${maxFileSize}MB!`);
      return false;
    }

    // Add to file list
    setFileList((prev) => [
      ...prev,
      {
        file,
        status: 'pending',
        progress: 0,
        tags: [...selectedTags],
      },
    ]);

    return false; // Prevent automatic upload
  };

  const handleUpload = async () => {
    const pendingFiles = fileList.filter((f) => f.status === 'pending');
    if (pendingFiles.length === 0) {
      message.warning('No files to upload');
      return;
    }

    setIsUploading(true);

    for (const fileStatus of pendingFiles) {
      try {
        // Update status
        setFileList((prev) =>
          prev.map((f) =>
            f.file.uid === fileStatus.file.uid
              ? { ...f, status: 'uploading', progress: 20 }
              : f
          )
        );

        // Simulate progress (in real app, this would track actual upload progress)
        const progressInterval = setInterval(() => {
          setFileList((prev) =>
            prev.map((f) =>
              f.file.uid === fileStatus.file.uid && f.progress < 90
                ? { ...f, progress: f.progress + 10 }
                : f
            )
          );
        }, 200);

        // Create upload object
        const upload: AssetUpload = {
          file: fileStatus.file as File,
          tags: fileStatus.tags,
        };

        // Perform upload
        await onUpload([upload]);

        clearInterval(progressInterval);

        // Update status to success
        setFileList((prev) =>
          prev.map((f) =>
            f.file.uid === fileStatus.file.uid
              ? { ...f, status: 'success', progress: 100 }
              : f
          )
        );

        message.success(`${fileStatus.file.name} uploaded successfully`);
      } catch (error) {
        // Update status to error
        setFileList((prev) =>
          prev.map((f) =>
            f.file.uid === fileStatus.file.uid
              ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
              : f
          )
        );

        message.error(`Failed to upload ${fileStatus.file.name}`);
      }
    }

    setIsUploading(false);
  };

  const removeFile = (uid: string) => {
    setFileList((prev) => prev.filter((f) => f.file.uid !== uid));
  };

  const clearCompleted = () => {
    setFileList((prev) => prev.filter((f) => f.status !== 'success'));
  };

  const getStatusIcon = (status: FileUploadStatus['status']) => {
    switch (status) {
      case 'uploading':
        return <LoadingOutlined style={{ color: '#1890ff' }} />;
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <FileOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Dragger
            multiple
            beforeUpload={beforeUpload}
            accept={acceptedTypes.join(',')}
            showUploadList={false}
            disabled={isUploading}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">Click or drag files to this area to upload</p>
            <p className="ant-upload-hint">
              Support for single or bulk upload. Max file size: {maxFileSize}MB
            </p>
          </Dragger>

          {fileList.length > 0 && (
            <>
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={5}>Files ({fileList.length})</Title>
                </Col>
                <Col>
                  <Space>
                    <Button onClick={() => setIsModalVisible(true)}>
                      Add Tags to All
                    </Button>
                    <Button onClick={clearCompleted} disabled={isUploading}>
                      Clear Completed
                    </Button>
                    <Button
                      type="primary"
                      icon={<CloudUploadOutlined />}
                      onClick={handleUpload}
                      loading={isUploading}
                      disabled={fileList.filter((f) => f.status === 'pending').length === 0}
                    >
                      Upload All
                    </Button>
                  </Space>
                </Col>
              </Row>

              <List
                dataSource={fileList}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        type="text"
                        danger
                        size="small"
                        onClick={() => removeFile(item.file.uid)}
                        disabled={item.status === 'uploading'}
                      >
                        Remove
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={getStatusIcon(item.status)}
                      title={
                        <Space>
                          <Text>{item.file.name}</Text>
                          <Text type="secondary">({formatFileSize(item.file.size)})</Text>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          {item.status === 'uploading' && (
                            <Progress percent={item.progress} size="small" />
                          )}
                          {item.error && (
                            <Text type="danger" style={{ fontSize: 12 }}>
                              {item.error}
                            </Text>
                          )}
                          {item.tags.length > 0 && (
                            <Space size={[0, 4]} wrap>
                              {item.tags.map((tag, index) => (
                                <Tag key={index} size="small">
                                  {tag}
                                </Tag>
                              ))}
                            </Space>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </>
          )}
        </Space>
      </Card>

      <Modal
        title="Add Tags to All Files"
        open={isModalVisible}
        onOk={() => {
          setFileList((prev) =>
            prev.map((f) => ({
              ...f,
              tags: [...new Set([...f.tags, ...selectedTags])],
            }))
          );
          setIsModalVisible(false);
          message.success('Tags added to all files');
        }}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Select Tags">
            <Select
              mode="tags"
              value={selectedTags}
              onChange={setSelectedTags}
              placeholder="Select or create tags"
              style={{ width: '100%' }}
            >
              {availableTags.map((tag) => (
                <Select.Option key={tag.id} value={tag.name}>
                  {tag.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};