#!/usr/bin/env node

/**
 * Spotify Clone - Setup Validator
 * Run: node setup-check.js
 * 
 * This script validates your environment setup
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(type, msg) {
  const icons = {
    error: '❌',
    success: '✅',
    warning: '⚠️ ',
    info: 'ℹ️ '
  };
  const color = {
    error: colors.red,
    success: colors.green,
    warning: colors.yellow,
    info: colors.blue
  };
  console.log(`${color[type]}${icons[type]} ${msg}${colors.reset}`);
}

console.log(`\n${colors.cyan}🎵 SPOTIFY CLONE - SETUP VALIDATOR${colors.reset}\n`);

let passCount = 0;
let failCount = 0;

// Check 1: Backend folder structure
console.log(`${colors.cyan}1. Checking Backend Structure${colors.reset}`);
const backendDirs = [
  'backend/src',
  'backend/src/controllers',
  'backend/src/models',
  'backend/src/routes',
  'backend/src/middleware',
  'backend/src/utils',
  'backend/src/cron',
  'backend/db'
];

backendDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    log('success', `${dir}/`);
    passCount++;
  } else {
    log('error', `${dir}/ MISSING`);
    failCount++;
  }
});

// Check 2: Backend files
console.log(`\n${colors.cyan}2. Checking Backend Files${colors.reset}`);
const backendFiles = [
  'backend/src/server.js',
  'backend/src/config/database.js',
  'backend/src/controllers/authController.js',
  'backend/src/models/User.js',
  'backend/src/models/Artist.js',
  'backend/src/models/Concert.js',
  'backend/src/models/Notification.js',
  'backend/db/initDb.js',
  'backend/package.json',
  'backend/.env'
];

backendFiles.forEach(file => {
  if (fs.existsSync(file)) {
    log('success', file);
    passCount++;
  } else {
    log('error', file + ' MISSING');
    failCount++;
  }
});

// Check 3: Frontend folder structure
console.log(`\n${colors.cyan}3. Checking Frontend Structure${colors.reset}`);
const frontendDirs = [
  'frontend/src',
  'frontend/src/components',
  'frontend/src/pages',
  'frontend/src/services',
  'frontend/src/hooks',
  'frontend/src/styles',
  'frontend/public'
];

frontendDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    log('success', `${dir}/`);
    passCount++;
  } else {
    log('error', `${dir}/ MISSING`);
    failCount++;
  }
});

// Check 4: Frontend files
console.log(`\n${colors.cyan}4. Checking Frontend Files${colors.reset}`);
const frontendFiles = [
  'frontend/src/App.js',
  'frontend/src/index.js',
  'frontend/src/services/api.js',
  'frontend/src/pages/Home.js',
  'frontend/src/pages/Login.js',
  'frontend/src/components/Navbar.js',
  'frontend/public/index.html',
  'frontend/package.json'
];

frontendFiles.forEach(file => {
  if (fs.existsSync(file)) {
    log('success', file);
    passCount++;
  } else {
    log('error', file + ' MISSING');
    failCount++;
  }
});

// Check 5: Documentation
console.log(`\n${colors.cyan}5. Checking Documentation${colors.reset}`);
const docFiles = [
  'README.md',
  'QUICKSTART.md',
  'PROJECT_SUMMARY.md',
  'docs/ARCHITECTURE.md',
  'docs/API_DOCUMENTATION.md',
  '.env.example'
];

docFiles.forEach(file => {
  if (fs.existsSync(file)) {
    log('success', file);
    passCount++;
  } else {
    log('error', file + ' MISSING');
    failCount++;
  }
});

// Check 6: Environment variables
console.log(`\n${colors.cyan}6. Checking Environment Configuration${colors.reset}`);
if (fs.existsSync('backend/.env')) {
  const envContent = fs.readFileSync('backend/.env', 'utf-8');
  if (envContent.includes('PORT=')) {
    log('success', 'backend/.env configured');
    passCount++;
  } else {
    log('warning', 'backend/.env exists but may not be fully configured');
    failCount++;
  }
} else {
  log('error', 'backend/.env not found');
  failCount++;
}

// Check 7: Package.json
console.log(`\n${colors.cyan}7. Checking Package Configuration${colors.reset}`);
if (fs.existsSync('backend/package.json')) {
  const pkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf-8'));
  if (pkg.dependencies && pkg.dependencies.express) {
    log('success', 'backend/package.json configured');
    passCount++;
  }
}

if (fs.existsSync('frontend/package.json')) {
  const pkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf-8'));
  if (pkg.dependencies && pkg.dependencies.react) {
    log('success', 'frontend/package.json configured');
    passCount++;
  }
}

// Summary
console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.green}✅ Passed: ${passCount}${colors.reset}`);
console.log(`${colors.red}❌ Failed: ${failCount}${colors.reset}`);
console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

if (failCount === 0) {
  console.log(`${colors.green}🎉 All checks passed! Your project is ready.${colors.reset}\n`);
  console.log('${colors.blue}Next steps:${colors.reset}');
  console.log('  1. cd backend && npm install');
  console.log('  2. node db/initDb.js');
  console.log('  3. npm start');
  console.log('');
  console.log('${colors.blue}In another terminal:${colors.reset}');
  console.log('  1. cd frontend && npm install');
  console.log('  2. npm start');
  console.log('');
} else {
  console.log(`${colors.red}⚠️  Fix the missing files above before proceeding.${colors.reset}\n`);
  process.exit(1);
}
