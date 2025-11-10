/**
 * PRE-BUILD CHECK SCRIPT
 * Memastikan semua requirement terpenuhi sebelum build untuk Vercel
 *
 * Cara menjalankan:
 * node scripts/pre-build-check.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

// Colors for console output
const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(COLORS[color] + message + COLORS.reset);
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logError(message) {
  log(`❌ ${message}`, "red");
}

function logWarning(message) {
  log(`⚠️  ${message}`, "yellow");
}

function logInfo(message) {
  log(`ℹ️  ${message}`, "blue");
}

function logHeader(message) {
  console.log("\n" + COLORS.cyan + "━".repeat(80) + COLORS.reset);
  log(`  ${message}`, "bright");
  console.log(COLORS.cyan + "━".repeat(80) + COLORS.reset);
}

// Test results
let passed = 0;
let failed = 0;
let warnings = 0;

// ==================== CHECKS ====================

/**
 * 1. Check Environment Variables
 */
function checkEnvironmentVariables() {
  logHeader("🔍 Checking Environment Variables");

  const envFile = path.join(rootDir, ".env.local");
  const envExampleFile = path.join(rootDir, ".env.example");

  // Check if .env.local exists
  if (!fs.existsSync(envFile)) {
    logWarning(".env.local not found");
    logInfo("Create .env.local file with required variables");

    if (fs.existsSync(envExampleFile)) {
      logInfo("Reference: .env.example file exists");
    }
    warnings++;
  } else {
    logSuccess(".env.local file found");
    passed++;

    // Read and check required variables
    const envContent = fs.readFileSync(envFile, "utf-8");
    const requiredVars = [
      "NEXT_PUBLIC_API_URL",
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ];

    requiredVars.forEach((varName) => {
      if (envContent.includes(varName)) {
        logSuccess(`  ${varName} is defined`);
      } else {
        logWarning(`  ${varName} is NOT defined`);
        warnings++;
      }
    });
  }

  // Check for .env.example
  if (fs.existsSync(envExampleFile)) {
    logSuccess(".env.example file found");
    passed++;
  } else {
    logWarning(".env.example not found (recommended for documentation)");
    warnings++;
  }
}

/**
 * 2. Check Required Files and Directories
 */
function checkRequiredStructure() {
  logHeader("📁 Checking Project Structure");

  const requiredFiles = [
    "package.json",
    "next.config.ts",
    "tsconfig.json",
    "tailwind.config.ts",
    "postcss.config.mjs",
  ];

  const requiredDirs = [
    "src",
    "src/app",
    "src/components",
    "src/lib",
    "src/hooks",
    "src/contexts",
    "public",
  ];

  // Check files
  requiredFiles.forEach((file) => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      logSuccess(`File: ${file}`);
      passed++;
    } else {
      logError(`File missing: ${file}`);
      failed++;
    }
  });

  // Check directories
  requiredDirs.forEach((dir) => {
    const dirPath = path.join(rootDir, dir);
    if (fs.existsSync(dirPath)) {
      logSuccess(`Directory: ${dir}`);
      passed++;
    } else {
      logError(`Directory missing: ${dir}`);
      failed++;
    }
  });
}

/**
 * 3. Check Dependencies
 */
function checkDependencies() {
  logHeader("📦 Checking Dependencies");

  const packageJsonPath = path.join(rootDir, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    logError("package.json not found");
    failed++;
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  // Check if node_modules exists
  const nodeModulesPath = path.join(rootDir, "node_modules");
  if (!fs.existsSync(nodeModulesPath)) {
    logWarning("node_modules not found - run npm install");
    warnings++;
  } else {
    logSuccess("node_modules directory exists");
    passed++;
  }

  // Check critical dependencies
  const criticalDeps = [
    "next",
    "react",
    "react-dom",
    "@tanstack/react-query",
    "axios",
    "@supabase/supabase-js",
  ];

  criticalDeps.forEach((dep) => {
    if (packageJson.dependencies?.[dep]) {
      logSuccess(`  ${dep} v${packageJson.dependencies[dep]}`);
    } else {
      logError(`  ${dep} is NOT installed`);
      failed++;
    }
  });
}

/**
 * 4. Check TypeScript Configuration
 */
function checkTypeScriptConfig() {
  logHeader("⚙️  Checking TypeScript Configuration");

  const tsconfigPath = path.join(rootDir, "tsconfig.json");

  if (!fs.existsSync(tsconfigPath)) {
    logError("tsconfig.json not found");
    failed++;
    return;
  }

  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));

  // Check important TypeScript settings
  const checks = [
    {
      path: ["compilerOptions", "strict"],
      expected: true,
      message: "Strict mode enabled",
    },
    {
      path: ["compilerOptions", "esModuleInterop"],
      expected: true,
      message: "ES Module Interop enabled",
    },
    {
      path: ["compilerOptions", "skipLibCheck"],
      expected: true,
      message: "Skip Lib Check enabled",
    },
  ];

  checks.forEach((check) => {
    let value = tsconfig;
    for (const key of check.path) {
      value = value?.[key];
    }

    if (value === check.expected) {
      logSuccess(check.message);
      passed++;
    } else {
      logWarning(
        `${check.message}: current=${value}, expected=${check.expected}`
      );
      warnings++;
    }
  });
}

