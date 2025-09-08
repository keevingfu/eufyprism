# Eufy E28 DAM - Digital Asset Management Module

Enterprise-grade digital asset management system with AI-powered organization and analytics.

## Features

### Core Capabilities
- **10TB+ Asset Storage**: Scalable storage solution using MinIO
- **AI-Powered Tagging**: Automatic asset categorization using TensorFlow.js
- **Granular Permissions**: 4-tier permission system (View, Use, Edit, Manage)
- **Performance Analytics**: Track usage patterns and asset ROI
- **Version Control**: Maintain up to 10 versions per asset
- **Bulk Operations**: Efficient bulk upload and management

### AI Features
- **Image Recognition**: MobileNet for general classification
- **Object Detection**: COCO-SSD for identifying objects in images
- **Automatic Tagging**: Color analysis, orientation detection, content categorization
- **Confidence Scoring**: AI tags include confidence percentages

## Tech Stack

### Frontend
- Next.js 14 with TypeScript
- Ant Design for UI components
- TensorFlow.js for client-side AI
- Recharts for analytics visualization
- React Dropzone for file uploads

### Backend & Storage
- MinIO for object storage
- Sharp for image processing
- Next.js API routes
- Multer for file handling

## Getting Started

### Prerequisites
- Node.js 18+
- MinIO server (or S3-compatible storage)
- 10GB+ available storage

### Installation

1. Install dependencies:
```bash
cd apps/dam
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Configure MinIO:
```bash
# Install MinIO (macOS)
brew install minio/stable/minio

# Start MinIO server
minio server ~/minio-data --console-address :9001
```

4. Run the development server:
```bash
npm run dev
```

The DAM module will be available at `http://localhost:3011`.

## Project Structure

```
apps/dam/
├── src/
│   ├── components/      # React components
│   │   ├── AssetGrid.tsx
│   │   └── UploadZone.tsx
│   ├── services/        # Business logic
│   │   ├── storage.ts   # MinIO integration
│   │   └── tagger.ts    # AI tagging service
│   ├── pages/           # Next.js pages
│   │   ├── library.tsx  # Asset library
│   │   ├── analytics.tsx # Performance analytics
│   │   └── api/         # API endpoints
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── public/              # Static assets
├── package.json
└── tsconfig.json
```

## API Endpoints

### Asset Management
- `GET /api/assets` - List assets with filtering
- `POST /api/assets/upload` - Upload new assets
- `GET /api/assets/[id]` - Get asset details
- `DELETE /api/assets/[id]` - Delete asset
- `GET /api/assets/[id]/download` - Get download URL

### Tags
- `GET /api/tags` - List all tags
- `POST /api/tags` - Create new tag
- `PUT /api/tags/[id]` - Update tag
- `DELETE /api/tags/[id]` - Delete tag

### Analytics
- `GET /api/analytics` - Get performance analytics
- `GET /api/analytics/assets/[id]` - Get asset-specific analytics

## Configuration

### Storage Configuration
Configure MinIO in your environment:
```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=eufy-dam-assets
```

### AI Model Configuration
The AI models load automatically on first use. To optimize performance:
- Use GPU acceleration when available
- Pre-warm models on server start
- Cache model predictions

## Usage

### Uploading Assets
1. Click "Upload Assets" button
2. Drag and drop files or click to browse
3. Add tags (optional)
4. Click "Upload All"

### Managing Assets
- **View**: Click on any asset to preview
- **Download**: Use the download action in the asset menu
- **Edit**: Update tags and metadata
- **Delete**: Remove assets (requires Manage permission)

### Analytics
- View usage trends over time
- Analyze asset type distribution
- Track top-performing assets
- Monitor storage growth

## Performance Optimization

### Image Optimization
- Automatic thumbnail generation
- Progressive loading
- WebP format support (coming soon)

### Caching Strategy
- Browser caching for static assets
- CDN integration ready
- Presigned URL caching

### AI Optimization
- Model preloading
- Batch processing for bulk uploads
- Result caching

## Security

### Permission Levels
1. **View**: Can view assets
2. **Use**: Can download and use assets
3. **Edit**: Can modify asset metadata
4. **Manage**: Full control including delete

### Best Practices
- Use presigned URLs for secure downloads
- Implement rate limiting
- Regular security audits
- Encrypted storage options

## Roadmap

### Phase 1 (Current)
- ✅ Basic asset management
- ✅ AI tagging
- ✅ Analytics dashboard
- ✅ Permission system

### Phase 2
- [ ] Database integration
- [ ] Advanced search
- [ ] Collections/Folders
- [ ] Workflow automation

### Phase 3
- [ ] Video processing
- [ ] CDN integration
- [ ] Mobile app
- [ ] API SDK

## Contributing

See the main project README for contribution guidelines.

## License

Part of the Eufy PRISM platform.