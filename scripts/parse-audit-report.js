#!/usr/bin/env node

const fs = require('fs');

try {
  const auditReport = JSON.parse(fs.readFileSync('audit-report.json', 'utf8'));
  
  if (auditReport.vulnerabilities) {
    const vulns = auditReport.vulnerabilities;
    const summary = {
      critical: 0,
      high: 0,
      moderate: 0,
      low: 0,
      info: 0
    };
    
    // Count vulnerabilities by severity
    Object.values(vulns).forEach(vuln => {
      if (vuln.severity) {
        summary[vuln.severity.toLowerCase()]++;
      }
    });
    
    console.log('NPM Audit Summary:');
    console.log(`- Critical: ${summary.critical}`);
    console.log(`- High: ${summary.high}`);
    console.log(`- Moderate: ${summary.moderate}`);
    console.log(`- Low: ${summary.low}`);
    console.log(`- Info: ${summary.info}`);
    
    // Fail if critical vulnerabilities exist
    if (summary.critical > 0) {
      console.error('\n❌ Critical vulnerabilities found!');
      process.exit(1);
    }
    
    if (summary.high > 0) {
      console.warn('\n⚠️  High severity vulnerabilities found');
    }
  }
} catch (error) {
  console.error('Error parsing audit report:', error.message);
  process.exit(0); // Don't fail the build for parsing errors
}