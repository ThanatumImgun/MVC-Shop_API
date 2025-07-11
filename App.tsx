import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Item, CartItem, ItemCategory, DashboardData } from './types';
import { api } from './services/mockApi';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ItemCard from './components/ItemCard';
import CartSidebar from './components/CartSidebar';
import TopUpModal from './components/TopUpModal';
import InventoryModal from './components/InventoryModal';
import AdminPanelModal from './components/AdminPanelModal';
import DashboardModal from './components/DashboardModal';


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<ItemCategory | string>(ItemCategory.ALL);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Load initial data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        const [userData, itemsData, cartData, categoriesData] = await Promise.all([
          api.getUser(),
          api.getItems(),
          api.getCart(),
          api.getCategories(),
        ]);
        setUser(userData);
        setItems(itemsData);
        setCart(cartData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load app data.');
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);
  
  const showToast = useCallback((message: string, duration = 3000) => {
      setToastMessage(message);
      setTimeout(() => {
          setToastMessage(null);
      }, duration);
  }, []);

  const handleAddToCart = useCallback(async (itemId: string) => {
    if (user?.role === 'admin') {
      showToast("Admins can't add items to the cart.");
      return;
    }
    try {
      const updatedCart = await api.addToCart(itemId);
      setCart(updatedCart);
      showToast('Item added to cart!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      showToast(errorMessage);
    }
  }, [user?.role, showToast]);

  const handleUpdateQuantity = useCallback(async (itemId: string, quantity: number) => {
    try {
      const updatedCart = await api.updateCartItemQuantity(itemId, quantity);
      setCart(updatedCart);
    } catch (err) {
       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
       showToast(errorMessage);
    }
  }, [showToast]);

  const handleCheckout = useCallback(async () => {
    try {
      setIsProcessing(true);
      setError(null);
      const { user: updatedUser, cart: updatedCart } = await api.checkout();
      setUser(updatedUser);
      setCart(updatedCart);
      setIsCartOpen(false);
      showToast('Purchase successful! Items moved to inventory.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Checkout failed.';
      showToast(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [showToast]);

  const handleTopUp = useCallback(async (amount: number) => {
    try {
      setIsProcessing(true);
      setError(null);
      const updatedUser = await api.topUpWallet(amount);
      setUser(updatedUser);
      setIsTopUpModalOpen(false);
      showToast(`Successfully added ${amount.toLocaleString()} to your wallet!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Top-up failed.';
      showToast(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [showToast]);
  
  const handleOpenAdminModal = useCallback((itemToEdit: Item | null = null) => {
      setEditingItem(itemToEdit);
      setIsAdminOpen(true);
  }, []);

  const handleCloseAdminModal = useCallback(() => {
      setIsAdminOpen(false);
      setEditingItem(null);
  }, []);

  const handleAddItem = useCallback(async (itemData: Omit<Item, 'id'>) => {
    try {
        setIsProcessing(true);
        const newItem = await api.addItem(itemData);
        setItems(prevItems => [newItem, ...prevItems]);
        showToast(`Item "${newItem.title}" added successfully!`);
        handleCloseAdminModal();
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to add item.';
        showToast(errorMessage);
    } finally {
        setIsProcessing(false);
    }
  }, [showToast, handleCloseAdminModal]);

  const handleEditItem = useCallback(async (itemId: string, itemData: Omit<Item, 'id'>) => {
    try {
      setIsProcessing(true);
      const updatedItem = await api.editItem(itemId, itemData);
      setItems(prevItems => prevItems.map(item => item.id === itemId ? updatedItem : item));
      setCart(prevCart => prevCart.map(ci => ci.item.id === itemId ? { ...ci, item: updatedItem } : ci));
      showToast(`Item "${updatedItem.title}" updated!`);
      handleCloseAdminModal();
    } catch(err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item.';
      showToast(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [showToast, handleCloseAdminModal]);

  const handleDeleteItem = useCallback(async (itemId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      try {
        const deletedItemId = await api.deleteItem(itemId);
        setItems(prevItems => prevItems.filter(item => item.id !== deletedItemId));
        showToast('Item deleted successfully.');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete item.';
        showToast(errorMessage);
      }
    }
  }, [showToast]);

  const handleAddCategory = useCallback(async (categoryName: string) => {
      try {
          setIsProcessing(true);
          const updatedCategories = await api.addCategory(categoryName);
          setCategories(updatedCategories);
          showToast(`Category "${categoryName}" added successfully!`);
      } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to add category.';
          showToast(errorMessage);
      } finally {
          setIsProcessing(false);
      }
  }, [showToast]);

  const handleRoleSwitch = useCallback(async () => {
      if (!user) return;
      const targetRole = user.role === 'user' ? 'admin' : 'user';
      try {
          setIsProcessing(true);
          const switchedUser = await api.switchUser(targetRole);
          setUser(switchedUser);
          setCart([]); // Cart is cleared on switch
          showToast(`Switched to ${targetRole} view.`);
      } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to switch role.';
          showToast(errorMessage);
      } finally {
          setIsProcessing(false);
      }
  }, [user, showToast]);

  const handleOpenDashboard = useCallback(async () => {
    try {
        setIsProcessing(true);
        const data = await api.getSalesDashboardData();
        setDashboardData(data);
        setIsDashboardOpen(true);
        setIsAdminOpen(false); // Close the admin panel
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data.';
        showToast(errorMessage);
    } finally {
        setIsProcessing(false);
    }
  }, [showToast]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = activeCategory === ItemCategory.ALL || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchTerm]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const ownedItems = useMemo(() => {
      if (!user) return [];
      // Make sure items exist in the main list before showing them as owned
      const currentItemIds = new Set(items.map(i => i.id));
      const ownedIds = user.ownedItemIds.filter(id => currentItemIds.has(id));
      return items.filter(item => ownedIds.includes(item.id));
  }, [items, user]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-8 border-t-cyan-500 border-gray-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-xl text-gray-300">Loading Store...</p>
        </div>
      </div>
    );
  }

  if (error && !toastMessage) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-500 mb-4">An Error Occurred</h2>
          <p className="text-gray-300">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-6 bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-cyan-600">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header 
        user={user} 
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)} 
        onTopUpClick={() => setIsTopUpModalOpen(true)}
        onInventoryClick={() => setIsInventoryOpen(true)}
        onAdminClick={() => handleOpenAdminModal()}
      />
      <main>
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          categories={categories}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  onAddToCart={handleAddToCart}
                  onDeleteItem={handleDeleteItem}
                  onEdit={handleOpenAdminModal}
                  userRole={user?.role}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-gray-400">No items found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </main>
      
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={(id) => handleUpdateQuantity(id, 0)}
        onCheckout={handleCheckout}
        isProcessing={isProcessing}
      />

      <TopUpModal 
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        onTopUp={handleTopUp}
        isProcessing={isProcessing}
      />

      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        items={ownedItems}
      />

      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={handleCloseAdminModal}
        onAddItem={handleAddItem}
        onEditItem={handleEditItem}
        onAddCategory={handleAddCategory}
        onViewDashboard={handleOpenDashboard}
        categories={categories.filter(c => c !== ItemCategory.ALL)}
        isProcessing={isProcessing}
        editingItem={editingItem}
      />
      
      <DashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        data={dashboardData}
      />

      {user && (
         <div className="fixed bottom-5 left-5 bg-gray-800 border border-gray-700 p-2 rounded-lg shadow-lg z-[100] text-sm flex items-center space-x-3">
            <div>
                <span className="text-gray-400">View Mode: </span>
                <strong className={`font-bold ${user.role === 'admin' ? 'text-red-400' : 'text-cyan-400'}`}>{user.role.toUpperCase()}</strong>
            </div>
            <button 
                onClick={handleRoleSwitch} 
                disabled={isProcessing}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-wait"
            >
                {isProcessing ? 'Switching...' : `Switch to ${user.role === 'user' ? 'Admin' : 'User'}`}
            </button>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-gray-800 border-l-4 border-cyan-500 text-white py-3 px-5 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-5 z-[100]">
            <p>{toastMessage}</p>
        </div>
      )}
    </div>
  );
};

export default App;