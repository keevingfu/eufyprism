# Eufy PRISM E28 运行状态

## 🚀 应用已成功启动！

### 访问地址

| 服务名称 | 访问地址 | 状态 | 描述 |
|---------|---------|------|------|
| **Intelligence** | http://localhost:3010 | ✅ 运行中 | 营销情报分析平台 |
| **GEM** | http://localhost:3002 | ✅ 运行中 | 全球营销执行管理 |
| **GEO** | http://localhost:3003 | ✅ 运行中 | 地理优化引擎 |
| **Sandbox** | http://localhost:3004 | ✅ 运行中 | 决策沙盒模拟器 |
| **DAM** | http://localhost:3011 | ✅ 运行中 | 数字资产管理 |
| **Gateway** | http://localhost:3030 | ✅ 运行中 | API网关 |

### 基础设施服务

| 服务 | 端口 | 状态 | 用途 |
|------|------|------|------|
| PostgreSQL | 5432 | ✅ 运行中 | 主数据库 |
| Redis | 6379 | ✅ 运行中 | 缓存服务 |
| Elasticsearch | 9200 | ✅ 运行中 | 搜索引擎 |
| RabbitMQ | 5672/15672 | ✅ 运行中 | 消息队列 |
| Grafana | 3001 | ✅ 运行中 | 监控仪表板 |
| Prometheus | 9090 | ✅ 运行中 | 指标收集 |

## 🎯 快速体验

### 1. Intelligence Dashboard (营销情报)
访问: http://localhost:3010/dashboard
- 查看机会追踪
- 竞争对手分析
- 市场动态监控

### 2. GEM Campaigns (营销活动管理)
访问: http://localhost:3002/campaigns
- 创建营销活动
- 管理活动执行
- 查看活动效果

### 3. GEO Optimizer (地理优化)
访问: http://localhost:3003/optimizer
- 区域市场分析
- 地理数据可视化
- 市场潜力评估

### 4. Sandbox Simulator (决策模拟)
访问: http://localhost:3004/simulator
- 场景模拟测试
- 决策影响分析
- 策略效果预测

### 5. DAM Library (资产管理)
访问: http://localhost:3011/library
- 数字资产库
- 内容管理
- 资产分析

## 🛠️ 常用命令

```bash
# 查看所有服务状态
npm run dev

# 停止所有服务
# 在终端中按 Ctrl+C

# 运行健康检查
./scripts/health-check.sh

# 查看服务日志
docker-compose logs -f [服务名]

# 重启特定服务
docker-compose restart [服务名]
```

## 📊 监控面板

- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **RabbitMQ管理界面**: http://localhost:15672 (guest/guest)
- **Elasticsearch**: http://localhost:9200

## ⚠️ 注意事项

1. **首次访问可能较慢**: Next.js需要编译页面
2. **端口冲突**: 如果端口被占用，需要先停止占用的进程
3. **资源消耗**: 完整系统运行需要较多内存（建议8GB+）
4. **浏览器缓存**: 如遇到问题，尝试清除浏览器缓存

## 🔧 故障排除

### 服务无法访问
```bash
# 检查进程
ps aux | grep -E "next|node"

# 查看端口占用
lsof -i :3010,3002,3003,3004,3011,3030

# 重启Docker容器
docker-compose restart
```

### 数据库连接失败
```bash
# 检查PostgreSQL
docker ps | grep postgres
docker logs eufy-postgres

# 重置数据库
docker-compose down
docker-compose up -d
```

---
*启动时间: 2025-09-08*