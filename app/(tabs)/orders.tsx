import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { CartContext } from './_layout';

export default function OrdersScreen() {
  const { cart, removeFromCart } = useContext(CartContext);

  const handleStatusPress = (id: string) => {
    removeFromCart(id);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🧾 Your Orders</Text>
        </View>

        {cart.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No orders yet.</Text>
            <Text style={styles.emptySubtext}>Add something from the menu to see it here.</Text>
          </View>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                </View>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemQty}>Quantity: {item.quantity}</Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.servedBtn}
                    onPress={() => handleStatusPress(item.id)}
                  >
                    <Text style={styles.servedBtnText}>Served</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => handleStatusPress(item.id)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
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
  list: { padding: 12, gap: 10 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: { color: '#2c1a0e', fontSize: 18, fontWeight: '600' },
  emptySubtext: { color: '#7a6a5b', fontSize: 14, textAlign: 'center', marginTop: 6 },
  card: {
    backgroundColor: '#fdf6ee',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#c8a47e',
    padding: 14,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  itemName: { color: '#2c1a0e', fontSize: 16, fontWeight: '700', flex: 1 },
  itemPrice: { color: '#8b3a1a', fontSize: 14, fontWeight: '600' },
  itemCategory: {
    color: '#999',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  itemQty: { color: '#5d4b3d', fontSize: 13, marginTop: 6 },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  servedBtn: {
    flex: 1,
    backgroundColor: '#3b1f0e',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  servedBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#b85c4d',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelBtnText: { color: '#b85c4d', fontSize: 13, fontWeight: '600' },
});