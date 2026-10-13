#!/usr/bin/env node
/**
 * Syncs the iOS native version (MARKETING_VERSION / CURRENT_PROJECT_VERSION)
 * in project.pbxproj to match package.json's "version".
 *
 * Why not `react-native-version` for iOS: its default pbxproj parser
 * (pbxproj-dom) fails to parse this project's project.pbxproj (long,
 * heavily-escaped `shellScript` build phases from Firebase/CocoaPods trip
 * up its grammar), and its `--legacy` (agvtool) mode rewrites
 * Info.plist's CFBundleShortVersionString from the `$(MARKETING_VERSION)`
 * build-variable reference into a hardcoded literal, which is a lossy
 * change we don't want. This script does a narrow, targeted regex
 * replacement instead, touching only the MARKETING_VERSION and
 * CURRENT_PROJECT_VERSION lines, and leaves everything else (including
 * Info.plist) untouched.
 *
 * Run via `postversion` (see package.json) so it fires automatically after
 * `npm version <patch|minor|major>`. Can also be run standalone.
 *
 * Flags:
 *   --never-increment-build  Only sync MARKETING_VERSION, leave the build
 *                             number (CURRENT_PROJECT_VERSION) untouched.
 */
const fs = require("fs");
const path = require("path");

const pkg = require("../package.json");

const iosDir = path.join(__dirname, "..", "ios");
const projectDirName = fs
  .readdirSync(iosDir)
  .find((name) => name.endsWith(".xcodeproj"));

if (!projectDirName) {
  console.error("[ios-version] No .xcodeproj found under ios/");
  process.exit(1);
}

const pbxprojPath = path.join(iosDir, projectDirName, "project.pbxproj");
let contents = fs.readFileSync(pbxprojPath, "utf8");

const neverIncrementBuild = process.argv.includes("--never-increment-build");

const marketingMatches = contents.match(/MARKETING_VERSION = [^;]+;/g) || [];
const buildMatches = contents.match(/CURRENT_PROJECT_VERSION = \d+;/g) || [];

if (marketingMatches.length === 0 || buildMatches.length === 0) {
  console.error(
    "[ios-version] Could not find MARKETING_VERSION / CURRENT_PROJECT_VERSION in project.pbxproj",
  );
  process.exit(1);
}

const currentBuildNumber = Math.max(
  ...buildMatches.map((m) => parseInt(m.match(/\d+/)[0], 10)),
);
const newBuildNumber = neverIncrementBuild
  ? currentBuildNumber
  : currentBuildNumber + 1;

contents = contents.replace(
  /MARKETING_VERSION = [^;]+;/g,
  `MARKETING_VERSION = ${pkg.version};`,
);
contents = contents.replace(
  /CURRENT_PROJECT_VERSION = \d+;/g,
  `CURRENT_PROJECT_VERSION = ${newBuildNumber};`,
);

fs.writeFileSync(pbxprojPath, contents);

console.log(
  `[ios-version] MARKETING_VERSION -> ${pkg.version}, CURRENT_PROJECT_VERSION -> ${newBuildNumber}`,
);
