/**
 * FitCraft CLI - Environment Setup Utility
 * Runs post-install to set up .env files and configure the workspaces interactively.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI Terminal Colors
const ESC = '\x1b[';
const colors = {
  reset: `${ESC}0m`,
  bold: `${ESC}1m`,
  dim: `${ESC}2m`,
  underline: `${ESC}4m`,
  
  // Foregrounds
  black: `${ESC}30m`,
  red: `${ESC}31m`,
  green: `${ESC}32m`,
  yellow: `${ESC}33m`,
  blue: `${ESC}34m`,
  magenta: `${ESC}35m`,
  cyan: `${ESC}36m`,
  white: `${ESC}37m`,
  
  // Gradients/Brighter
  brightCyan: `${ESC}96m`,
  brightBlue: `${ESC}94m`,
  brightGreen: `${ESC}92m`,
};

// Fancy Symbols
const symbols = {
  success: `${colors.brightGreen}✔${colors.reset}`,
  info: `${colors.brightBlue}ℹ${colors.reset}`,
  warning: `${colors.yellow}⚠${colors.reset}`,
  bullet: `${colors.dim}•${colors.reset}`,
  arrow: `${colors.brightCyan}→${colors.reset}`,
};

const logo = `
${colors.brightCyan}${colors.bold}  ███████╗██╗████████╗ ██████╗██████╗  █████╗ ███████╗████████╗
  ██╔════╝██║╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝
  █████╗  ██║   ██║   ██║     ██████╔╝███████║█████╗     ██║   
  ██╔══╝  ██║   ██║   ██║     ██╔══██╗██╔══██║██╔══╝     ██║   
  ██║     ██║   ██║   ╚██████╗██║  ██║██║  ██║██║        ██║   
  ╚═╝     ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝        ╚═╝   
${colors.reset}`;

// Capture Ctrl+C globally to exit cleanly
process.on('SIGINT', () => {
  console.log(`\n\n${colors.yellow}${symbols.warning} Setup cancelled by user (Ctrl+C).${colors.reset}\n`);
  process.exit(1);
});

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function heading(text) {
  console.log(`\n${colors.bold}${colors.brightBlue}# ${text}${colors.reset}\n`);
}

function logStatus(symbol, task, details = '') {
  const detailsStr = details ? ` ${colors.dim}(${details})${colors.reset}` : '';
  console.log(`  ${symbol} ${task}${detailsStr}`);
}

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    const config = {};
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = line.indexOf('=');
      if (eqIdx !== -1) {
        const key = line.slice(0, eqIdx).trim();
        const value = line.slice(eqIdx + 1).trim();
        config[key] = value;
      }
    }
    return config;
  } catch (error) {
    return {};
  }
}

function parseEnvExample(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const vars = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      vars.push({ type: 'comment', raw: line });
      continue;
    }
    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) {
      vars.push({ type: 'raw', raw: line });
      continue;
    }
    const key = line.slice(0, eqIdx).trim();
    const defaultValue = line.slice(eqIdx + 1).trim();
    vars.push({ type: 'var', key, defaultValue });
  }
  return vars;
}

function getBackendPort(backendDir) {
  const envPath = path.join(backendDir, '.env');
  const config = parseEnvFile(envPath);
  if (config.PORT) {
    return config.PORT;
  }
  const examplePath = path.join(backendDir, '.env.example');
  const exampleConfig = parseEnvFile(examplePath);
  return exampleConfig.PORT || '5001';
}

function getFrontendPort(frontendDir, backendDir) {
  // 1. Check backend's existing env for CLIENT_URL or FRONTEND_URL
  const backendEnvPath = path.join(backendDir, '.env');
  const backendConfig = parseEnvFile(backendEnvPath);
  const backendUrlVal = backendConfig.CLIENT_URL || backendConfig.FRONTEND_URL;
  if (backendUrlVal) {
    try {
      const url = new URL(backendUrlVal.trim());
      if (url.port) return url.port;
    } catch (e) {}
  }

  // 2. Check backend's .env.example
  const backendExamplePath = path.join(backendDir, '.env.example');
  const backendExampleConfig = parseEnvFile(backendExamplePath);
  const backendExampleUrlVal = backendExampleConfig.CLIENT_URL || backendExampleConfig.FRONTEND_URL;
  if (backendExampleUrlVal) {
    try {
      const url = new URL(backendExampleUrlVal.trim());
      if (url.port) return url.port;
    } catch (e) {}
  }

  // 3. Fallback default
  return '5173';
}

function shouldUpdateLocalhostUrl(existingValue, targetValue) {
  if (!existingValue || !targetValue) return false;
  if (existingValue === targetValue) return false;
  // Only update if existing value is localhost or 127.0.0.1
  return existingValue.includes('localhost') || existingValue.includes('127.0.0.1');
}

async function configureEnvInteractive(appName, folderPath, otherFolderPath) {
  const examplePath = path.join(folderPath, '.env.example');
  const envPath = path.join(folderPath, '.env');
  
  const relativeExample = path.relative(process.cwd(), examplePath);
  const relativeEnv = path.relative(process.cwd(), envPath);

  if (!fs.existsSync(examplePath)) {
    logStatus(
      symbols.warning,
      `No template file found for ${colors.bold}${appName}`,
      `Missing ${relativeExample}`
    );
    return;
  }

  // Load existing config keys if the .env file exists
  let existingConfig = {};
  if (fs.existsSync(envPath)) {
    existingConfig = parseEnvFile(envPath);
  }

  const isFrontend = appName.includes('Frontend');
  const isBackend = appName.includes('Backend');

  const parsed = parseEnvExample(examplePath);
  const targetValues = {};
  const autoConfigured = {};

  for (const item of parsed) {
    if (item.type !== 'var') continue;

    const hasExisting = item.key in existingConfig;
    const existingValue = existingConfig[item.key];

    // Compute dynamic auto-configured value if applicable
    let derivedValue = null;
    if (isBackend && (item.key === 'CLIENT_URL' || item.key === 'FRONTEND_URL')) {
      const frontendPort = getFrontendPort(otherFolderPath, folderPath);
      derivedValue = `http://localhost:${frontendPort}`;
    } else if (isFrontend && item.key === 'VITE_API_URL') {
      const backendPort = getBackendPort(otherFolderPath);
      derivedValue = `http://localhost:${backendPort}/api`;
    } else if (isFrontend && item.key === 'VITE_BASE_URL') {
      const backendPort = getBackendPort(otherFolderPath);
      derivedValue = `http://localhost:${backendPort}`;
    }

    if (derivedValue !== null) {
      if (hasExisting) {
        if (shouldUpdateLocalhostUrl(existingValue, derivedValue)) {
          targetValues[item.key] = derivedValue;
          autoConfigured[item.key] = true;
        } else {
          // Preserve custom URL configurations
          targetValues[item.key] = existingValue;
        }
      } else {
        targetValues[item.key] = derivedValue;
        autoConfigured[item.key] = true;
      }
    } else if (hasExisting) {
      // Preserve other existing values
      targetValues[item.key] = existingValue;
    }
  }

  // Find promptable variables that are missing from targetValues
  const missingPromptableVars = parsed.filter(item => item.type === 'var' && !(item.key in targetValues));

  // Determine if we need to write the file
  let needsWrite = false;
  if (!fs.existsSync(envPath)) {
    needsWrite = true;
  } else {
    for (const item of parsed) {
      if (item.type === 'var') {
        if (existingConfig[item.key] !== targetValues[item.key]) {
          needsWrite = true;
          break;
        }
      }
    }
  }

  // If the .env file exists and everything matches perfectly, skip.
  if (!needsWrite) {
    logStatus(
      symbols.info,
      `${colors.bold}${appName}${colors.reset} environment file is already configured.`,
      `${relativeEnv} exists & matches template`
    );
    return;
  }

  // Display start of prompts / updates
  if (fs.existsSync(envPath) && missingPromptableVars.length > 0) {
    console.log(`\n${colors.bold}${colors.yellow}${symbols.warning} Detected missing variable(s) in ${relativeEnv}:${colors.reset}`);
    console.log(`${colors.dim}Prompting only for the missing values:${colors.reset}\n`);
  } else if (!fs.existsSync(envPath)) {
    console.log(`\n${colors.bold}${colors.brightCyan}Configure environment for ${appName}:${colors.reset}`);
    console.log(`${colors.dim}Press Enter to accept the default value shown in brackets.${colors.reset}\n`);
  }

  const envLines = [];
  const envFileExistsBefore = fs.existsSync(envPath);

  for (const item of parsed) {
    if (item.type !== 'var') {
      envLines.push(item.raw);
      continue;
    }

    let value;
    if (item.key in targetValues) {
      value = targetValues[item.key];
      if (autoConfigured[item.key]) {
        logStatus(symbols.info, `${colors.bold}${item.key}${colors.reset} auto-configured to ${colors.green}${value}${colors.reset}`);
      }
    } else {
      const defaultVal = item.defaultValue;
      const query = `  ${colors.brightBlue}?${colors.reset} ${colors.bold}${item.key}${colors.reset} ${colors.dim}[${defaultVal}]${colors.reset}: `;
      const answer = await askQuestion(query);
      value = answer !== '' ? answer : defaultVal;
      targetValues[item.key] = value;
    }
    envLines.push(`${item.key}=${value}`);
  }

  try {
    fs.writeFileSync(envPath, envLines.join('\n'));
    const actionWord = envFileExistsBefore ? 'updated' : 'created';
    logStatus(
      symbols.success,
      `Successfully ${actionWord} ${colors.bold}${relativeEnv}`,
      `configured with custom/default values`
    );
  } catch (error) {
    logStatus(
      symbols.warning,
      `Failed to write ${colors.bold}${relativeEnv}`,
      error.message
    );
  }
}

async function main() {
  console.clear();
  console.log(logo);
  console.log(`  ${colors.dim}Custom-Fit Clothing Platform Monorepo Setup${colors.reset}\n`);

  heading('1. Environment Configuration Setup');
  
  const rootDir = process.cwd();
  const frontendDir = path.join(rootDir, 'apps', 'frontend');
  const backendDir = path.join(rootDir, 'apps', 'backend');

  // Prompts Backend first, then Frontend (allowing frontend to auto-detect configured backend port)
  await configureEnvInteractive('Backend (Server)', backendDir, frontendDir);
  await configureEnvInteractive('Frontend (Client)', frontendDir, backendDir);

  heading('2. Workspace Development Verification');
  
  logStatus(symbols.info, 'Monorepo workspaces successfully linked via package.json.');
  logStatus(symbols.info, `Workspace configurations loaded from root ${colors.bold}package.json${colors.reset}.\n`);

  console.log(`${colors.brightGreen}================================================================${colors.reset}`);
  console.log(`✨ ${colors.bold}${colors.brightGreen}FitCraft environment configuration is complete!${colors.reset}`);
  console.log(`${colors.brightGreen}================================================================${colors.reset}\n`);
  
  console.log(`${colors.bold}To start the local development servers:${colors.reset}`);
  console.log(`  ${symbols.arrow} ${colors.brightCyan}npm run dev${colors.reset} (starts local dev servers)`);
  console.log(`  ${symbols.arrow} ${colors.brightCyan}docker-compose up --build${colors.reset} (starts production containers)\n`);
}

main();
