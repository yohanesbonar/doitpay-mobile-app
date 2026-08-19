# Doitpay Mobile App

React Native (New Architecture) mobile payment app — onboarding & KYC, transfers, transaction history, disputes, notifications, and profile management, with staging/production environments for both Android and iOS.

## Prerequisites

- Node.js >= 22.11.0
- Yarn
- JDK 17 or newer
- Android Studio, with the Android SDK installed and `ANDROID_HOME`/`JAVA_HOME` set in your shell profile ([RN environment setup guide](https://reactnative.dev/docs/set-up-your-environment))
- Xcode with Command Line Tools, and at least one iOS Simulator installed
- Ruby & Bundler + CocoaPods (for iOS dependencies)

Firebase config files (`android/app/google-services.json`, `ios/GoogleService-Info.plist`) and the Android debug keystore are already committed to this repo, so no extra setup is needed for a debug build.

## Setup

```bash
# 1. Install JS dependencies
yarn install

# 2. Install Ruby gems (CocoaPods, fastlane, etc.)
bundle install

# 3. Install iOS pods
cd ios && bundle exec pod install && cd ..
```

### Environment files

The app uses [`react-native-config`](https://github.com/luggit/react-native-config). Create these files at the project root (ask a teammate for values, or copy from an existing teammate's setup):

- `.env` — local/default
- `.env.staging`
- `.env.production`

Each needs:

```
API_URL=...
APP_NAME=...
```

## Running the app

```bash
# Start Metro bundler
yarn start

# Run on Android (staging)
yarn android-staging

# Run on Android (staging), clean build
yarn android-staging:clean

# Run on Android (production)
yarn android-production

# Run on iOS (staging) — iPhone 17 Pro simulator by default
yarn ios-staging

# Run on iOS (production)
yarn ios-production
```

> To use a different simulator, edit the `--simulator` flag in the `ios-staging` / `ios-production` scripts in `package.json`.

## Other useful commands

```bash
yarn lint          # lint
yarn lint:fix       # lint and auto-fix
yarn format         # prettier
yarn test           # jest

npx react-native-asset   # link new font/asset files after adding them
```

## Building release binaries

> These are not needed to just run the app in development — only for producing signed release builds. They won't run as-is on a fresh clone; see the notes below.

```bash
# Android APK
yarn build:android-staging
yarn build:android-production

# Android App Bundle (AAB)
yarn build-bundle:android-staging:clean
yarn build-bundle:android-production:clean

# iOS archive (.xcarchive)
yarn archive:ios-staging
yarn archive:ios-production

# iOS IPA export
yarn ipa:ios-staging
yarn ipa:ios-production
```

- **Android release** signing needs `RELEASE_STORE_FILE`, `RELEASE_STORE_PASSWORD`, `RELEASE_KEY_ALIAS`, `RELEASE_KEY_PASSWORD` (as env vars, or filled in in `android/gradle.properties`) plus the actual release keystore file — none of these are in the repo, ask a teammate.
- **iOS IPA export** needs `ios/ExportOptions.plist`, which also isn't in the repo yet — ask a teammate or create one for your Apple signing setup before running `yarn ipa:ios-*`.

## Troubleshooting

### iOS "Could not build module" errors

```bash
cd ios
pod cache clean --all
rm -rf Podfile.lock Pods
pod repo update
bundle exec pod install
cd ..
yarn start --reset-cache
```

In Xcode: Close Xcode → clean Derived Data (`rm -rf ~/Library/Developer/Xcode/DerivedData/*`) → reopen → Product → Clean Build Folder (⇧⌘K).

### Android build issues

```bash
yarn clean:android
# or, for a full reset (removes node_modules and yarn.lock too):
yarn clean-run-android
```
