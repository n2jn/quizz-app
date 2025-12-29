import { SplashScreen } from 'expo-router';
import { useSession } from './../src/providers/AuthProvider/AuthProvider';

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useSession();

  if (!isLoading) {
    SplashScreen.hide();
  }

  return null;
}
