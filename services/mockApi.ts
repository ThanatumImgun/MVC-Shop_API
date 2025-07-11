import { Item, User, CartItem, ItemCategory, Transaction, DashboardData } from '../types';
import { INITIAL_ITEMS, REGULAR_USER, ADMIN_USER, INITIAL_CATEGORIES } from '../constants';

// Simulate a database
let items: Item[] = [...INITIAL_ITEMS];
let user: User = { ...REGULAR_USER };
let cart: CartItem[] = [];
let categories: string[] = [...INITIAL_CATEGORIES];
let transactions: Transaction[] = [
    // Pre-populate with some historical data for the dashboard
    {
        id: 'txn-1',
        date: new Date(Date.now() - 86400000 * 2), // 2 days ago
        userId: 'user-hist-1',
        username: 'OldPlayer',
        items: [
            { itemId: 'bf-001', title: 'Infinity Edge Blade', quantity: 1, price: 1500 },
            { itemId: 'basz-002', title: 'Fire Infusion', quantity: 1, price: 750 }
        ],
        totalAmount: 2250,
    },
    {
        id: 'txn-2',
        date: new Date(Date.now() - 86400000), // 1 day ago
        userId: 'user-hist-2',
        username: 'NewbieGamer',
        items: [
            { itemId: 'tsb-003', title: 'Saitama Emote', quantity: 2, price: 400 }
        ],
        totalAmount: 800,
    },
     {
        id: 'txn-3',
        date: new Date(Date.now() - 3600000 * 5), // 5 hours ago
        userId: 'user-hist-1',
        username: 'OldPlayer',
        items: [
            { itemId: 'bf-001', title: 'Infinity Edge Blade', quantity: 1, price: 1500 },
        ],
        totalAmount: 1500,
    }
];


const simulateDelay = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, 300 + Math.random() * 400);
  });
};

const simulateError = (message: string): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message));
    }, 300 + Math.random() * 400);
  });
};

