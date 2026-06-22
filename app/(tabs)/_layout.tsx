import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { Tabs } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  image?: string;
  ingredients?: string[];
};

type CartItem = MenuItem & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, delta: number) => void;
  cartCount: number;
  specialInstruction: string;
  setSpecialInstruction: (value: string) => void;
  saveSpecialInstruction: (value: string) => Promise<void>;
  favorites: string[];
  toggleFavorite: (id: string) => void;
};

const CART_STORAGE_KEY = 'kantocorner_cart';
const SPECIAL_INSTRUCTION_STORAGE_KEY = 'kantocorner_special_instruction';
const FAVORITES_STORAGE_KEY = 'kantocorner_favorites';

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  updateQuantity: () => {},
  cartCount: 0,
  specialInstruction: '',
  setSpecialInstruction: () => {},
  saveSpecialInstruction: async () => {},
  favorites: [],
  toggleFavorite: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [specialInstruction, setSpecialInstruction] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadCart = async () => {
      try {
        const savedCart = await SecureStore.getItemAsync(CART_STORAGE_KEY);
        if (savedCart && mounted) {
          setCart(JSON.parse(savedCart) as CartItem[]);
        }

        const savedInstruction = await SecureStore.getItemAsync(
          SPECIAL_INSTRUCTION_STORAGE_KEY
        );
        if (savedInstruction !== null && mounted) {
          setSpecialInstruction(savedInstruction);
        }

        const savedFavorites = await SecureStore.getItemAsync(FAVORITES_STORAGE_KEY);
        if (savedFavorites && mounted) {
          setFavorites(JSON.parse(savedFavorites) as string[]);
        }
      } catch (error) {
        console.warn('Failed to load cart, instruction, or favorites from storage', error);
      }
    };

    loadCart();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    SecureStore.setItemAsync(CART_STORAGE_KEY, JSON.stringify(cart)).catch((error) => {
      console.warn('Failed to save cart', error);
    });
  }, [cart]);

  useEffect(() => {
    SecureStore.setItemAsync(FAVORITES_STORAGE_KEY, JSON.stringify(favorites)).catch(
      (error) => {
        console.warn('Failed to save favorites', error);
      }
    );
  }, [favorites]);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id !== id) return item;
          const nextQuantity = item.quantity + delta;
          return nextQuantity > 0 ? { ...item, quantity: nextQuantity } : null;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const saveSpecialInstruction = async (value: string) => {
    const nextValue = value.trim();
    setSpecialInstruction(nextValue);
    await SecureStore.setItemAsync(SPECIAL_INSTRUCTION_STORAGE_KEY, nextValue);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        cartCount,
        specialInstruction,
        setSpecialInstruction,
        saveSpecialInstruction,
        favorites,
        toggleFavorite,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#f45b90',
        tabBarInactiveTintColor: '#f7b3cc',
        tabBarStyle: {
          backgroundColor: '#fff7fb',
          borderTopColor: '#fbe3ec',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, size }) => <Ionicons name="cafe" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => <Ionicons name="receipt-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}