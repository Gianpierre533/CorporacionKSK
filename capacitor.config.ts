import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Corporación KSK',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  // 🚀 DEJAS TU CONFIGURACIÓN DE PLUGINS ASÍ:
  plugins: {
    StatusBar: {
      overlaysWebView: false // ❌ Le dice a Android que NO estire la app detrás de las barras
    }
  }
};

export default config;