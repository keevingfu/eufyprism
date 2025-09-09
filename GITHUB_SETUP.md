# GitHub Repository Setup Guide

## Repository Information
- **Repository URL**: https://github.com/keevingfu/eufyprism
- **Default Branch**: main
- **CI/CD**: GitHub Actions

## Security Configuration

### GitHub Token Storage
The GitHub token is stored securely in `.env` file (ignored by git).
**NEVER** commit the `.env` file or expose the token publicly.

### Environment Variables
```bash
# .env file structure
GITHUB_TOKEN=your_token_here
GITHUB_REPO=keevingfu/eufyprism
```

## CI/CD Pipeline Features

### Automatic Features
1. **Continuous Integration**
   - Automatic linting and testing on every push
   - Security scanning with npm audit
   - Multi-app parallel builds

2. **Version Management**
   - Automatic version bumping based on commit messages
   - Semantic versioning (major.minor.patch)
   - Automatic release creation with changelogs

3. **Dependency Management**
   - Weekly automatic dependency updates
   - Security vulnerability fixes
   - Pull request creation for updates

### Manual Deployment
```bash
# Push code to GitHub
./scripts/deploy.sh push

# Create a release
./scripts/deploy.sh release

# Full deployment (push + release)
./scripts/deploy.sh full
```

## Workflow Triggers

### CI/CD Pipeline
- Push to `main` or `develop` branches
- Pull requests to `main` branch
- Manual trigger via GitHub Actions UI

### Dependency Updates
- Every Monday at 9 AM UTC
- Manual trigger available

### Security Scans
- Daily automatic scans
- On every push to main branch

## Version Bumping Convention

Use conventional commit messages:
- `BREAKING CHANGE`: Major version (1.0.0 → 2.0.0)
- `feat:`: Minor version (1.0.0 → 1.1.0)  
- `fix:`, `chore:`, etc.: Patch version (1.0.0 → 1.0.1)

## GitHub Repository Settings

### Required Secrets
Add these in Settings → Secrets and variables → Actions:
- `SNYK_TOKEN` (optional, for enhanced security scanning)
- `NPM_TOKEN` (optional, for npm publishing)
- `DEPLOY_KEY` (optional, for deployment)

### Branch Protection Rules
Recommended settings for `main` branch:
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Include administrators

### Environments
- **staging**: For develop branch deployments
- **production**: For main branch deployments

## Quick Commands

```bash
# Check CI/CD status
git log --oneline -n 10

# Create a feature branch
git checkout -b feature/your-feature

# Push with CI skip
git commit -m "chore: update docs [skip ci]"

# Force version bump
npm run version:minor
git push origin main --tags
```

## Monitoring

- **Actions Tab**: https://github.com/keevingfu/eufyprism/actions
- **Releases**: https://github.com/keevingfu/eufyprism/releases
- **Security**: https://github.com/keevingfu/eufyprism/security

## Troubleshooting

### Push Rejected
```bash
# Update remote URL with token
git remote set-url origin https://${GITHUB_TOKEN}@github.com/keevingfu/eufyprism.git
```

### CI/CD Failed
1. Check Actions tab for error logs
2. Verify all secrets are configured
3. Ensure branch protection rules allow CI updates

### Token Issues
1. Verify token in `.env` file
2. Check token permissions (repo, workflow)
3. Regenerate token if expired