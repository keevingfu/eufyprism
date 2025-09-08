#!/bin/bash

# Eufy PRISM E28 Portal Launcher

echo "🌐 Opening Eufy PRISM E28 Portal..."

# Get the absolute path to the portal
PORTAL_PATH="$(cd "$(dirname "$0")" && pwd)/portal/index.html"

# Detect the operating system and open the portal accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "$PORTAL_PATH"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "$PORTAL_PATH" 2>/dev/null || sensible-browser "$PORTAL_PATH"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    start "$PORTAL_PATH"
else
    echo "❌ Unable to detect operating system"
    echo "Please open the following file manually in your browser:"
    echo "$PORTAL_PATH"
fi

echo "✅ Portal opened in your default browser"
echo ""
echo "Make sure all services are running with:"
echo "./scripts/start-all.sh"