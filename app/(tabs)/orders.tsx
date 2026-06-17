import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from './_layout';

export default function OrdersScreen() {
  const {
    cart,
    clearCart,
    updateQuantity,
    specialInstruction,
    saveSpecialInstruction,
  } = useContext(CartContext);
  const [draftInstruction, setDraftInstruction] = useState(specialInstruction);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);

  useEffect(() => {
    setDraftInstruction(specialInstruction);
  }, [specialInstruction]);

  const handleSaveNote = async () => {
    Keyboard.dismiss();
    setIsSavingNote(true);
    try {
      await saveSpecialInstruction(draftInstruction);
      setIsEditingNote(false);
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleServed = () => {
    clearCart();
  };

  const handleCancel = () => {
    Alert.alert('Cancel order?', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, cancel', style: 'destructive', onPress: clearCart },
    ]);
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item.price.replace(/[^\d.]/g, '')) || 0;
    return sum + price * item.quantity;
  }, 0);

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
          <View style={styles.list}>
            <TouchableOpacity
              style={styles.orderCard}
              onLongPress={() => setIsEditingNote(true)}
              activeOpacity={0.9}
            >
              <View style={styles.orderTopRow}>
                <View>
                  <Text style={styles.orderTitle}>1 Order</Text>
                  <Text style={styles.orderMeta}>{cart.length} item(s) · ₱{subtotal.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.noteToggle}
                  onPress={() => setIsEditingNote((prev) => !prev)}
                >
                  <Text style={styles.noteToggleText}>{isEditingNote ? 'Done' : 'Note'}</Text>
                </TouchableOpacity>
              </View>

              {isEditingNote ? (
                <View style={styles.noteEditor}>
                  <TextInput
                    style={styles.noteInput}
                    value={draftInstruction}
                    onChangeText={setDraftInstruction}
                    multiline
                    placeholder="Dine in, less sugar, etc."
                    placeholderTextColor="#9d8f7f"
                    returnKeyType="done"
                    blurOnSubmit={true}
                    onSubmitEditing={handleSaveNote}
                  />
                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
                    <Text style={styles.saveButtonText}>
                      {isSavingNote ? 'Saving...' : 'Save Note'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.notePreview}>
                  {specialInstruction || 'Long press to add a note'}
                </Text>
              )}

              {cart.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                  </View>
                  {isEditingNote ? (
                    <View style={styles.quantityRow}>
                      <TouchableOpacity
                        style={styles.qtyButton}
                        onPress={() => updateQuantity(item.id, -1)}
                      >
                        <Text style={styles.qtyButtonText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyValue}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyButton}
                        onPress={() => updateQuantity(item.id, 1)}
                      >
                        <Text style={styles.qtyButtonText}>＋</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              ))}
              {isEditingNote ? null : (
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.servedBtn} onPress={handleServed}>
                    <Text style={styles.servedBtnText}>Served</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          </View>
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
  list: { flex: 1, padding: 12 },
  orderCard: {
    backgroundColor: '#fffaf6',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#c8a47e',
    padding: 14,
  },
  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderTitle: { color: '#2c1a0e', fontSize: 18, fontWeight: '700' },
  orderMeta: { color: '#7a6a5b', fontSize: 12, marginTop: 2 },
  noteToggle: {
    backgroundColor: '#f3e3ca',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  noteToggleText: { color: '#3b1f0e', fontSize: 12, fontWeight: '700' },
  noteEditor: { marginBottom: 10 },
  noteInput: {
    minHeight: 70,
    borderWidth: 1,
    borderColor: '#e0cdb5',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlignVertical: 'top',
    color: '#2c1a0e',
  },
  saveButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#3b1f0e',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  saveButtonText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  notePreview: {
    color: '#5d4b3d',
    fontSize: 13,
    backgroundColor: '#f8efe2',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  itemRow: {
    borderTopWidth: 1,
    borderTopColor: '#efe4d8',
    paddingTop: 10,
    marginTop: 10,
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: { color: '#2c1a0e', fontSize: 15, fontWeight: '700', flex: 1 },
  itemPrice: { color: '#8b3a1a', fontSize: 13, fontWeight: '600' },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    backgroundColor: '#3b1f0e',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  qtyValue: {
    minWidth: 28,
    textAlign: 'center',
    color: '#2c1a0e',
    fontSize: 14,
    fontWeight: '700',
    marginHorizontal: 8,
  },
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: { color: '#2c1a0e', fontSize: 18, fontWeight: '600' },
  emptySubtext: { color: '#7a6a5b', fontSize: 14, textAlign: 'center', marginTop: 6 },
});