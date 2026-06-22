import {
  Keyboard,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

const PROFILE_NAME_KEY = 'kantocorner_profile_name';

export default function ProfileScreen() {
  const [profileName, setProfileName] = useState('');
  const [draftName, setDraftName] = useState('');

  useEffect(() => {
    const loadProfileName = async () => {
      const savedName = await SecureStore.getItemAsync(PROFILE_NAME_KEY);
      if (savedName !== null) {
        setProfileName(savedName);
        setDraftName(savedName);
      }
    };

    loadProfileName();
  }, []);

  const saveProfileName = async () => {
    Keyboard.dismiss();
    const nextName = draftName.trim();
    await SecureStore.setItemAsync(PROFILE_NAME_KEY, nextName);
    setProfileName(nextName);
  };

  const initials = profileName.trim().charAt(0).toUpperCase() || 'U';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>
              {profileName ? `Hello, ${profileName}!` : 'Hello there!'}
            </Text>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={styles.label}>Your name</Text>
            <TextInput
              style={styles.input}
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Enter your name"
              placeholderTextColor="#9d8f7f"
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={saveProfileName}
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveProfileName}>
              <Text style={styles.saveButtonText}>Save Name</Text>
            </TouchableOpacity>
            <Text style={styles.savedText}>
              {profileName ? `Saved as: ${profileName}` : 'No name saved yet.'}
            </Text>
          </View>
        </View>
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: { color: '#fff', fontSize: 18, fontWeight: 'bold', flex: 1 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffe7ef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#f45b90', fontSize: 16, fontWeight: '700' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: {
    width: '100%',
    backgroundColor: '#fff7fb',
    borderRadius: 8,
    padding: 16,
  },
  label: { color: '#8d5d74', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#f7b3cc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: '#2c1a0e',
  },
  saveButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#f45b90',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
  },
  saveButtonText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  savedText: { color: '#8d5d74', fontSize: 13, marginTop: 10 },
});