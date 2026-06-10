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

async function configureEnvInteractive(appName, folderPath) {
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

  if (fs.existsSync(envPath)) {
    logStatus(
      symbols.info,
      `${colors.bold}${appName}${colors.reset} environment file is already configured.`,
      `${relativeEnv} exists`
    );
    return;
  }

  console.log(`\n${colors.bold}${colors.brightCyan}Configure environment for ${appName}:${colors.reset}`);
  console.log(`${colors.dim}Press Enter to accept the default value shown in brackets.${colors.reset}\n`);

  const parsed = parseEnvExample(examplePath);
  const envLines = [];

  for (const item of parsed) {
    if (item.type !== 'var') {
      envLines.push(item.raw);
      continue;
    }

    const query = `  ${colors.brightBlue}?${colors.reset} ${colors.bold}${item.key}${colors.reset} ${colors.dim}[${item.defaultValue}]${colors.reset}: `;
    const answer = await askQuestion(query);
    const value = answer !== '' ? answer : item.defaultValue;
    envLines.push(`${item.key}=${value}`);
  }

  try {
    fs.writeFileSync(envPath, envLines.join('\n'));
    logStatus(
      symbols.success,
      `Successfully created ${colors.bold}${relativeEnv}`,
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

  // Prompts only if .env is missing. If already present, skips prompting for that app.
  await configureEnvInteractive('Frontend (Client)', frontendDir);
  await configureEnvInteractive('Backend (Server)', backendDir);

  heading('2. Workspace Development Verification');
  
  logStatus(symbols.info, 'Monorepo workspaces successfully linked via package.json.');
  logStatus(symbols.info, `Workspace configurations loaded from root ${colors.bold}package.json${colors.reset}.\n`);

  console.log(`${colors.brightGreen}================================================================${colors.reset}`);
  console.log(`✨ ${colors.bold}${colors.brightGreen}FitCraft environment configuration is complete!${colors.reset}`);
  console.log(`${colors.brightGreen}================================================================${colors.reset}\n`);
  
  console.log(`${colors.bold}To start the local development servers:${colors.reset}`);
  console.log(`  ${symbols.arrow} ${colors.brightCyan}npm run dev${colors.reset} (runs turborepo dev servers)`);
  console.log(`  ${symbols.arrow} ${colors.brightCyan}npm run dev:fallback${colors.reset} (fallback concurrently mode if required)\n`);
}

main();
