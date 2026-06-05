import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>👤 Profile</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.coming}>Profile Coming Soon!</Text>
        </View>
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
  body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  coming: { fontSize: 18, color: '#999' },
});