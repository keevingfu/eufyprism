#!/bin/bash

echo "🔍 Eufy PRISM E28 Health Check"
echo "============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check service health
check_service() {
    local name=$1
    local port=$2
    local endpoint=$3
    
    if curl -s -f "http://localhost:$port/$endpoint" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $name (port $port): Running${NC}"
        return 0
    elif curl -s "http://localhost:$port" > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  $name (port $port): Responding but endpoint may have issues${NC}"
        return 1
    else
        echo -e "${RED}❌ $name (port $port): Not accessible${NC}"
        return 1
    fi
}

# Core Services
echo ""
echo "🌐 Core Services:"
echo "=================="
check_service "Intelligence" 3010 "dashboard"
check_service "GEO" 3003 "editor"
check_service "GEM" 3002 "campaigns"
check_service "Sandbox" 3004 "simulator"
check_service "DAM" 3011 "library"

# Support Services
echo ""
echo "🔧 Support Services:"
echo "==================="
check_service "Gateway" 3030 "health"

# Infrastructure Services
echo ""
echo "🐳 Infrastructure:"
echo "=================="

# Check Docker services
if docker ps | grep -q eufy-postgres; then
    echo -e "${GREEN}✅ PostgreSQL: Running${NC}"
else
    echo -e "${RED}❌ PostgreSQL: Not running${NC}"
fi

if docker ps | grep -q eufy-redis; then
    echo -e "${GREEN}✅ Redis: Running${NC}"
else
    echo -e "${RED}❌ Redis: Not running${NC}"
fi

if docker ps | grep -q eufy-elasticsearch; then
    echo -e "${GREEN}✅ Elasticsearch: Running${NC}"
else
    echo -e "${RED}❌ Elasticsearch: Not running${NC}"
fi

if docker ps | grep -q eufy-rabbitmq; then
    echo -e "${GREEN}✅ RabbitMQ: Running${NC}"
else
    echo -e "${RED}❌ RabbitMQ: Not running${NC}"
fi

if docker ps | grep -q eufy-grafana; then
    echo -e "${GREEN}✅ Grafana: Running${NC}"
else
    echo -e "${RED}❌ Grafana: Not running${NC}"
fi

if docker ps | grep -q eufy-prometheus; then
    echo -e "${GREEN}✅ Prometheus: Running${NC}"
else
    echo -e "${RED}❌ Prometheus: Not running${NC}"
fi

# Summary
echo ""
echo "📊 Summary:"
echo "==========="
RUNNING_SERVICES=$(curl -s http://localhost:3010 > /dev/null && echo "1" || echo "0")
RUNNING_SERVICES=$((RUNNING_SERVICES + $(curl -s http://localhost:3003 > /dev/null && echo "1" || echo "0")))
RUNNING_SERVICES=$((RUNNING_SERVICES + $(curl -s http://localhost:3002 > /dev/null && echo "1" || echo "0")))
RUNNING_SERVICES=$((RUNNING_SERVICES + $(curl -s http://localhost:3004 > /dev/null && echo "1" || echo "0")))
RUNNING_SERVICES=$((RUNNING_SERVICES + $(curl -s http://localhost:3030 > /dev/null && echo "1" || echo "0")))

echo "Core Services: $RUNNING_SERVICES/5 running"

INFRASTRUCTURE_COUNT=$(docker ps | grep eufy- | wc -l | tr -d ' ')
echo "Infrastructure: $INFRASTRUCTURE_COUNT/6 containers running"

if [ $RUNNING_SERVICES -ge 4 ] && [ $INFRASTRUCTURE_COUNT -ge 5 ]; then
    echo -e "${GREEN}🎯 System Status: HEALTHY${NC}"
    exit 0
elif [ $RUNNING_SERVICES -ge 3 ] && [ $INFRASTRUCTURE_COUNT -ge 4 ]; then
    echo -e "${YELLOW}⚠️  System Status: DEGRADED${NC}"
    exit 1
else
    echo -e "${RED}🚨 System Status: CRITICAL${NC}"
    exit 2
fi