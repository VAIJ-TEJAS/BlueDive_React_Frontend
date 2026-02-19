import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useReducer,
} from "react";
import { IAuthResponse } from "../types/user.types";

// Enhanced state management types
interface AppState {
  user: IAuthResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark' | 'system';
  notifications: Notification[];
  preferences: UserPreferences;
  cart: CartItem[];
  wishlist: WishlistItem[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  autoClose?: boolean;
}

interface UserPreferences {
  language: string;
  currency: string;
  notifications: boolean;
  darkMode: boolean;
  autoSave: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  packageId: string;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  packageId: string;
  addedAt: number;
}

interface StateAction {
  type: string;
  payload?: any;
}

// State reducer for complex state management
const stateReducer = (state: AppState, action: StateAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, read: true } : n
        )
      };
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };
    
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: [...state.cart, action.payload]
      };
    
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item => 
          item.id === action.payload.id 
            ? { ...item, ...action.payload.updates }
            : item
        )
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      };
    
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      };
    
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload)
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        user: null,
        isAuthenticated: false,
        cart: [],
        wishlist: []
      };
    
    default:
      return state;
  }
};

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  theme: 'system',
  notifications: [],
  preferences: {
    language: 'en',
    currency: 'USD',
    notifications: true,
    darkMode: false,
    autoSave: true
  },
  cart: [],
  wishlist: []
};

// Create the enhanced context
const MyContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<StateAction>;
  actions: {
    signIn: (authData: IAuthResponse) => void;
    signOut: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
    clearError: () => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    markNotificationRead: (id: string) => void;
    updatePreferences: (preferences: Partial<UserPreferences>) => void;
    addToCart: (item: Omit<CartItem, 'id'>) => void;
    updateCartItem: (id: string, updates: Partial<CartItem>) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    addToWishlist: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
    removeFromWishlist: (id: string) => void;
    persistState: () => void;
    restoreState: () => void;
  };
} | undefined>(undefined);

// Enhanced provider component with advanced state management
export const MyContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const persistTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Initialize state from localStorage on mount
  useEffect(() => {
    const restoreState = () => {
      try {
        const savedState = localStorage.getItem('bluedive-state');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          dispatch({ type: 'SET_USER', payload: parsedState.user });
          dispatch({ type: 'SET_THEME', payload: parsedState.theme });
          dispatch({ type: 'UPDATE_PREFERENCES', payload: parsedState.preferences });
          dispatch({ type: 'ADD_TO_CART', payload: parsedState.cart || [] });
          dispatch({ type: 'ADD_TO_WISHLIST', payload: parsedState.wishlist || [] });
        }
      } catch (error) {
        console.error('Failed to restore state from localStorage:', error);
      }
    };

    restoreState();
  }, []);

  // Auto-save state to localStorage
  const persistState = useCallback(() => {
    const stateToPersist = {
      user: state.user,
      theme: state.theme,
      preferences: state.preferences,
      cart: state.cart,
      wishlist: state.wishlist
    };

    try {
      localStorage.setItem('bluedive-state', JSON.stringify(stateToPersist));
    } catch (error) {
      console.error('Failed to persist state to localStorage:', error);
    }
  }, [state]);

  // Debounced auto-save
  useEffect(() => {
    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current);
    }

    persistTimeoutRef.current = setTimeout(() => {
      persistState();
    }, 500); // Debounce for 500ms

    return () => {
      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current);
      }
    };
  }, [state, persistState]);

  // Enhanced authentication actions
  const signIn = useCallback((authData: IAuthResponse) => {
    dispatch({ type: 'SET_USER', payload: authData.user });
    localStorage.setItem('bluedive-token', authData.token);
    localStorage.setItem('bluedive-user-data', JSON.stringify(authData.user));
    
    // Add success notification
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Welcome back!',
        message: `Successfully signed in as ${authData.user?.username || 'User'}`,
        timestamp: Date.now(),
        read: false,
        autoClose: true
      }
    });
  }, []);

  const signOut = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('bluedive-token');
    localStorage.removeItem('bluedive-user-data');
    
    // Add notification
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'info',
        title: 'Signed out',
        message: 'You have been successfully signed out',
        timestamp: Date.now(),
        read: false,
        autoClose: true
      }
    });
  }, []);

  // Enhanced notification system
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

    // Auto-remove notification if specified
    if (notification.autoClose) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: newNotification.id });
      }, 5000); // Auto-close after 5 seconds
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }, []);

  // Enhanced cart management
  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    const cartItem: CartItem = {
      ...item,
      id: Date.now().toString()
    };

    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    
    // Add notification
    addNotification({
      type: 'success',
      title: 'Added to cart',
      message: `${item.name} has been added to your cart`,
      read: false,
      autoClose: true
    });
  }, [addNotification]);

  const updateCartItem = useCallback((id: string, updates: Partial<CartItem>) => {
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { id, updates } });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    
    // Add notification
    addNotification({
      type: 'info',
      title: 'Removed from cart',
      message: 'Item has been removed from your cart',
      read: false,
      autoClose: true
    });
  }, [addNotification]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    
    addNotification({
      type: 'info',
      title: 'Cart cleared',
      message: 'All items have been removed from your cart',
      read: false,
      autoClose: true
    });
  }, [addNotification]);

  // Enhanced wishlist management
  const addToWishlist = useCallback((item: Omit<WishlistItem, 'id' | 'addedAt'>) => {
    const wishlistItem: WishlistItem = {
      ...item,
      id: Date.now().toString(),
      addedAt: Date.now()
    };

    dispatch({ type: 'ADD_TO_WISHLIST', payload: wishlistItem });
    
    addNotification({
      type: 'success',
      title: 'Added to wishlist',
      message: `${item.name} has been added to your wishlist`,
      read: false,
      autoClose: true
    });
  }, [addNotification]);

  const removeFromWishlist = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
    
    addNotification({
      type: 'info',
      title: 'Removed from wishlist',
      message: 'Item has been removed from your wishlist',
      read: false,
      autoClose: true
    });
  }, [addNotification]);

  // Other enhanced actions
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
    
    // Add error notification
    addNotification({
      type: 'error',
      title: 'Error',
      message: error,
      read: false,
      autoClose: false
    });
  }, [addNotification]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    dispatch({ type: 'SET_THEME', payload: theme });
    localStorage.setItem('bluedive-theme', theme);
  }, []);

  const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
  }, []);

  // Legacy compatibility
  const signInUser = signIn;
  const signOutUser = signOut;
  const [userAuthenticated, setUserAuthenticated] = useState(state.isAuthenticated);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const showAuthModal = () => setAuthModalOpen(true);
  const hideAuthModal = () => setAuthModalOpen(false);

  // Enhanced context value
  const contextValue = {
    state,
    dispatch,
    actions: {
      signIn,
      signOut,
      setLoading,
      setError,
      clearError,
      setTheme,
      addNotification,
      removeNotification,
      markNotificationRead,
      updatePreferences,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      addToWishlist,
      removeFromWishlist,
      persistState,
      restoreState: () => {
        // Force refresh to restore state
        window.location.reload();
      }
    },
    // Legacy compatibility
    userAuthenticated,
    setUserAuthenticated,
    signInUser,
    signOutUser,
    showAuthModal,
    hideAuthModal,
    authModalOpen,
    setAuthModalOpen,
  };

  return (
    <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>
  );
};

// Create a custom hook to use the context
export const Context = (): any => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("Context must be used within a MyContextProvider");
  }
  return context;
};
