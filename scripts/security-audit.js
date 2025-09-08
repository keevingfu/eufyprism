#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

// Security audit configuration
const SECURITY_CHECKS = {
  dependencies: true,
  dockerfile: true,
  secrets: true,
  headers: true,
  cors: true,
  ssl: true,
  permissions: true,
  vulnerabilities: true
};

// Severity levels
const SEVERITY = {
  CRITICAL: '🚨 CRITICAL',
  HIGH: '⚠️  HIGH',
  MEDIUM: '⚡ MEDIUM',
  LOW: 'ℹ️  LOW',
  INFO: '📋 INFO'
};

class SecurityAuditor {
  constructor() {
    this.findings = [];
    this.stats = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0
    };
  }

  addFinding(severity, category, title, description, remediation) {
    const severityKey = severity.toLowerCase().replace(/[^a-z]/g, '');
    this.stats[severityKey]++;
    this.findings.push({
      severity,
      category,
      title,
      description,
      remediation,
      timestamp: new Date().toISOString()
    });
  }

  async auditDependencies() {
    console.log('\n🔍 Auditing Dependencies...');
    
    try {
      // Run npm audit
      const { stdout, stderr } = await execPromise('npm audit --json', { maxBuffer: 10 * 1024 * 1024 });
      const auditData = JSON.parse(stdout);
      
      if (auditData.vulnerabilities) {
        for (const [pkg, vuln] of Object.entries(auditData.vulnerabilities)) {
          const severity = vuln.severity.toUpperCase();
          this.addFinding(
            SEVERITY[severity] || SEVERITY.INFO,
            'Dependencies',
            `Vulnerable package: ${pkg}`,
            `${vuln.via.map(v => v.title).join(', ')}`,
            vuln.fixAvailable ? `Update to ${vuln.fixAvailable.name}@${vuln.fixAvailable.version}` : 'No fix available'
          );
        }
      }
      
      // Check for outdated packages
      const { stdout: outdated } = await execPromise('npm outdated --json || true');
      if (outdated) {
        const outdatedPkgs = JSON.parse(outdated);
        const criticalPkgs = ['express', 'react', 'next', 'axios'];
        
        for (const [pkg, info] of Object.entries(outdatedPkgs)) {
          if (criticalPkgs.includes(pkg)) {
            this.addFinding(
              SEVERITY.MEDIUM,
              'Dependencies',
              `Outdated critical package: ${pkg}`,
              `Current: ${info.current}, Latest: ${info.latest}`,
              `Run: npm update ${pkg}`
            );
          }
        }
      }
    } catch (error) {
      this.addFinding(
        SEVERITY.INFO,
        'Dependencies',
        'Dependency audit completed with warnings',
        error.message,
        'Review and fix identified vulnerabilities'
      );
    }
  }

  async auditDockerfiles() {
    console.log('\n🐳 Auditing Dockerfiles...');
    
    const dockerfiles = [
      'docker/Dockerfile.intelligence',
      'docker/Dockerfile.gem',
      'docker/Dockerfile.geo',
      'docker/Dockerfile.sandbox',
      'docker/Dockerfile.dam'
    ];
    
    for (const dockerfile of dockerfiles) {
      try {
        const content = await fs.readFile(dockerfile, 'utf8');
        
        // Check for running as root
        if (!content.includes('USER') || content.match(/USER\s+root/)) {
          this.addFinding(
            SEVERITY.HIGH,
            'Container Security',
            `Container runs as root: ${dockerfile}`,
            'Running containers as root poses security risks',
            'Add a non-root user: RUN useradd -m appuser && USER appuser'
          );
        }
        
        // Check for specific versions
        if (content.match(/FROM\s+\w+:latest/)) {
          this.addFinding(
            SEVERITY.MEDIUM,
            'Container Security',
            `Using latest tag: ${dockerfile}`,
            'Using latest tag can lead to unexpected changes',
            'Pin to specific version: FROM node:20.11.0-alpine'
          );
        }
        
        // Check for secrets in build args
        if (content.match(/ARG\s+.*(PASSWORD|KEY|SECRET|TOKEN)/i)) {
          this.addFinding(
            SEVERITY.CRITICAL,
            'Container Security',
            `Potential secrets in build args: ${dockerfile}`,
            'Build arguments are visible in image history',
            'Use runtime environment variables or secret management'
          );
        }
      } catch (error) {
        // File not found is okay
      }
    }
  }

  async auditSecrets() {
    console.log('\n🔐 Scanning for Secrets...');
    
    const secretPatterns = [
      { pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"]?([a-zA-Z0-9]{32,})/gi, type: 'API Key' },
      { pattern: /(?:secret|password)\s*[:=]\s*['"]?([^\s'"]+)/gi, type: 'Password/Secret' },
      { pattern: /mongodb:\/\/[^:]+:[^@]+@/gi, type: 'MongoDB Connection String' },
      { pattern: /postgres:\/\/[^:]+:[^@]+@/gi, type: 'PostgreSQL Connection String' },
      { pattern: /[a-zA-Z0-9+\/]{40,}={0,2}/g, type: 'Base64 Encoded Secret' },
      { pattern: /ghp_[a-zA-Z0-9]{36}/g, type: 'GitHub Personal Access Token' },
      { pattern: /sk-[a-zA-Z0-9]{48}/g, type: 'API Secret Key' }
    ];
    
    const filesToScan = [
      'apps/intelligence/.env',
      'apps/gem/.env',
      'apps/geo/.env',
      'apps/sandbox/.env',
      'apps/dam/.env',
      '.env',
      '.env.local',
      '.env.production'
    ];
    
    for (const file of filesToScan) {
      try {
        const content = await fs.readFile(file, 'utf8');
        
        for (const { pattern, type } of secretPatterns) {
          const matches = content.match(pattern);
          if (matches) {
            this.addFinding(
              SEVERITY.CRITICAL,
              'Secrets Management',
              `Exposed ${type} in ${file}`,
              `Found potential ${type} in plain text`,
              'Use environment variables or secret management service'
            );
          }
        }
      } catch (error) {
        // File not found is okay
      }
    }
    
    // Check if .env files are in .gitignore
    try {
      const gitignore = await fs.readFile('.gitignore', 'utf8');
      if (!gitignore.includes('.env')) {
        this.addFinding(
          SEVERITY.CRITICAL,
          'Secrets Management',
          '.env files not in .gitignore',
          'Environment files may be committed to repository',
          'Add .env* to .gitignore'
        );
      }
    } catch (error) {
      this.addFinding(
        SEVERITY.HIGH,
        'Secrets Management',
        'No .gitignore file found',
        'Without .gitignore, sensitive files may be committed',
        'Create .gitignore with proper exclusions'
      );
    }
  }

  async auditSecurityHeaders() {
    console.log('\n🛡️ Auditing Security Headers...');
    
    const services = [
      { name: 'Intelligence', port: 3010 },
      { name: 'GEM', port: 3002 },
      { name: 'GEO', port: 3003 },
      { name: 'Sandbox', port: 3004 },
      { name: 'Gateway', port: 3030 }
    ];
    
    const requiredHeaders = {
      'x-frame-options': 'SAMEORIGIN',
      'x-content-type-options': 'nosniff',
      'x-xss-protection': '1; mode=block',
      'strict-transport-security': 'max-age=31536000',
      'content-security-policy': 'present'
    };
    
    for (const service of services) {
      try {
        const response = await fetch(`http://localhost:${service.port}/`);
        const headers = response.headers;
        
        for (const [header, expected] of Object.entries(requiredHeaders)) {
          const value = headers.get(header);
          if (!value) {
            this.addFinding(
              SEVERITY.HIGH,
              'Security Headers',
              `Missing ${header} in ${service.name}`,
              `Security header ${header} is not set`,
              `Add header: ${header}: ${expected}`
            );
          }
        }
      } catch (error) {
        // Service not running is okay for this audit
      }
    }
  }

  async auditCORS() {
    console.log('\n🌐 Auditing CORS Configuration...');
    
    const services = [
      { name: 'Intelligence API', url: 'http://localhost:3010/api/intelligence/opportunities' },
      { name: 'Gateway API', url: 'http://localhost:3030/api/intelligence/opportunities' }
    ];
    
    for (const service of services) {
      try {
        const response = await fetch(service.url, {
          method: 'OPTIONS',
          headers: {
            'Origin': 'http://evil.com',
            'Access-Control-Request-Method': 'GET'
          }
        });
        
        const corsHeader = response.headers.get('access-control-allow-origin');
        if (corsHeader === '*') {
          this.addFinding(
            SEVERITY.HIGH,
            'CORS Configuration',
            `Overly permissive CORS in ${service.name}`,
            'CORS allows all origins (*)',
            'Restrict CORS to specific trusted domains'
          );
        }
      } catch (error) {
        // Service not running is okay
      }
    }
  }

  async auditPermissions() {
    console.log('\n📁 Auditing File Permissions...');
    
    const sensitiveDirs = [
      'docker',
      'scripts',
      '.github'
    ];
    
    for (const dir of sensitiveDirs) {
      try {
        const stats = await fs.stat(dir);
        const mode = (stats.mode & parseInt('777', 8)).toString(8);
        
        if (mode === '777') {
          this.addFinding(
            SEVERITY.HIGH,
            'File Permissions',
            `World-writable directory: ${dir}`,
            'Directory has 777 permissions',
            `Run: chmod 755 ${dir}`
          );
        }
      } catch (error) {
        // Directory not found is okay
      }
    }
  }

  async auditAuthentication() {
    console.log('\n🔑 Auditing Authentication...');
    
    // Check for hardcoded credentials
    const filesToCheck = [
      'apps/intelligence/src/lib/auth.ts',
      'services/gateway/src/middleware/auth.ts'
    ];
    
    for (const file of filesToCheck) {
      try {
        const content = await fs.readFile(file, 'utf8');
        
        if (content.includes('admin') && content.includes('password')) {
          this.addFinding(
            SEVERITY.CRITICAL,
            'Authentication',
            `Potential hardcoded credentials in ${file}`,
            'Found hardcoded username/password',
            'Use environment variables for credentials'
          );
        }
        
        if (!content.includes('bcrypt') && !content.includes('argon2')) {
          this.addFinding(
            SEVERITY.HIGH,
            'Authentication',
            `No password hashing found in ${file}`,
            'Passwords may be stored in plain text',
            'Implement bcrypt or argon2 for password hashing'
          );
        }
      } catch (error) {
        // File not found is okay
      }
    }
  }

  generateReport() {
    console.log('\n\n📊 Security Audit Report');
    console.log('========================\n');
    
    // Summary
    console.log('Summary:');
    console.log(`- Critical Issues: ${this.stats.critical}`);
    console.log(`- High Issues: ${this.stats.high}`);
    console.log(`- Medium Issues: ${this.stats.medium}`);
    console.log(`- Low Issues: ${this.stats.low}`);
    console.log(`- Info: ${this.stats.info}`);
    
    // Risk Score
    const riskScore = (this.stats.critical * 10) + (this.stats.high * 5) + 
                     (this.stats.medium * 3) + (this.stats.low * 1);
    console.log(`\nRisk Score: ${riskScore}`);
    
    if (riskScore > 50) {
      console.log('Risk Level: 🚨 CRITICAL - Immediate action required');
    } else if (riskScore > 30) {
      console.log('Risk Level: ⚠️  HIGH - Address soon');
    } else if (riskScore > 15) {
      console.log('Risk Level: ⚡ MEDIUM - Plan remediation');
    } else {
      console.log('Risk Level: ✅ LOW - Good security posture');
    }
    
    // Detailed Findings
    console.log('\n\nDetailed Findings:');
    console.log('------------------\n');
    
    const groupedFindings = {};
    this.findings.forEach(finding => {
      if (!groupedFindings[finding.category]) {
        groupedFindings[finding.category] = [];
      }
      groupedFindings[finding.category].push(finding);
    });
    
    for (const [category, findings] of Object.entries(groupedFindings)) {
      console.log(`\n### ${category}`);
      findings.forEach(finding => {
        console.log(`\n${finding.severity} - ${finding.title}`);
        console.log(`Description: ${finding.description}`);
        console.log(`Remediation: ${finding.remediation}`);
      });
    }
    
    // Recommendations
    console.log('\n\nTop Recommendations:');
    console.log('--------------------');
    if (this.stats.critical > 0) {
      console.log('1. Address all CRITICAL issues immediately');
    }
    console.log('2. Implement security headers on all services');
    console.log('3. Set up automated security scanning in CI/CD');
    console.log('4. Regular dependency updates and audits');
    console.log('5. Implement proper secrets management');
    
    // Save report
    return {
      summary: this.stats,
      riskScore,
      findings: this.findings,
      timestamp: new Date().toISOString()
    };
  }

  async run() {
    console.log('🔒 Starting Eufy PRISM E28 Security Audit');
    console.log('=========================================');
    
    if (SECURITY_CHECKS.dependencies) await this.auditDependencies();
    if (SECURITY_CHECKS.dockerfile) await this.auditDockerfiles();
    if (SECURITY_CHECKS.secrets) await this.auditSecrets();
    if (SECURITY_CHECKS.headers) await this.auditSecurityHeaders();
    if (SECURITY_CHECKS.cors) await this.auditCORS();
    if (SECURITY_CHECKS.permissions) await this.auditPermissions();
    if (SECURITY_CHECKS.vulnerabilities) await this.auditAuthentication();
    
    const report = this.generateReport();
    
    // Save detailed report to file
    await fs.writeFile(
      'security-audit-report.json',
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n\n✅ Security audit complete!');
    console.log('📄 Detailed report saved to: security-audit-report.json');
    
    // Exit with error code if critical issues found
    if (this.stats.critical > 0) {
      console.log('\n❌ Critical security issues found. Please address immediately!');
      process.exit(1);
    }
  }
}

// Run audit
const auditor = new SecurityAuditor();
auditor.run().catch(console.error);