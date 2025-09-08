#!/bin/bash

echo "🚀 Starting Eufy PRISM E28 Services..."

# Function to check if port is in use
check_port() {
    lsof -i :$1 >/dev/null 2>&1
    return $?
}

# Check Docker services
echo "📦 Checking Docker services..."
docker-compose ps

# Create logs directory
mkdir -p logs

# Start services in background
echo "🌟 Starting Intelligence Service (port 3010)..."
if ! check_port 3010; then
    cd apps/intelligence && npm run dev > ../../logs/intelligence.log 2>&1 &
    echo "✅ Intelligence service started"
else
    echo "⚠️  Port 3010 already in use"
fi

echo "💾 Starting DAM Service (port 3011)..."
if ! check_port 3011; then
    cd apps/dam && npm run dev > ../../logs/dam.log 2>&1 &
    echo "✅ DAM service started"
else
    echo "⚠️  Port 3011 already in use"
fi

echo "🔍 Starting GEO Service (port 3003)..."
if ! check_port 3003; then
    cd apps/geo && npm run dev > ../../logs/geo.log 2>&1 &
    echo "✅ GEO service started"
else
    echo "⚠️  Port 3003 already in use"
fi

echo "📈 Starting GEM Service (port 3002)..."
if ! check_port 3002; then
    cd apps/gem && npm run dev > ../../logs/gem.log 2>&1 &
    echo "✅ GEM service started"
else
    echo "⚠️  Port 3002 already in use"
fi

echo "🎯 Starting Sandbox Service (port 3004)..."
if ! check_port 3004; then
    cd apps/sandbox && npm run dev > ../../logs/sandbox.log 2>&1 &
    echo "✅ Sandbox service started"
else
    echo "⚠️  Port 3004 already in use"
fi

echo ""
echo "⏳ Waiting for services to initialize..."
sleep 5

echo ""
echo "📊 Service Status:"
echo "=================="
echo ""

# Check each service
for port in 3010 3011 3003 3002 3004; do
    case $port in
        3010) service="Intelligence" ;;
        3011) service="DAM" ;;
        3003) service="GEO" ;;
        3002) service="GEM" ;;
        3004) service="Sandbox" ;;
    esac
    
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$port | grep -q "200\|404"; then
        echo "✅ $service (port $port): Running at http://localhost:$port"
    else
        echo "❌ $service (port $port): Not responding"
    fi
done

echo ""
echo "📝 Service URLs:"
echo "================"
echo "🔍 Intelligence System: http://localhost:3010/dashboard"
echo "💾 DAM Asset Management: http://localhost:3011/library"
echo "📝 GEO Content Engine: http://localhost:3003/editor"
echo "📈 GEM Growth Engine: http://localhost:3002/campaigns"
echo "🎯 Decision Sandbox: http://localhost:3004/simulator"
echo ""
echo "📊 Infrastructure:"
echo "=================="
echo "🐘 PostgreSQL: localhost:5434"
echo "🔴 Redis: localhost:6380"
echo "🔍 Elasticsearch: http://localhost:9200"
echo "🐰 RabbitMQ: http://localhost:15672 (guest/guest)"
echo "📊 Grafana: http://localhost:3001 (admin/admin)"
echo "📈 Prometheus: http://localhost:9090"
echo ""
echo "📋 Logs are available in ./logs/"
echo "💡 Use 'tail -f logs/<service>.log' to view logs"
echo ""
echo "🛑 To stop all services, use: pkill -f 'next dev'"