export const api = {
  // Return copies to prevent direct state mutation from outside
  getItems: (): Promise<Item[]> => simulateDelay([...items]),
  
  getUser: (): Promise<User> => simulateDelay({ ...user }),

  getCart: (): Promise<CartItem[]> => simulateDelay([...cart]),

  getCategories: (): Promise<string[]> => simulateDelay([...categories]),

  // New function to simulate user switching
  switchUser: (role: 'admin' | 'user'): Promise<User> => {
    const currentOwnedItems = user.ownedItemIds; // Preserve inventory across switches for demo
    if (role === 'admin') {
      user = { ...ADMIN_USER, ownedItemIds: currentOwnedItems };
    } else {
      user = { ...REGULAR_USER, ownedItemIds: currentOwnedItems };
    }
    cart = []; // Clear cart on user switch
    return simulateDelay({ ...user });
  },

  addToCart: (itemId: string): Promise<CartItem[]> => {
    if (user.ownedItemIds.includes(itemId)) {
      return simulateError('You already own this item.');
    }
    const itemToAdd = items.find(item => item.id === itemId);
    if (!itemToAdd) {
      return Promise.reject(new Error('Item not found.'));
    }
    
    const existingCartItem = cart.find(ci => ci.item.id === itemId);
    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      cart.push({ item: itemToAdd, quantity: 1 });
    }
    return simulateDelay([...cart]);
  },

  updateCartItemQuantity: (itemId: string, quantity: number): Promise<CartItem[]> => {
    const cartItem = cart.find(ci => ci.item.id === itemId);
    if (!cartItem) {
      return Promise.reject(new Error('Item not in cart.'));
    }
    if (quantity <= 0) {
      cart = cart.filter(ci => ci.item.id !== itemId);
    } else {
      cartItem.quantity = quantity;
    }
    return simulateDelay([...cart]);
  },

  removeFromCart: (itemId: string): Promise<CartItem[]> => {
    cart = cart.filter(ci => ci.item.id !== itemId);
    return simulateDelay([...cart]);
  },

  checkout: (): Promise<{user: User, cart: CartItem[]}> => {
    const totalCost = cart.reduce((total, ci) => total + ci.item.price * ci.quantity, 0);
    if (user.balance < totalCost) {
      return Promise.reject(new Error('Insufficient balance. Please top up your wallet.'));
    }

    if (Math.random() < 0.1) {
        return simulateError('A wild network error appeared! Please try again.');
    }
    
    // Create a transaction record
    const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        date: new Date(),
        userId: user.id,
        username: user.username,
        items: cart.map(ci => ({
            itemId: ci.item.id,
            title: ci.item.title,
            quantity: ci.quantity,
            price: ci.item.price
        })),
        totalAmount: totalCost,
    };
    transactions.unshift(newTransaction);

    const purchasedItemIds = cart.map(ci => ci.item.id);
    user.balance -= totalCost;
    user.ownedItemIds = [...new Set([...user.ownedItemIds, ...purchasedItemIds])];
    cart = [];
    return simulateDelay({ user: { ...user }, cart: [...cart] });
  },

  topUpWallet: (amount: number): Promise<User> => {
    if (user.role === 'admin') {
        return simulateError("Admins don't need to top up.");
    }
    if (amount <= 0) {
      return Promise.reject(new Error('Top-up amount must be positive.'));
    }
    user.balance += amount;
    return simulateDelay({ ...user });
  },

  // Admin functions
  addItem: (itemData: Omit<Item, 'id'>): Promise<Item> => {
      const newItem: Item = {
          id: `${itemData.category.toLowerCase().replace(/\s/g, '')}-${Date.now()}`,
          ...itemData
      };
      items.unshift(newItem); // Add to the beginning of the list
      return simulateDelay({...newItem});
  },

  editItem: (itemId: string, itemData: Omit<Item, 'id'>): Promise<Item> => {
      const itemIndex = items.findIndex(item => item.id === itemId);
      if (itemIndex > -1) {
          const updatedItem = { ...items[itemIndex], ...itemData };
          items[itemIndex] = updatedItem;
          // Also update cart if the item is there
          cart.forEach(ci => {
              if (ci.item.id === itemId) {
                  ci.item = { ...updatedItem };
              }
          });
          return simulateDelay({ ...updatedItem });
      } else {
          return simulateError('Item not found for editing.');
      }
  },

  deleteItem: (itemId: string): Promise<string> => {
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        items.splice(itemIndex, 1);
        return simulateDelay(itemId);
    } else {
        return simulateError('Item not found for deletion.');
    }
  },

  addCategory: (categoryName: string): Promise<string[]> => {
      const formattedName = categoryName.trim();
      if (!formattedName) {
          return simulateError("Category name cannot be empty.");
      }
      if (categories.map(c => c.toLowerCase()).includes(formattedName.toLowerCase())) {
          return simulateError(`Category "${formattedName}" already exists.`);
      }
      categories.splice(1, 0, formattedName); // Add after "All"
      return simulateDelay([...categories]);
  },
  
  getSalesDashboardData: (): Promise<DashboardData> => {
    const totalRevenue = transactions.reduce((sum, txn) => sum + txn.totalAmount, 0);
    const totalSales = transactions.length;
    const totalItemsSold = transactions.reduce((sum, txn) => sum + txn.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

    const itemSales = new Map<string, { title: string; unitsSold: number; revenue: number }>();
    transactions.forEach(txn => {
      txn.items.forEach(item => {
        const existing = itemSales.get(item.itemId) || { title: item.title, unitsSold: 0, revenue: 0 };
        existing.unitsSold += item.quantity;
        existing.revenue += item.price * item.quantity;
        itemSales.set(item.itemId, existing);
      });
    });

    const bestSellingItems = Array.from(itemSales.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 10); // Top 10 best sellers

    const recentTransactions = transactions.slice(0, 10); // Top 10 recent

    return simulateDelay({
      totalRevenue,
      totalItemsSold,
      totalSales,
      bestSellingItems,
      recentTransactions,
    });
  },
};