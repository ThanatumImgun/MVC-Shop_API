import React, { useState, useEffect } from 'react';
import { Item } from '../types';
import Icon from './Icon';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (itemData: Omit<Item, 'id'>) => void;
  onEditItem: (itemId: string, itemData: Omit<Item, 'id'>) => void;
  onAddCategory: (categoryName: string) => void;
  onViewDashboard: () => void;
  categories: string[];
  isProcessing: boolean;
  editingItem: Item | null;
}

type AdminTab = 'item' | 'category';

const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose, onAddItem, onEditItem, onAddCategory, onViewDashboard, categories, isProcessing, editingItem }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('item');
  const isEditMode = !!editingItem;

  // Form state for adding/editing an item
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  
  // Form state for adding a category
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    // If the modal is open, sync form with editingItem
    if (isOpen) {
      if (isEditMode && editingItem) {
        setTitle(editingItem.title);
        setDescription(editingItem.description);
        setPrice(editingItem.price.toString());
        setImageUrl(editingItem.imageUrl);
        setCategory(editingItem.category);
        setActiveTab('item'); // Ensure item tab is active in edit mode
      } else {
        // Reset form for "add" mode
        setTitle('');
        setDescription('');
        setPrice('');
        setImageUrl('');
        setCategory(categories[0] || '');
      }
    }
  }, [editingItem, isOpen, categories, isEditMode]);

  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNumber = parseInt(price, 10);
    if (title && description && !isNaN(priceNumber) && priceNumber >= 0 && imageUrl && category) {
      const itemData = { title, description, price: priceNumber, imageUrl, category };
      if (isEditMode && editingItem) {
        onEditItem(editingItem.id, itemData);
      } else {
        onAddItem(itemData);
      }
    } else {
      // Basic validation feedback can be improved with a toast in App.tsx
      console.error('Validation failed. Please fill all fields correctly.');
    }
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  if (!isOpen) return null;

  const commonInputClass = "w-full bg-gray-900 text-white placeholder-gray-500 border-2 border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500";
  const commonButtonClass = "w-full bg-cyan-500 text-white font-bold py-3 rounded-lg hover:bg-cyan-600 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center text-lg";

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6 relative transform transition-all animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <Icon name="close" className="w-7 h-7" />
        </button>
        <h2 className="text-3xl font-bold text-center mb-4">
          {isEditMode ? 'Edit Item' : 'Admin Panel'}
        </h2>

        {!isEditMode && (
          <div className="border-b border-gray-700 mb-6 text-center">
             <button
              onClick={onViewDashboard}
              disabled={isProcessing}
              className="w-full mb-4 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:bg-gray-600"
            >
              <Icon name="chart-bar" className="w-5 h-5"/>
              <span>View Sales Report</span>
            </button>
            <div className="flex">
                <button onClick={() => setActiveTab('item')} className={`flex-1 py-2 font-semibold ${activeTab === 'item' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}>Add Item</button>
                <button onClick={() => setActiveTab('category')} className={`flex-1 py-2 font-semibold ${activeTab === 'category' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}>Add Category</button>
            </div>
          </div>
        )}

        {(activeTab === 'item' || isEditMode) ? (
          <form onSubmit={handleItemSubmit} className="space-y-4">
            <input type="text" placeholder="Item Title" value={title} onChange={e => setTitle(e.target.value)} className={commonInputClass} required />
            <input type="text" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className={commonInputClass} required />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className={`${commonInputClass} h-24 resize-y`} required />
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className={commonInputClass} required min="0" />
              <select value={category} onChange={e => setCategory(e.target.value)} className={commonInputClass} required>
                <option value="" disabled>Select Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <button type="submit" disabled={isProcessing} className={commonButtonClass}>
              {isProcessing ? <div className="w-7 h-7 border-4 border-t-transparent border-white rounded-full animate-spin"></div> : (isEditMode ? 'Update Item' : 'Add Item to Store')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAddCategorySubmit} className="space-y-4">
            <p className="text-center text-gray-400">Enter the name for the new game or category.</p>
            <input type="text" placeholder="New Category Name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className={commonInputClass} required />
            <button type="submit" disabled={isProcessing} className={commonButtonClass}>
               {isProcessing ? <div className="w-7 h-7 border-4 border-t-transparent border-white rounded-full animate-spin"></div> : 'Add Category'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminPanelModal;