import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from './_layout';

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  image?: string;
  ingredients?: string[];
};

const MENU_CACHE_KEY = 'kantocorner_menu';
const API_URLS = [
  'https://api.sampleapis.com/coffee/hot',
  'https://api.sampleapis.com/coffee/iced',
];

const getPrice = (id: string | number, category: string) => {
  const numericId = Number(id) || 1;
  const base = 80 + numericId * 12;
  return category === 'Hot Drinks' ? `₱${base}` : `₱${base + 15}`;
};

const normalizeMenuItem = (item: any, category: string): MenuItem => {
  const rawId = String(item.id ?? '0');
  const uniqueId = `${category === 'Hot Drinks' ? 'hot' : 'iced'}-${rawId}`;

  return {
    id: uniqueId,
    name: item.title ?? item.name ?? 'Coffee Item',
    category,
    price: getPrice(rawId, category),
    description: item.description ?? 'Freshly brewed and ready to enjoy.',
    image: item.image,
    ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
  };
};

export { MENU_CACHE_KEY };
export type { MenuItem };

export default function MenuScreen() {
  const router = useRouter();
  const { addToCart, favorites, toggleFavorite } = useContext(CartContext);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadMenu = async () => {
      try {
        const cached = await SecureStore.getItemAsync(MENU_CACHE_KEY);
        if (cached && mounted) {
          const parsed = JSON.parse(cached) as MenuItem[];
          setMenuItems(parsed);
        }

        const responses = await Promise.all(
          API_URLS.map(async (url) => {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Failed to fetch ${url}`);
            }
            return response.json();
          })
        );

        const liveItems = responses.flatMap((data, index) =>
          data.map((item: any) =>
            normalizeMenuItem(item, index === 0 ? 'Hot Drinks' : 'Cold Drinks')
          )
        );

        if (mounted) {
          setMenuItems(liveItems);
          await SecureStore.setItemAsync(MENU_CACHE_KEY, JSON.stringify(liveItems));
          setErrorMessage(null);
        }
      } catch {
        if (mounted) {
          setErrorMessage('Unable to load menu right now. Showing cached items if available.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadMenu();

    return () => {
      mounted = false;
    };
  }, []);

  const renderItem = ({ item }: { item: MenuItem }) => {
    const isFavorite = favorites.includes(item.id);

    return (
      <View style={styles.card}>
        {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : null}
        <TouchableOpacity
          style={styles.favoriteBadge}
          onPress={() => toggleFavorite(item.id)}
        >
          <Text style={[styles.favoriteBadgeText, isFavorite && styles.favoriteBadgeTextActive]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() =>
              router.navigate({
                pathname: '/detail',
                params: {
                  id: item.id,
                  name: item.name,
                  category: item.category,
                  price: item.price,
                  description: item.description,
                  image: item.image ?? '',
                  ingredients: item.ingredients?.join(',') ?? '',
                  isFavorite: isFavorite ? 'true' : 'false',
                },
              })
            }
          >
            <Text style={styles.viewBtnText}>View Item</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => {
              addToCart(item);
              Alert.alert('Added!', `${item.name} added to cart.`);
            }}
          >
            <Text style={styles.cartBtnText}>+ Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>☕ Kanto Corner Menu</Text>
        </View>
        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#3b1f0e" />
            <Text style={styles.loadingText}>Loading menu...</Text>
          </View>
        ) : (
          <>
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}
            <FlatList
              data={menuItems}
              keyExtractor={(item) => `${item.category}-${item.id}`}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff5f7' },
  safeArea: { flex: 1 },
  header: {
    backgroundColor: '#f45b90',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  list: { paddingBottom: 24 },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { marginTop: 12, color: '#8f4a5f' },
  errorBanner: {
    backgroundColor: '#fff0f5',
    marginHorizontal: 12,
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
  },
  errorText: { color: '#b24a72', fontSize: 12 },
  card: {
    backgroundColor: '#fff7fb',
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 8,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#f7b3cc',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 6,
    marginBottom: 10,
  },
  favoriteBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  favoriteBadgeText: {
    color: '#f7b3cc',
    fontSize: 22,
    fontWeight: '700',
  },
  favoriteBadgeTextActive: {
    color: '#f45b90',
  },
  category: {
    fontSize: 10,
    color: '#f48ab1',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  name: { fontSize: 17, fontWeight: '600', color: '#2c1a0e', marginBottom: 2 },
  price: { fontSize: 14, color: '#d44c82', marginBottom: 10 },
  row: { flexDirection: 'row', gap: 8 },
  viewBtn: {
    borderWidth: 1,
    borderColor: '#f45b90',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  viewBtnText: { color: '#f45b90', fontSize: 13 },
  cartBtn: {
    backgroundColor: '#f45b90',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  cartBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});