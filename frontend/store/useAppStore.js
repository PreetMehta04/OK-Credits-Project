import { create } from 'zustand';

const useAppStore = create((set) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  // Language
  language: 'en',
  setLanguage: (language) => set({ language }),

  // Wishlist
  wishlist: [],
  addToWishlist: (product) =>
    set((state) => ({
      wishlist: state.wishlist.find((p) => p.id === product.id)
        ? state.wishlist
        : [...state.wishlist, product],
    })),
  removeFromWishlist: (productId) =>
    set((state) => ({
      wishlist: state.wishlist.filter((p) => p.id !== productId),
    })),

  // Try-on product queue
  tryOnQueue: [],
  addToTryOnQueue: (product) =>
    set((state) => ({
      tryOnQueue: state.tryOnQueue.find((p) => p.id === product.id)
        ? state.tryOnQueue
        : [...state.tryOnQueue, product],
    })),
  clearTryOnQueue: () => set({ tryOnQueue: [] }),
}));

export default useAppStore;