/**
 * 5. Check Next.js Configuration
 */
function checkNextConfig() {
  logHeader("⚙️  Checking Next.js Configuration");

  const nextConfigPath = path.join(rootDir, "next.config.ts");

  if (!fs.existsSync(nextConfigPath)) {
    logError("next.config.ts not found");
    failed++;
    return;
  }

  logSuccess("next.config.ts found");
  passed++;

  // Read config file content
  const configContent = fs.readFileSync(nextConfigPath, "utf-8");

  // Check for important configurations
  if (configContent.includes("images")) {
    logSuccess("Image configuration found");
    passed++;
  } else {
    logWarning("No image configuration found (may need for remote images)");
    warnings++;
  }
}

/**
 * 6. Check Critical Source Files
 */
function checkCriticalSourceFiles() {
  logHeader("📄 Checking Critical Source Files");

  const criticalFiles = [
    { path: "src/app/layout.tsx", name: "Root Layout" },
    { path: "src/app/page.tsx", name: "Home Page" },
    { path: "src/contexts/AuthContext.tsx", name: "Auth Context" },
    { path: "src/lib/storage.ts", name: "Storage Utility" },
    { path: "src/lib/query-client.ts", name: "React Query Client" },
    { path: "src/components/providers/Providers.tsx", name: "App Providers" },
  ];

  criticalFiles.forEach(({ path: filePath, name }) => {
    const fullPath = path.join(rootDir, filePath);
    if (fs.existsSync(fullPath)) {
      logSuccess(`${name}: ${filePath}`);
      passed++;
    } else {
      logError(`${name} missing: ${filePath}`);
      failed++;
    }
  });
}

/**
 * 7. Check API Integration Files
 */
function checkAPIIntegration() {
  logHeader("🔌 Checking API Integration");

  const apiFiles = [
    "src/lib/api/responseHelper.ts",
    "src/lib/api/kelas.ts",
    "src/lib/api/materi.ts",
    "src/lib/api/kuis.ts",
    "src/lib/api/soal.ts",
    "src/lib/api/laporan.ts",
    "src/lib/api/analisis.ts",
  ];

  apiFiles.forEach((file) => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      logSuccess(`API: ${file}`);
      passed++;
    } else {
      logWarning(`API file not found: ${file}`);
      warnings++;
    }
  });
}

/**
 * 8. Check Public Assets
 */
function checkPublicAssets() {
  logHeader("🖼️  Checking Public Assets");

  const publicDir = path.join(rootDir, "public");

  if (!fs.existsSync(publicDir)) {
    logError("public directory not found");
    failed++;
    return;
  }

  logSuccess("public directory exists");
  passed++;

  // Check for common asset directories
  const assetDirs = ["assets", "logo", "mascot", "guru", "siswa"];

  assetDirs.forEach((dir) => {
    const dirPath = path.join(publicDir, dir);
    if (fs.existsSync(dirPath)) {
      logSuccess(`  Asset directory: ${dir}`);
    } else {
      logInfo(`  Optional asset directory not found: ${dir}`);
    }
  });
}

/**
 * 9. Check Build Output Directory
 */
function checkBuildOutput() {
  logHeader("🏗️  Checking Build Output");

  const nextDir = path.join(rootDir, ".next");
  const outDir = path.join(rootDir, "out");

  if (fs.existsSync(nextDir)) {
    logInfo(".next directory exists (previous build found)");
    logInfo("This will be cleaned on next build");
  } else {
    logInfo(".next directory not found (no previous build)");
  }

  if (fs.existsSync(outDir)) {
    logInfo("out directory exists (previous static export found)");
  } else {
    logInfo("out directory not found (no previous static export)");
  }

  passed++;
}

/**
 * 10. Check Git Configuration
 */
