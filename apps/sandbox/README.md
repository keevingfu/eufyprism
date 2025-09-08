# Eufy E28 Smart Decision Sandbox

智能营销战略模拟与决策系统

## 功能特性

### 🎯 战略模拟器
- **市场参数配置**: 市场规模、竞争对手数量、初始市场份额
- **定价策略**: 竞争定价、渗透定价、高端定价、动态定价
- **推广策略**: 多渠道预算分配和效果预测
- **产品策略**: 质量等级设置和创新速度配置
- **预算管理**: 智能预算分配和ROI预测

### 📊 数据可视化
- **3D图表**: 基于Three.js的立体数据展示
- **热力图**: D3.js驱动的渠道效果热力图
- **关系网络**: 营销要素关系网络图
- **趋势分析**: 实时业绩趋势和竞争对比
- **ROI分析**: 渠道投资回报率树状图

### 🔍 场景分析
- **What-if分析**: 多种策略场景对比
- **敏感性分析**: 关键因素影响评估
- **风险评估**: 基于概率的风险等级评定
- **成功率预测**: AI驱动的策略成功概率
- **实施路线图**: 分阶段策略实施建议

### 🤖 AI决策引擎
- **智能推荐**: 基于数据的策略建议
- **风险评估**: 多维度风险分析
- **竞争分析**: 竞争优势识别
- **市场洞察**: 深度市场趋势分析
- **优化建议**: 自动化改进方案

### 👥 实时协作
- **多人同步**: WebSocket实时协作
- **决策记录**: 协作决策过程追踪
- **消息系统**: 团队沟通和讨论
- **权限管理**: 基于角色的访问控制
- **版本历史**: 决策版本管理

## 技术架构

### 前端技术栈
- **Next.js 14**: React框架，支持SSR和静态生成
- **TypeScript**: 类型安全的JavaScript超集
- **Tailwind CSS**: 实用性优先的CSS框架
- **Framer Motion**: 动画和交互效果
- **Radix UI**: 无样式、可访问的UI组件

### 数据可视化
- **D3.js**: 强大的数据驱动文档库
- **Three.js**: 3D图形渲染引擎
- **Recharts**: React图表组件库
- **Canvas API**: 原生图形绘制

### 状态管理
- **Zustand**: 轻量级状态管理
- **React Query**: 服务器状态管理
- **Context API**: React内置状态共享

### 实时通信
- **Socket.io**: WebSocket实时通信
- **Server-Sent Events**: 服务器推送
- **WebRTC**: 点对点通信（未来版本）

## 核心算法

### 市场模拟算法
```typescript
// 市场份额变化计算
shareChange = (marketingImpact + priceImpact + qualityImpact - competitorImpact) * seasonalityFactor

// 客户获取成本
CAC = (marketingSpend * channelEffectiveness) / newCustomers

// 客户生命周期价值
LTV = averageOrderValue * purchaseFrequency * customerLifespan
```

### AI推荐算法
- **协同过滤**: 基于历史成功案例
- **内容过滤**: 基于策略特征匹配
- **深度学习**: 神经网络模式识别
- **遗传算法**: 策略参数优化

### 风险评估模型
```
风险评分 = 复杂度(0.3) + 脆弱性(0.25) + 资源使用(0.2) + 失败概率(0.15) + 时间因子(0.1)
```

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   ├── simulator/         # 战略模拟器页面
│   ├── visualizer/        # 数据可视化页面
│   └── scenarios/         # 场景分析页面
├── components/            # 可复用组件
│   ├── StrategyMap.tsx    # 战略地图组件
│   └── DecisionTree.tsx   # 决策树组件
├── services/              # 业务逻辑服务
│   ├── simulator.ts       # 模拟引擎
│   ├── ai-advisor.ts      # AI顾问
│   └── collaboration.ts   # 协作服务
├── types/                 # TypeScript类型定义
└── utils/                 # 工具函数
```

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
npm start
```

### 代码检查
```bash
npm run lint
```

### 类型检查
```bash
npm run type-check
```

## 使用指南

### 1. 创建新的模拟
1. 进入"战略模拟"页面
2. 配置市场参数、定价策略、推广策略等
3. 点击"开始模拟"运行分析
4. 查看结果和AI建议

