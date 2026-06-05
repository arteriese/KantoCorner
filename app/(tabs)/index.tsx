import { FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: string;
};

const menuItems: MenuItem[] = [
  // Hot Drinks
  { id: '1', name: 'Americano', category: 'Hot Drinks', price: '₱120' },
  { id: '2', name: 'Latte', category: 'Hot Drinks', price: '₱150' },
  { id: '3', name: 'Cappuccino', category: 'Hot Drinks', price: '₱145' },
  // Cold Drinks
  { id: '4', name: 'Iced Matcha Latte', category: 'Cold Drinks', price: '₱165' },
  { id: '5', name: 'Cold Brew', category: 'Cold Drinks', price: '₱155' },
  { id: '6', name: 'Strawberry Frappé', category: 'Cold Drinks', price: '₱170' },
  // Desserts
  { id: '7', name: 'Cheesecake', category: 'Desserts', price: '₱180' },
  { id: '8', name: 'Brownie', category: 'Desserts', price: '₱130' },
  { id: '9', name: 'Tiramisu', category: 'Desserts', price: '₱200' },
  // Snacks (new category)
  { id: '10', name: 'Croissant', category: 'Snacks', price: '₱95' },
  { id: '11', name: 'Club Sandwich', category: 'Snacks', price: '₱160' },
  { id: '12', name: 'Cheese Toast', category: 'Snacks', price: '₱110' },
];

export default function HomeScreen() {
  const renderItem = ({ item }: { item: MenuItem }) => (
    <ThemedView style={styles.card}>
      <ThemedText type="small" style={styles.category}>
        {item.category}
      </ThemedText>
      <ThemedView style={styles.row}>
        <ThemedText type="defaultSemiBold" style={styles.name}>
          {item.name}
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.price}>
          {item.price}
        </ThemedText>
      </ThemedView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => Alert.alert(item.name, `Price: ${item.price}`)}
      >
        <ThemedText type="small" style={styles.buttonText}>
          View Item
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          Kanto Corner Menu
        </ThemedText>
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  title: {
    marginTop: Spacing.three,
    marginBottom: Spacing.three,
  },
  list: {
    gap: Spacing.two,
    paddingBottom: Spacing.four,
  },
  card: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#444',
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: 18,
  },
  price: {
    fontSize: 16,
    opacity: 0.8,
  },
  button: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  buttonText: {
    opacity: 0.9,
  },
});