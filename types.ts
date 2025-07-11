export enum ItemCategory {
  ALL = 'All',
  TSB = 'TSB', // The Strongest Battlegrounds
  BF = 'BF',   // Blade Ball
  BASZ = 'BASZ'// Blade & Sorcery: Nomad
}

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: ItemCategory | string;
}

export interface User {
  id: string;
  username: string;
  balance: number;
  avatarUrl: string;
  ownedItemIds: string[];
  role: 'user' | 'admin';
}

export interface CartItem {
  item: Item;
  quantity: number;
}

export interface Transaction {
  id: string;
  date: Date;
  userId: string;
  username: string;
  items: {
    itemId: string;
    title: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
}

export interface BestSellingItem {
  id: string;
  title: string;
  unitsSold: number;
  revenue: number;
}

export interface DashboardData {
  totalRevenue: number;
  totalItemsSold: number;
  totalSales: number;
  bestSellingItems: BestSellingItem[];
  recentTransactions: Transaction[];
}