### 2. 数据可视化
1. 进入"数据可视化"页面
2. 选择可视化类型（趋势、热力图、网络等）
3. 交互式探索数据
4. 导出图表和报告

### 3. 场景分析
1. 进入"场景分析"页面
2. 创建或选择预定义场景
3. 对比不同策略的预期结果
4. 查看敏感性分析和AI建议

### 4. 团队协作
1. 创建协作会话
2. 邀请团队成员加入
3. 实时讨论和决策
4. 共享屏幕和注释

## 配置选项

### 环境变量
```env
NEXT_PUBLIC_API_URL=        # API服务地址
NEXT_PUBLIC_WS_URL=         # WebSocket服务地址
NEXT_PUBLIC_ENV=            # 环境标识
```

### 模拟参数配置
- **市场规模**: 100万 - 5000万
- **模拟时长**: 3 - 36个月
- **竞争对手**: 1 - 20个
- **质量等级**: 1 - 10级
- **创新速度**: 0 - 10个功能/季度

## 性能优化

### 前端优化
- **代码分割**: 按路由和组件懒加载
- **图像优化**: Next.js Image组件自动优化
- **缓存策略**: 静态资源和API响应缓存
- **Bundle分析**: 定期分析包大小

### 可视化优化
- **Canvas渲染**: 大数据量使用Canvas而非SVG
- **虚拟化**: 长列表和大表格虚拟滚动
- **WebGL**: 复杂3D场景硬件加速
- **Worker**: 计算密集任务使用Web Worker

### 协作优化
- **防抖**: 减少频繁的状态同步
- **压缩**: WebSocket消息压缩
- **批量操作**: 合并多个小更新
- **离线缓存**: 支持离线编辑模式

## 扩展开发

### 添加新的可视化类型
1. 在`visualizer/page.tsx`中添加新选项
2. 实现相应的图表组件
3. 添加必要的数据处理逻辑
4. 更新类型定义

### 扩展AI功能
1. 在`ai-advisor.ts`中添加新的分析方法
2. 定义相应的数据结构
3. 集成到用户界面
4. 添加测试用例

### 增强协作功能
1. 扩展`collaboration.ts`服务
2. 实现新的实时同步特性
3. 更新WebSocket事件处理
4. 优化用户体验

## 测试策略

### 单元测试
- 使用Jest和React Testing Library
- 测试覆盖率目标：80%+
- 重点测试业务逻辑和工具函数

### 集成测试
- API端点测试
- 数据库操作测试
- 第三方服务集成测试

### E2E测试
- 使用Playwright进行端到端测试
- 关键用户流程覆盖
- 跨浏览器兼容性测试

## 部署指南

### Docker部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3004
CMD ["npm", "start"]
```

### Kubernetes部署
- 提供Helm Charts
- 支持水平扩展
- 集成监控和日志

### CI/CD流水线
- GitHub Actions自动化部署
- 自动测试和代码质量检查
- 蓝绿部署策略

## 监控和调试

### 应用监控
- **性能指标**: Core Web Vitals跟踪
- **错误监控**: 实时错误捕获和报告
- **用户行为**: 关键操作漏斗分析
- **资源使用**: 内存、CPU使用监控

### 调试工具
- **React DevTools**: 组件状态调试
- **Redux DevTools**: 状态管理调试（如果使用）
- **网络面板**: API调用分析
- **性能面板**: 渲染性能分析

## 贡献指南

### 开发规范
- 遵循ESLint和Prettier配置
- 使用Conventional Commits规范
- 代码审查必须通过
- 测试覆盖率不低于当前水平

### Pull Request流程
1. Fork项目并创建特性分支
2. 完成开发和测试
3. 更新相关文档
4. 提交Pull Request
5. 通过代码审查后合并

## 许可证

本项目采用MIT许可证 - 详情请查看[LICENSE](LICENSE)文件。

## 联系方式

- **项目维护者**: Eufy PRISM团队
- **邮箱**: dev@eufy-prism.com
- **文档**: https://docs.eufy-prism.com
- **问题反馈**: https://github.com/eufy-prism/sandbox/issues