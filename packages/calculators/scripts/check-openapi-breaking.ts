import { execSync } from 'child_process';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import semver from 'semver';

const OPENAPI_DIR = 'openapi';

/**
 * Find the highest patch version for a given major.minor version
 * by scanning the openapi directory for matching files.
 */
function findHighestPatchVersion(major: number, minor: number): string | null {
  const files = readdirSync(OPENAPI_DIR);
  const pattern = new RegExp(`^openapi-(${major}\\.${minor}\\.\\d+)\\.json$`);

  const versions = files
    .map((file) => {
      const match = file.match(pattern);
      return match ? match[1] : null;
    })
    .filter((v): v is string => v !== null)
    .sort((a, b) => semver.compare(b, a)); // Sort descending

  return versions.length > 0 ? versions[0] : null;
}

/**
 * Determine the previous version to compare against based on semver rules.
 * - Patch release (e.g., 3.0.1): compare against previous patch (3.0.0)
 * - Minor release (e.g., 3.1.0): scan for highest patch of previous minor (3.0.x)
 */
function getPreviousVersion(currentVersion: string): {
  version: string | null;
  isPatchRelease: boolean;
} {
  const parsed = semver.parse(currentVersion);
  if (!parsed) {
    throw new Error(`Invalid version: ${currentVersion}`);
  }

  const { major, minor, patch } = parsed;

  // Patch release: compare against previous patch
  if (patch > 0) {
    return {
      version: `${major}.${minor}.${patch - 1}`,
      isPatchRelease: true,
    };
  }

  // Minor release (patch === 0): compare against previous minor's highest patch
  if (minor > 0) {
    const previousMinorHighestPatch = findHighestPatchVersion(major, minor - 1);
    return {
      version: previousMinorHighestPatch,
      isPatchRelease: false,
    };
  }

  // Major release (minor === 0, patch === 0): no previous version to compare
  return {
    version: null,
    isPatchRelease: false,
  };
}

/**
 * Check if oasdiff is installed and available in PATH
 */
function checkOasdiffInstalled(): boolean {
  try {
    execSync('oasdiff --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Run oasdiff breaking changes check
 */
function runOasdiffCheck(
  baseFile: string,
  revisionFile: string,
  isPatchRelease: boolean,
): void {
  // For patch releases, fail on both errors and warnings (strict)
  // For minor releases, fail only on errors (allow warnings)
  const failOn = isPatchRelease ? 'WARN' : 'ERR';
  const releaseType = isPatchRelease ? 'patch' : 'minor';

  console.log(`\nChecking for breaking changes (${releaseType} release):`);
  console.log(`  Base:     ${baseFile}`);
  console.log(`  Revision: ${revisionFile}`);
  console.log(`  Fail on:  ${failOn}`);
  console.log('');

  const command = `oasdiff breaking --fail-on ${failOn} ${baseFile} ${revisionFile}`;
  console.log(command);

  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
    if (output.trim()) {
      console.log(output);
    }
    console.log('✓ No breaking changes detected.');
  } catch (error) {
    if (error && typeof error === 'object' && 'stdout' in error) {
      const stdout = (error as { stdout: string }).stdout;
      if (stdout) {
        console.log(stdout);
      }
    }
    if (error && typeof error === 'object' && 'stderr' in error) {
      const stderr = (error as { stderr: string }).stderr;
      if (stderr) {
        console.error(stderr);
      }
    }
    console.error(
      `\n✗ Breaking changes detected! This is not allowed for a ${releaseType} version bump.`,
    );
    process.exit(1);
  }
}

function main(): void {
  // Check if oasdiff is installed
  if (!checkOasdiffInstalled()) {
    console.error('Error: oasdiff is not installed or not in PATH.');
    console.error('Install it from: https://github.com/Tufin/oasdiff');
    console.error('  brew install oasdiff  # macOS');
    console.error('  go install github.com/tufin/oasdiff@latest  # Go');
    process.exit(1);
  }

  // Read current version from package.json
  const packageJsonPath = join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const currentVersion: string = packageJson.version;

  if (!currentVersion) {
    console.error('Error: Could not read version from package.json');
    process.exit(1);
  }

  console.log(`Current version: ${currentVersion}`);

  // Determine previous version to compare against
  const { version: previousVersion, isPatchRelease } =
    getPreviousVersion(currentVersion);

  if (!previousVersion) {
    console.log(
      'No previous version to compare against (first release of this major version).',
    );
    console.log('Skipping breaking changes check.');
    return;
  }

  console.log(`Previous version: ${previousVersion}`);

  // Build file paths
  const currentFile = join(OPENAPI_DIR, `openapi-${currentVersion}.json`);
  const previousFile = join(OPENAPI_DIR, `openapi-${previousVersion}.json`);

  // Check if files exist
  if (!existsSync(currentFile)) {
    console.error(`Error: Current OpenAPI spec not found: ${currentFile}`);
    console.error('Run "pnpm generate:openapi" first to generate it.');
    process.exit(1);
  }

  if (!existsSync(previousFile)) {
    console.log(`Previous OpenAPI spec not found: ${previousFile}`);
    console.log('Skipping breaking changes check.');
    return;
  }

  // Run the check
  runOasdiffCheck(previousFile, currentFile, isPatchRelease);
}

main();
