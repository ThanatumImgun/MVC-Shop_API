import React from 'react';
import { Item } from '../types';
import Icon from './Icon';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
}

const InventoryItemCard: React.FC<{ item: Item }> = ({ item }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg group">
    <div className="relative">
      <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
      <div className="absolute inset-0 bg-black/20"></div>
    </div>
    <div className="p-3">
      <h3 className="text-md font-bold text-white truncate">{item.title}</h3>
      <p className="text-sm text-gray-400">{item.category}</p>
    </div>
  </div>
);


const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, items }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
       <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-4xl h-[80vh] flex flex-col p-6 relative transform transition-all animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h2 className="text-3xl font-bold text-purple-400">My Inventory</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <Icon name="close" className="w-8 h-8" />
            </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
            <Icon name="wallet" className="w-24 h-24 mb-4 text-purple-500"/>
            <p className="text-xl">Your inventory is empty.</p>
            <p>Purchase items from the store to see them here.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto pr-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map(item => (
                <InventoryItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryModal;