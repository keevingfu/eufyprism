# EUFY PRISM E28 - Intelligent Marketing Decision System

## Project Overview

**Eufy PRISM E28** is a complete intelligent marketing decision support system built with microservices architecture and Claude-Flow v2.0.0 Alpha collaborative development framework.

### 🎯 System Goals
Build an enterprise-grade marketing intelligence platform integrating **Intelligence** + **Digital Asset Management (DAM)** + **Geographic Content Engine (GEO)** + **Growth Engine Management (GEM)** + **Intelligent Decision Sandbox**.

### 🌐 Language Requirements
**IMPORTANT**: All code, pages, and documentation must be in English. Chinese characters are not allowed in any part of the system.

## 🏗️ Architecture Overview

### Core Services Architecture (Microservices)
```
eufy-prism/ (Turborepo Monorepo)
├── apps/                          # 5 core microservices
│   ├── intelligence/   (3010)     # Intelligence System
│   ├── dam/            (3011)     # Digital Asset Management [Needs Fix]
│   ├── geo/            (3003)     # Geographic Content Engine  
│   ├── gem/            (3002)     # Growth Engine Management
│   └── sandbox/        (3004)     # Intelligent Decision Sandbox
├── services/                      # Support services
│   └── gateway/        (3030)     # API Gateway [To be started]
├── packages/                      # Shared component libraries
│   ├── shared/                    # Shared utilities and types
│   ├── ui-kit/                    # UI component library
│   └── api-client/                # API client
└── infrastructure/                # Infrastructure configuration
    └── docker-compose.yml         # Container orchestration
```

### 🌐 Infrastructure Layer (Docker)
- **PostgreSQL** (5434) - Main database ✅
- **Redis** (6380) - Cache and sessions ✅  
- **Elasticsearch** (9200) - Search and analytics ✅
- **RabbitMQ** (15672) - Message queue ✅
- **Grafana** (3001) - Monitoring dashboard ✅
- **Prometheus** (9090) - Metrics collection ✅

## 🔧 Tech Stack

### Frontend Framework
- **Next.js 14** (App Router) - All modules
- **TypeScript** - Type safety
- **Multiple UI Libraries**:
  - Intelligence: Material-UI (MUI)
  - DAM: Ant Design
  - GEO: Next.js + Tailwind CSS
  - GEM: Chakra UI
  - Sandbox: Tailwind CSS + Radix UI

### Backend & APIs
- **Next.js API Routes** - Server-side API
- **Express Gateway** - API gateway service
- **Socket.io** - Real-time communication

### AI & Analytics
- **TensorFlow.js** - Machine learning
- **D3.js** - Data visualization
- **Three.js** - 3D visualization
- **Recharts** - Chart components

### Development Tools
- **Turborepo** - Monorepo management
- **Claude-Flow v2.0.0 Alpha** - AI collaborative development
- **Docker Compose** - Container orchestration

## 🚨 Development Standards (Claude-Flow Integration)

### ⚡ Concurrent Execution Golden Rule
**"1 message = all related operations"** - All operations must be executed concurrently in a single message

### 🎯 Dual Engine Collaboration
1. **Claude Code Engine** (Execution): Task tools, file operations, code implementation
2. **MCP Tool Engine** (Coordination): Swarm management, task orchestration, memory coordination

### 📁 Strict Directory Standards
- ✅ `/src/` - Source code
- ✅ `/tests/` - Test files  
- ✅ `/docs/` - Documentation
- ❌ **Prohibited: Storing working files in root directory**

## 📊 Current Project Status

### ✅ Running Services (4/5 - 80%)
1. **Intelligence System** (3010) - Data collection and analysis ✅
   - Competitor analysis, opportunity identification, real-time alerts
   - API responses normal, data flow stable
   
2. **GEO Content Engine** (3003) - Geographic content management ✅
   - Content editor, map visualization
   - Full functionality operational
   
3. **GEM Growth Engine** (3002) - Marketing campaign management ✅
   - Campaign creation, conversion funnel, A/B testing
   - Chakra UI icons fixed
   
