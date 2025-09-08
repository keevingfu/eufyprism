# GitHub Actions CI/CD Configuration

This project uses GitHub Actions for continuous integration and continuous deployment.

## Workflows

### 1. CI/CD Pipeline (`ci-cd.yml`)
- **Trigger**: Push to `main` or `develop`, Pull Requests to `main`
- **Jobs**:
  - Linting and Testing
  - Security Scanning
  - Building all applications
  - Automatic version management
  - Release creation
  - Deployment (staging/production)

### 2. Dependency Updates (`dependency-update.yml`)
- **Trigger**: Weekly (Mondays at 9 AM UTC) or manual
- **Purpose**: Automatically update dependencies and create PRs

### 3. Security Workflow (`security.yml`)
- **Trigger**: Daily security scans
- **Purpose**: Check for vulnerabilities and security issues

## Required Secrets

Add these secrets to your GitHub repository settings:

1. **GITHUB_TOKEN**: Already provided by GitHub Actions
2. **SNYK_TOKEN**: (Optional) For enhanced security scanning
3. **NPM_TOKEN**: (Optional) For publishing to npm
4. **DEPLOY_KEY**: (Optional) For deployment

## Version Management

The CI/CD pipeline automatically manages versions based on commit messages:

- `BREAKING CHANGE`: Major version bump (1.0.0 → 2.0.0)
- `feat:`: Minor version bump (1.0.0 → 1.1.0)
- Other commits: Patch version bump (1.0.0 → 1.0.1)

## Local Setup

To test GitHub Actions locally:

```bash
# Install act
brew install act

# Run workflows locally
act -j lint-and-test
```

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `test:` - Test additions/changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements

Add `[skip ci]` to commit messages to skip CI/CD pipeline.