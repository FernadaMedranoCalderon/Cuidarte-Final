import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/store/AppStore';
import { RootNavigator } from './src/common/navigation/RootNavigator';

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AppProvider>
  );
}
