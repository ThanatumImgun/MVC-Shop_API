import { Item, ItemCategory, User } from './types';

export const INITIAL_CATEGORIES: string[] = [
  ItemCategory.ALL,
  ItemCategory.TSB,
  ItemCategory.BF,
  ItemCategory.BASZ,
];

export const REGULAR_USER: User = {
  id: 'user-123',
  username: 'PlayerOne',
  balance: 1500,
  avatarUrl: 'https://picsum.photos/seed/useravatar/100/100',
  ownedItemIds: [],
  role: 'user',
};

export const ADMIN_USER: User = {
  id: 'admin-001',
  username: 'StoreAdmin',
  balance: 99999,
  avatarUrl: 'https://picsum.photos/seed/adminavatar/100/100',
  ownedItemIds: [],
  role: 'admin',
};

export const INITIAL_USER: User = REGULAR_USER;


export const INITIAL_ITEMS: Item[] = [
  {
    id: 'tsb-001',
    title: 'Cosmic Gauntlet',
    description: 'A powerful gauntlet that channels cosmic energy.',
    price: 1200,
    imageUrl: 'https://picsum.photos/seed/tsb1/400/300',
    category: ItemCategory.TSB,
  },
  {
    id: 'tsb-002',
    title: 'Shadow Cloak',
    description: 'Become one with the shadows, moving unseen.',
    price: 850,
    imageUrl: 'https://picsum.photos/seed/tsb2/400/300',
    category: ItemCategory.TSB,
  },
  {
    id: 'tsb-003',
    title: 'Saitama Emote',
    description: 'Unleash the "OK" emote after a decisive victory.',
    price: 400,
    imageUrl: 'https://picsum.photos/seed/tsb3/400/300',
    category: ItemCategory.TSB,
  },
  {
    id: 'bf-001',
    title: 'Infinity Edge Blade',
    description: 'A legendary blade that grows sharper with every deflection.',
    price: 1500,
    imageUrl: 'https://picsum.photos/seed/bf1/400/300',
    category: ItemCategory.BF,
  },
  {
    id: 'bf-002',
    title: 'Phantom Dodge',
    description: 'A special ability to phase through incoming projectiles.',
    price: 950,
    imageUrl: 'https://picsum.photos/seed/bf2/400/300',
    category: ItemCategory.BF,
  },
  {
    id: 'bf-003',
    title: 'Chrono Ball Skin',
    description: 'Make the ball look like a swirling vortex of time.',
    price: 500,
    imageUrl: 'https://picsum.photos/seed/bf3/400/300',
    category: ItemCategory.BF,
  },
  {
    id: 'basz-001',
    title: 'Gravity Spell',
    description: 'Manipulate the forces of gravity to crush your foes.',
    price: 1100,
    imageUrl: 'https://picsum.photos/seed/basz1/400/300',
    category: ItemCategory.BASZ,
  },
  {
    id: 'basz-002',
    title: 'Fire Infusion',
    description: 'Permanently infuse any weapon with the power of fire.',
    price: 750,
    imageUrl: 'https://picsum.photos/seed/basz2/400/300',
    category: ItemCategory.BASZ,
  },
  {
    id: 'basz-003',
    title: 'Gladiator Armor Set',
    description: 'Sturdy and stylish armor fit for a champion of the arena.',
    price: 1300,
    imageUrl: 'https://picsum.photos/seed/basz3/400/300',
    category: ItemCategory.BASZ,
  },
    {
    id: 'tsb-004',
    title: 'Limitless Energy',
    description: 'A permanent boost to your energy regeneration.',
    price: 2000,
    imageUrl: 'https://picsum.photos/seed/tsb4/400/300',
    category: ItemCategory.TSB,
  },
  {
    id: 'bf-004',
    title: 'Cybernetic Trail',
    description: 'Leave a stunning digital trail as you move.',
    price: 350,
    imageUrl: 'https://picsum.photos/seed/bf4/400/300',
    category: ItemCategory.BF,
  },
  {
    id: 'basz-004',
    title: 'Dagger of Swiftness',
    description: 'A lightweight dagger that allows for incredibly fast strikes.',
    price: 600,
    imageUrl: 'https://picsum.photos/seed/basz4/400/300',
    category: ItemCategory.BASZ,
  },
];
