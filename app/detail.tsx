import { StyleSheet, TouchableOpacity, View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { CartContext } from './(tabs)/_layout';
import { menuItems } from './(tabs)/index';

export default function DetailScreen() {
  const router = useRouter();
  const { addToCart } = useContext(CartContext);
  const { id, name, category, price, description } = useLocalSearchParams<{
    id: string;
    name: string;
    category: string;
    price: string;
    description: string;
  }>();

  const item = menuItems.find((m) => m.id === id)!;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.category}>{category}</Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => {
              addToCart(item);
              Alert.alert('Added!', `${name} added to cart.`);
            }}
          >
            <Text style={styles.cartBtnText}>+ Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← Back to Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5ede3' },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  content: { gap: 10, marginTop: 16 },
  category: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: { fontSize: 32, fontWeight: 'bold', color: '#2c1a0e' },
  price: { fontSize: 22, color: '#8b3a1a', fontWeight: '600' },
  description: { fontSize: 14, color: '#555', lineHeight: 22, marginTop: 8 },
  actions: { gap: 10 },
  cartBtn: {
    backgroundColor: '#c8a47e',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cartBtnText: { color: '#2c1a0e', fontSize: 16, fontWeight: '700' },
  backBtn: {
    backgroundColor: '#3b1f0e',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});