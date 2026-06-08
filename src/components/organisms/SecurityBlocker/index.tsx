import React, { useEffect } from 'react';
import { View, Text, BackHandler, Platform, StatusBar, NativeModules } from 'react-native';
import Button from '../../../components/atoms/Button/index.tsx';
import { createStyles } from './styles.ts';
import { useTheme } from '../../../theme/ThemeProvider';

export const SecurityBlocker = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  useEffect(() => {
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const handleExitApp = () => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    } else {
      const ExitModule = NativeModules.ExitModule;

      if (ExitModule && typeof ExitModule.exitApp === 'function') {
        ExitModule.exitApp();
      } else {
        if (__DEV__) {
          console.warn('Native ExitModule is not found in this environment.');
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Text style={styles.icon}>🚨</Text>
        </View>
        <Text style={styles.title}>Device Not Supported</Text>
        <Text style={styles.subtitle}>
          For your financial security and account protection, this application cannot run on a
          {Platform.OS === 'ios' ? ' jailbroken' : ' rooted'} device or a device utilizing mock
          location parameters.
        </Text>
      </View>
      <View style={styles.footer}>
        <Button
          title="Close Application"
          type="regular"
          onPress={handleExitApp}
          style={styles.buttonOverride}
          textColor="white"
        />
      </View>
    </View>
  );
};

export default SecurityBlocker;
