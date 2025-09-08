# Eufy PRISM E28 - 智能营销系统

## 项目概述

Eufy PRISM E28 是一个基于微服务架构的智能营销系统，提供全方位的数字营销解决方案。

### 核心模块

- **智能情报系统 (Intelligence)** - 数据收集与分析
- **数字资产管理 (DAM)** - 营销素材管理
- **内容优化引擎 (GEO)** - 内容生成与优化
- **增长引擎管理 (GEM)** - 营销活动管理
- **决策沙盘系统 (Sandbox)** - 策略模拟与决策支持

## 技术栈

### 前端
- Next.js 14
- TypeScript
- Tailwind CSS
- React Query
- Zustand

### 后端
- Node.js
- Express
- GraphQL (Apollo Server)
- TypeORM

### 数据存储
- PostgreSQL - 主数据库
- Redis - 缓存与会话管理
- Elasticsearch - 搜索引擎
- RabbitMQ - 消息队列

### 监控与运维
- Prometheus - 指标收集
- Grafana - 可视化监控
- Docker - 容器化
- Kubernetes - 编排管理

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/your-org/eufy-prism.git
cd eufy-prism
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
```

4. 启动开发环境服务
```bash
docker-compose up -d
```

5. 启动开发服务器
```bash
npm run dev
```

## 项目结构

```
eufyprism/
├── apps/                # 应用程序
│   ├── intelligence/    # 智能情报模块
│   ├── dam/            # 数字资产管理
│   ├── geo/            # 内容优化引擎
│   ├── gem/            # 增长引擎管理
│   └── sandbox/        # 决策沙盘
├── packages/           # 共享包
│   ├── shared/         # 共享组件库
│   ├── api-client/     # API客户端
│   └── ui-kit/         # UI组件库
├── services/           # 微服务
│   ├── gateway/        # API网关
│   ├── auth/           # 认证服务
│   └── sync/           # 数据同步服务
└── infrastructure/     # 基础设施配置
    ├── docker/         # Docker配置
    ├── k8s/           # Kubernetes配置
    └── terraform/     # 基础设施即代码
```

## 开发指南

### 命令列表

```bash
npm run dev        # 启动开发服务器
npm run build      # 构建所有应用
npm run test       # 运行测试
npm run lint       # 代码检查
npm run format     # 代码格式化
```

### 开发工作流

1. 创建功能分支
2. 开发新功能
3. 编写测试
4. 提交代码评审
5. 合并到主分支

## 部署

项目使用 GitHub Actions 进行 CI/CD，支持以下环境：

- 开发环境 (dev)
- 测试环境 (staging)
- 生产环境 (production)

## 贡献指南

请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解如何为项目做贡献。

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](./LICENSE) 文件了解详情。