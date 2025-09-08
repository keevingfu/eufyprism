#!/bin/bash

# Deploy script for Eufy PRISM
# This script uses environment variables for security

set -e

echo "🚀 Eufy PRISM Deployment Script"
echo "================================"

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Check if GitHub token is set
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ Error: GITHUB_TOKEN not found in environment variables"
  echo "Please ensure .env file contains GITHUB_TOKEN"
  exit 1
fi

# Function to push to GitHub
push_to_github() {
  echo "📤 Pushing to GitHub..."
  
  # Configure git to use token
  git remote set-url origin https://${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git
  
  # Push changes
  git push origin main --tags
  
  echo "✅ Successfully pushed to GitHub"
}

# Function to create release
create_release() {
  VERSION=$(node -p "require('./package.json').version")
  echo "🏷️  Creating release v${VERSION}..."
  
  # Create release using GitHub API
  curl -X POST \
    -H "Authorization: token ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/repos/${GITHUB_REPO}/releases \
    -d "{
      \"tag_name\": \"v${VERSION}\",
      \"name\": \"Release v${VERSION}\",
      \"body\": \"Automated release for version ${VERSION}\",
      \"draft\": false,
      \"prerelease\": false
    }"
  
  echo "✅ Release created successfully"
}

# Main deployment process
case "$1" in
  push)
    push_to_github
    ;;
  release)
    create_release
    ;;
  full)
    push_to_github
    create_release
    ;;
  *)
    echo "Usage: $0 {push|release|full}"
    exit 1
    ;;
esac