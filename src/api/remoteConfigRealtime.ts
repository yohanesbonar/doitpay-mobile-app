import remoteConfig from '@react-native-firebase/remote-config';

type RemoteConfigUpdateListener = (updatedKeys: ReadonlySet<string>) => void;

const listeners = new Set<RemoteConfigUpdateListener>();

let stopListening: (() => void) | undefined;
let refreshPromise: Promise<boolean> | undefined;

export const subscribeToRemoteConfigUpdates = (listener: RemoteConfigUpdateListener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const refreshRemoteConfigAndNotify = () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  const rc = remoteConfig();
  refreshPromise = (async () => {
    await rc.setConfigSettings({
      fetchTimeMillis: 10_000,
      minimumFetchIntervalMillis: 0,
    });

    const didActivate = await rc.fetchAndActivate();
    const updatedKeys = new Set(Object.keys(rc.getAll()));

    if (__DEV__) {
      console.log('[Remote Config] Foreground refresh completed:', {
        didActivate,
        lastFetchStatus: rc.lastFetchStatus,
        updatedKeys: didActivate ? [...updatedKeys] : [],
      });
    }

    if (didActivate) {
      listeners.forEach((listener) => {
        try {
          listener(updatedKeys);
        } catch (error) {
          console.error('[Remote Config] Refresh subscriber failed:', error);
        }
      });
    }

    return didActivate;
  })().finally(() => {
    refreshPromise = undefined;
  });

  return refreshPromise;
};

export const startRemoteConfigRealtimeUpdates = () => {
  if (stopListening) {
    return stopListening;
  }

  const rc = remoteConfig();
  let isListening = true;
  let updateQueue = Promise.resolve();

  const unsubscribe = rc.onConfigUpdate({
    next: (configUpdate) => {
      const updatedKeys = configUpdate.getUpdatedKeys();

      updateQueue = updateQueue
        .then(async () => {
          await rc.activate();

          if (__DEV__) {
            console.log('[Remote Config] Realtime update activated:', [...updatedKeys]);
          }

          listeners.forEach((listener) => {
            try {
              listener(updatedKeys);
            } catch (error) {
              console.error('[Remote Config] Realtime update subscriber failed:', error);
            }
          });
        })
        .catch((error) => {
          console.error('[Remote Config] Failed to activate realtime update:', error);
        });
    },
    error: (error) => {
      console.error('[Remote Config] Realtime listener failed:', error);
    },
    complete: () => {
      console.warn('[Remote Config] Realtime listener completed.');
    },
  });

  const stop = () => {
    if (!isListening) {
      return;
    }

    isListening = false;
    unsubscribe();
    stopListening = undefined;
  };

  stopListening = stop;
  return stop;
};
