import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ashdelacruz',
  appName: 'AshDelaCruz',
  webDir: 'dist/ash-dela-cruz',
  server: {
    androidScheme: 'https',
  },
  ios: {
    webContentsDebuggingEnabled: true,
    contentInset: 'always',
  }
};

export default config;
