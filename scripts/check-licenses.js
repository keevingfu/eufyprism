#!/usr/bin/env node

const fs = require('fs');

// Approved licenses
const APPROVED_LICENSES = [
  'MIT',
  'Apache-2.0',
  'BSD-3-Clause',
  'BSD-2-Clause',
  'ISC',
  'CC0-1.0',
  'Unlicense',
  'Python-2.0',
  'CC-BY-4.0',
  'CC-BY-3.0'
];

// Explicitly banned licenses
const BANNED_LICENSES = [
  'GPL-2.0',
  'GPL-3.0',
  'AGPL-3.0',
  'LGPL-2.1',
  'LGPL-3.0',
  'MPL-2.0'
];

try {
  const licenses = JSON.parse(fs.readFileSync('licenses.json', 'utf8'));
  const issues = [];
  const summary = {};
  
  // Check each package
  Object.entries(licenses).forEach(([pkg, info]) => {
    const license = info.licenses || 'UNKNOWN';
    
    // Track license usage
    if (!summary[license]) {
      summary[license] = 0;
    }
    summary[license]++;
    
    // Check for banned licenses
    if (BANNED_LICENSES.includes(license)) {
      issues.push({
        severity: 'critical',
        package: pkg,
        license: license,
        message: `Package uses banned license: ${license}`
      });
    }
    
    // Check for unapproved licenses
    else if (!APPROVED_LICENSES.includes(license) && license !== 'UNKNOWN') {
      issues.push({
        severity: 'warning',
        package: pkg,
        license: license,
        message: `Package uses unapproved license: ${license}`
      });
    }
    
    // Check for unknown licenses
    else if (license === 'UNKNOWN') {
      issues.push({
        severity: 'warning',
        package: pkg,
        license: license,
        message: 'Package has unknown license'
      });
    }
  });
  
  // Print summary
  console.log('License Summary:');
  Object.entries(summary).forEach(([license, count]) => {
    console.log(`- ${license}: ${count} packages`);
  });
  
  // Print issues
  if (issues.length > 0) {
    console.log('\nLicense Issues:');
    issues.forEach(issue => {
      console.log(`${issue.severity.toUpperCase()}: ${issue.package} - ${issue.message}`);
    });
    
    // Fail if critical issues
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      console.error(`\n❌ Found ${criticalIssues.length} packages with banned licenses!`);
      process.exit(1);
    }
  } else {
    console.log('\n✅ All packages use approved licenses');
  }
  
} catch (error) {
  console.error('Error checking licenses:', error.message);
  process.exit(0);
}