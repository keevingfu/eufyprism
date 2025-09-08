# Eufy E28 Intelligence Module

智能情报系统模块，提供多源数据采集、竞品分析、市场机会识别和分级预警功能。

## 功能特性

### 1. 多源数据采集
- **电商平台**: Amazon产品价格、库存、评价监测
- **搜索引擎**: Google趋势、关键词分析
- **社交媒体**: Facebook、Instagram、Twitter、Reddit、YouTube、TikTok内容监测
- **自动化爬虫**: 使用Playwright实现智能数据抓取

### 2. 竞品分析
- 实时价格监测和历史趋势
- 营销活动跟踪
- 用户评价和情感分析
- 社交媒体影响力评估

### 3. 市场机会识别
- **内容空白**: 高搜索量但缺少内容的主题
- **需求缺口**: 市场需求但供应不足的领域
- **季节趋势**: 基于历史数据的季节性预测
- **新兴关键词**: 快速增长的搜索词
- **竞争对手弱点**: 竞品的负面反馈和弱势领域

### 4. 分级预警系统
- **🟢 绿色**: 正常状态，无需行动
- **🟡 黄色**: 低优先级，建议监控
- **🟠 橙色**: 中等优先级，建议采取行动
- **🔴 红色**: 高优先级，需要立即行动

## 技术架构

### 前端技术栈
- **Next.js 14**: React框架，支持SSR/SSG
- **TypeScript**: 类型安全
- **Material-UI v5**: UI组件库
- **Recharts**: 数据可视化
- **Socket.io**: 实时通信
- **SWR**: 数据获取和缓存

### 后端技术栈
- **Elasticsearch**: 全文搜索和数据分析
- **Playwright**: 网页自动化和数据采集
- **Node-cron**: 定时任务调度
- **Axios**: HTTP客户端

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0
- Elasticsearch 8.x
- Chrome/Chromium (for Playwright)

### 安装步骤

1. 复制环境变量文件
```bash
cp .env.example .env
```

2. 配置环境变量
编辑 `.env` 文件，填入必要的API密钥和配置

3. 安装依赖
```bash
npm install
```

4. 启动Elasticsearch (使用Docker)
```bash
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "ELASTIC_PASSWORD=changeme" \
  docker.elastic.co/elasticsearch/elasticsearch:8.11.0
```

5. 初始化数据库索引
```bash
npm run init-db
```

6. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3010/dashboard

## API端点

### 警报管理
- `GET /api/intelligence/alerts` - 获取警报列表
- `POST /api/intelligence/alerts` - 创建新警报
- `DELETE /api/intelligence/alerts?id={alertId}` - 忽略警报

### 市场机会
- `GET /api/intelligence/opportunities` - 获取市场机会
- `POST /api/intelligence/opportunities` - 标记机会已处理

### 竞品分析
- `GET /api/intelligence/competitors` - 获取竞品数据
- `GET /api/intelligence/competitors/{id}` - 获取特定竞品详情

### 数据采集
- `POST /api/intelligence/crawl` - 手动触发数据采集
- `GET /api/intelligence/crawl/status` - 获取采集任务状态

## 数据采集配置

### 采集频率
- **高优先级** (每5分钟): Amazon、Google
- **中优先级** (每30分钟): 社交媒体平台
- **低优先级** (每小时): YouTube、TikTok视频内容

### 爬虫规则
- 遵守robots.txt
- 使用合理的请求频率
- 实现重试和错误处理
- 使用代理池避免IP封禁

## 部署说明

### 生产环境配置
1. 使用环境变量管理敏感信息
2. 配置Elasticsearch集群
3. 设置爬虫代理池
4. 启用HTTPS
5. 配置监控和日志

### Docker部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3010
CMD ["npm", "start"]
```

## 开发指南

### 添加新的数据源
1. 在 `types/intelligence.ts` 中添加数据源枚举
2. 实现爬虫逻辑在 `services/crawler.ts`
3. 添加数据处理逻辑在 `services/analyzer.ts`
4. 更新UI组件以显示新数据

### 自定义警报规则
1. 修改 `services/analyzer.ts` 中的 `alertThresholds`
2. 实现新的分析方法
3. 添加相应的UI展示

## 故障排除

### Elasticsearch连接失败
- 检查Elasticsearch是否运行
- 验证连接URL和认证信息
- 检查防火墙设置

### 爬虫失败
- 检查目标网站是否可访问
- 验证API密钥是否有效
- 检查代理设置
- 查看错误日志

### 性能优化
- 启用Elasticsearch查询缓存
- 使用SWR进行前端数据缓存
- 实现数据分页
- 优化爬虫并发数

## 许可证

本项目为Eufy内部项目，未经授权不得对外分发。