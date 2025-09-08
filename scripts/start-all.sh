#!/bin/bash

# Eufy PRISM E28 - Start All Services Script

echo "🚀 Starting Eufy PRISM E28 System"
echo "================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Kill any existing services on our ports
echo -e "\n${YELLOW}Checking for existing services...${NC}"
for PORT in 3010 3002 3003 3004 3011 3030 3020; do
    if lsof -i :$PORT >/dev/null 2>&1; then
        echo -e "${RED}Port $PORT is in use. Stopping existing process...${NC}"
        lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    fi
done

# Start Docker infrastructure
echo -e "\n${YELLOW}Starting Docker infrastructure...${NC}"
docker-compose up -d

# Wait for infrastructure to be ready
echo -e "\n${YELLOW}Waiting for infrastructure services...${NC}"
sleep 5

# Check Docker services status
echo -e "\n${GREEN}Docker Services Status:${NC}"
docker-compose ps

# Start all application services
echo -e "\n${YELLOW}Starting application services...${NC}"
npm run dev &

# Wait a moment for services to start
sleep 10

# Display service URLs
echo -e "\n${GREEN}✅ All services started successfully!${NC}"
echo -e "\n${GREEN}Service URLs:${NC}"
echo "============================="
echo "🧠 Intelligence: http://localhost:3010/dashboard"
echo "💎 GEM: http://localhost:3002/campaigns"
echo "🌍 GEO: http://localhost:3003/optimizer"
echo "🎮 Sandbox: http://localhost:3004/simulator"
echo "📚 DAM: http://localhost:3011/library"
echo "🚪 Gateway: http://localhost:3030"
echo ""
echo "📊 Monitoring:"
echo "============="
echo "Grafana: http://localhost:3001 (admin/admin)"
echo "RabbitMQ: http://localhost:15672 (guest/guest)"
echo "Prometheus: http://localhost:9090"
echo ""
echo "🌐 Portal (HTML): Open portal/index.html in your browser"
echo "🌐 Portal (React): http://localhost:3020"
echo ""
echo "To stop all services: Press Ctrl+C"
echo ""

# Keep the script running
wait