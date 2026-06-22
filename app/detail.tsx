import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { CartContext } from './(tabs)/_layout';

export default function DetailScreen() {
  const router = useRouter();
  const { addToCart, favorites } = useContext(CartContext);
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    category: string;
    price: string;
    description: string;
    image: string;
    ingredients: string;
    isFavorite?: string;
  }>();

  const id = String(params.id ?? '');
  const name = String(params.name ?? 'Coffee Item');
  const category = String(params.category ?? 'Coffee');
  const price = String(params.price ?? '');
  const description = String(params.description ?? '');
  const image = String(params.image ?? '');
  const ingredients = params.ingredients ? String(params.ingredients).split(',') : [];

  const item = {
    id,
    name,
    category,
    price,
    description,
    image: image || undefined,
    ingredients,
  };
  const isFavorite = params.isFavorite === 'true' || favorites.includes(id);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {image ? <Image source={{ uri: image }} style={styles.image} /> : null}
            <Text style={styles.category}>{category}</Text>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.price}>{price}</Text>
            {isFavorite ? (
              <View style={styles.bestSellerBadge}>
                <Text style={styles.bestSellerBadgeText}>Best Seller</Text>
              </View>
            ) : null}
            <Text style={styles.description}>{description}</Text>
            {ingredients.length > 0 ? (
              <View style={styles.ingredientsWrapper}>
                <Text style={styles.ingredientsTitle}>Ingredients</Text>
                <Text style={styles.ingredients}>{ingredients.join(', ')}</Text>
              </View>
            ) : null}
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
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff5f7' },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  content: { gap: 10, marginTop: 16 },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 8,
  },
  category: {
    fontSize: 11,
    color: '#f48ab1',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: { fontSize: 32, fontWeight: 'bold', color: '#2c1a0e' },
  price: { fontSize: 22, color: '#d44c82', fontWeight: '600' },
  bestSellerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffe7ef',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  bestSellerBadgeText: {
    color: '#f45b90',
    fontSize: 13,
    fontWeight: '700',
  },
  description: { fontSize: 14, color: '#555', lineHeight: 22, marginTop: 8 },
  ingredientsWrapper: {
    backgroundColor: '#fff7fb',
    padding: 12,
    borderRadius: 8,
  },
  ingredientsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f45b90',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  ingredients: { fontSize: 13, color: '#5d4b3d', lineHeight: 20 },
  actions: { gap: 10, marginTop: 16 },
  cartBtn: {
    backgroundColor: '#f7b3cc',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cartBtnText: { color: '#2c1a0e', fontSize: 16, fontWeight: '700' },
  backBtn: {
    backgroundColor: '#f45b90',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});