4. **Sandbox** (3004) - Intelligent decision simulator ✅
   - Scenario analysis, sensitivity testing, visualization dashboard
   - Recharts Cell component fixed

### ❌ Services Needing Fixes (1/5)
5. **DAM Asset Management** (3011) - Digital asset management ❌
   - **Issue**: rc-picker ES module compatibility
   - **Impact**: Cannot access asset library functionality
   - **Priority**: High

### 🐳 Infrastructure Status (6/6 - 100%)
- PostgreSQL, Redis, Elasticsearch, RabbitMQ, Grafana, Prometheus all running normally

## 🎯 Project Delivery Roadmap

### Phase 1: Core Function Improvement (This Week)
- [ ] **High Priority**: Fix DAM module rc-picker dependency issue
- [ ] **High Priority**: Start API Gateway service (port 3030)
- [ ] **Medium Priority**: Add basic test coverage (currently 0 test files)
- [ ] **Medium Priority**: Improve error handling and logging system

### Phase 2: Quality Assurance (Next Week)
- [ ] Add E2E test suite (Playwright)
- [ ] Implement CI/CD pipeline (GitHub Actions)
- [ ] Performance optimization and monitoring integration
- [ ] Security audit and vulnerability fixes

### Phase 3: Deployment Ready (Final)
- [ ] Production environment configuration
- [ ] Load balancing and scaling configuration
- [ ] Backup and recovery strategy
- [ ] User documentation and operations manual

## 📈 Key Metrics

### Development Progress
- **Core Services**: 4/5 completed (80%)
- **Infrastructure**: 6/6 completed (100%)
- **Codebase Size**: 353 TypeScript/JavaScript files
- **Test Coverage**: 0% (urgent improvement needed)

### Performance Benchmarks
- **Intelligence API**: Average response time <20ms
- **Service Availability**: 80% (4/5 services online)
- **Infrastructure Stability**: 100% (2 hours continuous operation)

## 🚀 Quick Start

### Environment Requirements
- Node.js 18+
- Docker & Docker Compose
- Claude Code CLI
- npm/yarn

### Startup Commands
```bash
# 1. Start infrastructure
docker-compose up -d

# 2. Install dependencies
npm install

# 3. Start all services
npm run dev

# 4. Verify service status
./scripts/health-check.sh
```

### Service Access URLs
- **Intelligence**: http://localhost:3010/dashboard
- **GEO**: http://localhost:3003/editor  
- **GEM**: http://localhost:3002/campaigns
- **Sandbox**: http://localhost:3004/simulator
- **DAM**: http://localhost:3011/library (needs fix)

## 🔗 Claude-Flow Integration

### 54 Available Intelligent Agents
- Core Development: `coder`, `reviewer`, `tester`, `planner`, `researcher`
- Architecture Design: `system-architect`, `code-analyzer`, `api-docs`
- Specialized Development: `backend-dev`, `frontend-dev`, `ml-developer`, `cicd-engineer`
- Test Quality: `tdd-london-swarm`, `production-validator`

### SPARC Methodology
```bash
npx claude-flow sparc tdd "<feature>"     # Complete TDD workflow
npx claude-flow sparc batch "<modes>"     # Parallel execution
npx claude-flow sparc pipeline "<task>"   # Complete pipeline
```

## 📞 Contact & Support

- **Project Master**: Claude Code SuperClaude
- **Claude-Flow Documentation**: https://github.com/ruvnet/claude-flow
- **Project Repository**: /Users/cavin/Desktop/dev/eufyprism/

---

## 🎯 Next Steps (Master Responsibility)

**Immediate Actions**:
1. Fix DAM module rc-picker issue (blocking)
2. Start API Gateway service
3. Establish basic testing framework
4. Improve monitoring and logging

**Project Vision**: Build an industry-leading AI-driven marketing decision support platform, achieving intelligent, automated, and data-driven full-process marketing management.

**Success Criteria**: 5 core services 100% stable operation + complete test coverage + production-ready deployment configuration

---

*Last Updated: 2025-09-07*  
*Version: v1.0.0-alpha*  
*Status: Development Phase (80% Complete)*