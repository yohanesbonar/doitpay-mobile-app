# DoitPay Mobile App Instructions

## Commands

Use Yarn with Node `>=22.11.0` (`package.json`); CI uses Node 24.

```bash
yarn lint
yarn lint:fix
yarn format
yarn test
yarn test __tests__/App.test.tsx --runInBand
yarn test --runInBand -t "renders correctly"
```

Run the flavor that matches the environment file:

```bash
yarn android-staging
yarn android-production
yarn ios-staging
yarn ios-production
yarn build:android-staging
yarn build:android-production
```

Android defines `staging` and `production` product flavors. `ENVFILE` and `react-native-config` select `.env.staging` or `.env.production`; preserve this mapping when adding variants or environment-dependent configuration. Release APKs are written under `android/app/build/outputs/apk/<flavor>/release/`.

## Architecture

- `App.tsx` is the composition root. It initializes i18n and wraps navigation with gesture handling, bottom sheets, React Query, safe-area, theme, toast, push-notification hooks, connectivity UI, update enforcement, and optional PostHog. Keep app-wide providers and startup behavior here.
- `RootNavigator` is the authentication boundary. MMKV-backed `useAuthStore.accessToken` selects onboarding versus the authenticated stack; it also fetches the profile to route pending account-deletion users to `DeleteAccountStatus`.
- `MainTabNavigator` owns the authenticated tabs; the root stack owns all detail and flow screens. Tab route names are translated strings, so navigate by the root-stack names for cross-flow destinations rather than assuming fixed tab identifiers.
- UI implementation lives in `src/features/<domain>`, while `src/screens` commonly supplies navigation adapters that translate navigator actions into callback props for feature views. Preserve that separation when a feature needs navigation orchestration.
- Feature data follows `api/` modules (thin `apiClient` calls), typed `types.ts`, and React Query hooks in `hooks/`. Queries use stable array keys and mutations invalidate the affected key prefix. Global defaults are in `src/api/queryClient.ts`.
- All HTTP requests use `src/api/client.ts`. Its interceptors add device/version headers, attach and refresh MMKV tokens, serialize concurrent refreshes, surface offline errors, and record production telemetry. Use `noNeedAuth` for explicitly unauthenticated requests and `skipAuthRetry` only where a 401 must not refresh.
- `src/storage` is the persistent MMKV layer for tokens and app flags; Zustand stores expose reactive app/auth state. Theme preference and language are separately persisted by their providers.

## Repository Conventions

- Import application modules through the `@/` alias (`@/*` maps to `src/*` in both TypeScript and Babel); do not introduce a second import-root convention.
- Use `useTheme()` for palette-aware UI and `theme/metrics` for responsive dimensions. Screen and reusable-component styles are commonly extracted to sibling `styles.ts` files as `createStyles(colors)` functions.
- Add user-facing translation keys to both `src/i18n/locales/id.json` and `en.json`, then retrieve them with `useTranslation()`. Indonesian is currently forced as the initial language in `initI18next.ts`.
- Assets are re-exported from their `src/assets/icons/index.ts` or `src/assets/images/index.ts` barrels where applicable. New fonts or linked image assets require `npx react-native-asset` and, for iOS, `cd ios && bundle exec pod install`.
- Use the shared `trackPostHogEvent` / `trackScreenView` helpers for analytics so release, platform, and version properties remain consistent. Do not instantiate PostHog clients in individual features.
- Formatting is Prettier with single quotes, no required arrow parentheses, and trailing commas. ESLint uses the flat configuration in `eslint.config.mts`.
