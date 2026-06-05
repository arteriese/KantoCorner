import { FlatList, StyleSheet, TouchableOpacity, View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { CartContext } from './_layout';

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
};

const menuItems: MenuItem[] = [
  { id: '1', name: 'Americano', category: 'Hot Drinks', price: '₱120', description: 'Bold and strong black coffee brewed with espresso shots.' },
  { id: '2', name: 'Latte', category: 'Hot Drinks', price: '₱150', description: 'Smooth espresso with steamed milk and a light foam top.' },
  { id: '3', name: 'Cappuccino', category: 'Hot Drinks', price: '₱145', description: 'Equal parts espresso, steamed milk, and thick foam.' },
  { id: '4', name: 'Iced Matcha Latte', category: 'Cold Drinks', price: '₱165', description: 'Ceremonial grade matcha blended with cold milk over ice.' },
  { id: '5', name: 'Cold Brew', category: 'Cold Drinks', price: '₱155', description: 'Slow-steeped coffee served chilled, naturally sweet and bold.' },
  { id: '6', name: 'Strawberry Frappé', category: 'Cold Drinks', price: '₱170', description: 'Blended strawberry slush with cream and a fruity finish.' },
  { id: '7', name: 'Cheesecake', category: 'Desserts', price: '₱180', description: 'Creamy New York-style cheesecake with a buttery graham crust.' },
  { id: '8', name: 'Brownie', category: 'Desserts', price: '₱130', description: 'Dense, fudgy chocolate brownie baked fresh daily.' },
  { id: '9', name: 'Tiramisu', category: 'Desserts', price: '₱200', description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone.' },
  { id: '10', name: 'Croissant', category: 'Snacks', price: '₱95', description: 'Buttery, flaky French pastry baked to golden perfection.' },
  { id: '11', name: 'Club Sandwich', category: 'Snacks', price: '₱160', description: 'Triple-decker sandwich with chicken, bacon, egg, and veggies.' },
  { id: '12', name: 'Cheese Toast', category: 'Snacks', price: '₱110', description: 'Thick-cut toast loaded with melted cheese, served warm.' },
];

export { menuItems };
export type { MenuItem };

export default function MenuScreen() {
  const router = useRouter();
  const { addToCart } = useContext(CartContext);

  const renderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.card}>
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

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>☕ Kanto Corner Menu</Text>
        </View>
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5ede3' },
  safeArea: { flex: 1 },
  header: {
    backgroundColor: '#3b1f0e',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  list: { paddingBottom: 24 },
  card: {
    backgroundColor: '#fdf6ee',
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 8,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#c8a47e',
  },
  category: {
    fontSize: 10,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  name: { fontSize: 17, fontWeight: '600', color: '#2c1a0e', marginBottom: 2 },
  price: { fontSize: 14, color: '#8b3a1a', marginBottom: 10 },
  row: { flexDirection: 'row', gap: 8 },
  viewBtn: {
    borderWidth: 1,
    borderColor: '#3b1f0e',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  viewBtnText: { color: '#3b1f0e', fontSize: 13 },
  cartBtn: {
    backgroundColor: '#3b1f0e',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  cartBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});