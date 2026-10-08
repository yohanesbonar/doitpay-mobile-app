import { AppState, AppStateStatus } from 'react-native';
import { storage } from '../../storage';

export const APP_LOCK_TIMEOUT_MS = 3 * 60 * 1000;

const BACKGROUNDED_AT_KEY = 'app_backgrounded_at';

export const startAppLockWatcher = (onShouldLock: () => void) => {
  let previousState: AppStateStatus = AppState.currentState;

  const subscription = AppState.addEventListener('change', (nextState) => {
    const wasActive = previousState === 'active';
    const isNowActive = nextState === 'active';

    if (wasActive && !isNowActive) {
      storage.set(BACKGROUNDED_AT_KEY, Date.now());
    }

    if (!wasActive && isNowActive) {
      const backgroundedAt = storage.getNumber(BACKGROUNDED_AT_KEY) ?? 0;
      const elapsed = Date.now() - backgroundedAt;

      if (backgroundedAt > 0 && elapsed >= APP_LOCK_TIMEOUT_MS) {
        onShouldLock();
      }
    }

    previousState = nextState;
  });

  return () => subscription.remove();
};
