
import React from 'react';
import { Item } from '../types';
import Icon from './Icon';

interface ItemCardProps {
  item: Item;
  onAddToCart: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onEdit: (item: Item) => void;
  userRole?: 'user' | 'admin';
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onAddToCart, onDeleteItem, onEdit, userRole }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1 group flex flex-col">
      <div className="relative">
        <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
        <div className="absolute top-2 right-2 bg-gray-900/70 text-cyan-400 font-bold px-3 py-1 rounded-full flex items-center space-x-1 text-sm">
            <Icon name="robux" className="w-4 h-4" />
            <span>{item.price.toLocaleString()}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-lg font-bold text-white mb-1 truncate">{item.title}</h3>
          <p className="text-gray-400 text-sm mb-4 h-10 overflow-hidden">{item.description}</p>
        </div>
        
        {userRole === 'admin' ? (
           <div className="mt-auto flex items-center gap-2">
            <button
              onClick={() => onEdit(item)}
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              aria-label={`Edit ${item.title}`}
            >
              <Icon name="edit" className="w-5 h-5"/>
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDeleteItem(item.id)}
              className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              aria-label={`Delete ${item.title}`}
            >
              <Icon name="trash" className="w-5 h-5"/>
              <span>Delete</span>
            </button>
           </div>
        ) : (
           <button
             onClick={() => onAddToCart(item.id)}
             className="w-full mt-auto bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors duration-200 flex items-center justify-center space-x-2"
           >
             <Icon name="cart" className="w-5 h-5"/>
             <span>Add to Cart</span>
           </button>
        )}

      </div>
    </div>
  );
};

export default ItemCard;