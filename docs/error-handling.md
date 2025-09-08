# Error Handling & Logging Strategy

## 🎯 目标
为Eufy PRISM E28系统建立统一的错误处理和日志记录策略，确保生产环境的稳定性和可维护性。

## 📊 错误分类

### 1. 客户端错误 (4xx)
- **400 Bad Request**: 请求参数错误
- **401 Unauthorized**: 身份验证失败
- **403 Forbidden**: 权限不足
- **404 Not Found**: 资源不存在
- **429 Too Many Requests**: 请求频率超限

### 2. 服务器错误 (5xx)
- **500 Internal Server Error**: 内部服务器错误
- **502 Bad Gateway**: 上游服务错误
- **503 Service Unavailable**: 服务暂时不可用
- **504 Gateway Timeout**: 网关超时

## 🛠 实现策略

### Next.js应用错误处理
```javascript
// apps/[module]/src/middleware.ts
export function middleware(request) {
  try {
    // Request processing
  } catch (error) {
    console.error('[Middleware Error]', {
      url: request.url,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    return new Response('Internal Server Error', { status: 500 });
  }
}

// apps/[module]/src/pages/_error.tsx  
function Error({ statusCode, hasGetInitialPropsRun, err }) {
  useEffect(() => {
    if (err) {
      // Log client-side errors
      console.error('[Client Error]', {
        message: err.message,
        stack: err.stack,
        statusCode,
        timestamp: new Date().toISOString()
      });
    }
  }, [err, statusCode]);
  
  return <ErrorPage statusCode={statusCode} />;
}
```

### API路由错误处理
```javascript
// Unified error handler for API routes
export function withErrorHandler(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('[API Error]', {
        method: req.method,
        url: req.url,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  };
}
```

## 📋 日志格式标准

### 统一日志格式
```json
{
  "timestamp": "2025-09-07T10:30:00.000Z",
  "level": "error|warn|info|debug",
  "service": "intelligence|dam|geo|gem|sandbox|gateway",
  "message": "Error description",
  "context": {
    "userId": "user-id",
    "requestId": "request-uuid",
    "url": "/api/endpoint",
    "method": "GET|POST|PUT|DELETE",
    "statusCode": 500,
    "duration": 1500
  },
  "error": {
    "name": "Error name",
    "message": "Error message", 
    "stack": "Stack trace"
  }
}
```

## 🔧 监控集成

### Grafana告警规则
- **高错误率**: 5xx错误率 > 5%
- **响应超时**: 平均响应时间 > 2秒
- **服务不可用**: 健康检查失败 > 3次
- **资源耗尽**: CPU > 80%, 内存 > 90%

### 自动恢复机制
- **重启策略**: 连续错误 > 10次自动重启
- **熔断器**: 依赖服务错误率 > 20%触发熔断
- **限流**: 异常流量自动限流保护
- **降级**: 关键服务故障时启用降级模式

## 🚨 故障处理流程

1. **检测**: 自动监控系统检测异常
2. **告警**: 通过多渠道发送告警通知
3. **定位**: 根据日志快速定位问题原因
4. **修复**: 实施修复方案或启用降级
5. **验证**: 确认问题解决并系统稳定
6. **总结**: 记录问题和改进措施

## 📝 实施清单

- [x] 错误处理策略文档
- [ ] 统一错误处理中间件
- [ ] API错误响应标准化
- [ ] 客户端错误边界组件
- [ ] 日志聚合配置
- [ ] Grafana监控面板
- [ ] 告警规则配置
- [ ] 自动恢复脚本
- [ ] 故障演练计划

---
*最后更新: 2025-09-07*