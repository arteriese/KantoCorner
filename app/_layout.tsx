import { Stack } from 'expo-router';
import { CartProvider } from './(tabs)/_layout';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="detail"
          options={{ title: 'Coffee Details', headerShown: true }}
        />
      </Stack>
    </CartProvider>
  );
}