function checkGitConfig() {
  logHeader("🔧 Checking Git Configuration");

  const gitDir = path.join(rootDir, ".git");
  const gitignore = path.join(rootDir, ".gitignore");

  if (fs.existsSync(gitDir)) {
    logSuccess("Git repository initialized");
    passed++;
  } else {
    logWarning("Not a git repository");
    warnings++;
  }

  if (fs.existsSync(gitignore)) {
    logSuccess(".gitignore file found");
    passed++;

    const gitignoreContent = fs.readFileSync(gitignore, "utf-8");
    const importantIgnores = ["node_modules", ".next", ".env.local", "out"];

    importantIgnores.forEach((pattern) => {
      if (gitignoreContent.includes(pattern)) {
        logSuccess(`  Ignoring: ${pattern}`);
      } else {
        logWarning(`  Not ignoring: ${pattern}`);
        warnings++;
      }
    });
  } else {
    logWarning(".gitignore not found");
    warnings++;
  }
}

/**
 * 11. Check Vercel Configuration
 */
function checkVercelConfig() {
  logHeader("🚀 Checking Vercel Configuration");

  const vercelJson = path.join(rootDir, "vercel.json");
  const vercelDir = path.join(rootDir, ".vercel");

  if (fs.existsSync(vercelJson)) {
    logSuccess("vercel.json found");
    passed++;

    const vercelConfig = JSON.parse(fs.readFileSync(vercelJson, "utf-8"));
    logInfo("Vercel configuration:");
    console.log(JSON.stringify(vercelConfig, null, 2));
  } else {
    logInfo("vercel.json not found (optional - Next.js has default config)");
  }

  if (fs.existsSync(vercelDir)) {
    logInfo(".vercel directory exists (project is linked to Vercel)");
  } else {
    logInfo(".vercel directory not found (project not yet linked)");
  }

  passed++;
}

// ==================== MAIN ====================

function runPreBuildChecks() {
  console.clear();
  log("\n" + "=".repeat(80), "cyan");
  log("  🔍 ADAPTIVIN USER - PRE-BUILD CHECK", "bright");
  log("=".repeat(80) + "\n", "cyan");

  logInfo(`Checking project at: ${rootDir}`);
  logInfo(`Started at: ${new Date().toLocaleString()}\n`);

  // Run all checks
  checkEnvironmentVariables();
  checkRequiredStructure();
  checkDependencies();
  checkTypeScriptConfig();
  checkNextConfig();
  checkCriticalSourceFiles();
  checkAPIIntegration();
  checkPublicAssets();
  checkBuildOutput();
  checkGitConfig();
  checkVercelConfig();

  // Summary
  console.log("\n" + COLORS.cyan + "=".repeat(80) + COLORS.reset);
  log("  📊 CHECK SUMMARY", "bright");
  console.log(COLORS.cyan + "=".repeat(80) + COLORS.reset);

  log(`\n✅ Passed: ${passed}`, "green");
  log(`❌ Failed: ${failed}`, failed > 0 ? "red" : "green");
  log(`⚠️  Warnings: ${warnings}`, warnings > 0 ? "yellow" : "green");

  const total = passed + failed + warnings;
  log(`📈 Success Rate: ${Math.round((passed / total) * 100)}%\n`, "blue");

  if (failed === 0 && warnings === 0) {
    log("🎉 ALL CHECKS PASSED! Ready to build for deployment! 🚀", "green");
  } else if (failed === 0) {
    log(
      "✅ All critical checks passed. Warnings can be addressed but not blocking.",
      "green"
    );
  } else {
    log("❌ Some critical checks failed. Please fix before building.", "red");
  }

  log(`\nFinished at: ${new Date().toLocaleString()}`, "blue");
  console.log(COLORS.cyan + "=".repeat(80) + COLORS.reset + "\n");

  // Recommendations
  if (failed > 0 || warnings > 0) {
    logHeader("💡 RECOMMENDATIONS");

    if (warnings > 0) {
      log("\nTo resolve warnings:", "yellow");
      log("1. Create/update .env.local with all required variables");
      log("2. Run: npm install (if dependencies are missing)");
      log("3. Check .gitignore includes sensitive files");
    }

    if (failed > 0) {
      log("\nTo resolve failures:", "red");
      log("1. Fix missing critical files");
      log("2. Ensure all dependencies are installed");
      log("3. Verify project structure is correct");
    }
  }

  log("\n📝 Next Steps:", "blue");
  log("1. Run: npm run build (to test local build)");
  log("2. Run: npm run start (to test production build locally)");
  log("3. Deploy to Vercel Desktop or Vercel CLI");
  log("4. Ensure environment variables are set in Vercel dashboard\n");

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Run checks
runPreBuildChecks();
