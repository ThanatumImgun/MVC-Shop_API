
import React from 'react';
import { CartItem } from '../types';
import Icon from './Icon';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  isProcessing: boolean;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout, isProcessing }) => {
  const subtotal = cartItems.reduce((acc, cartItem) => acc + cartItem.item.price * cartItem.quantity, 0);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold">Shopping Cart</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <Icon name="close" className="w-7 h-7" />
            </button>
          </div>
          
          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
              <Icon name="cart" className="w-24 h-24 mb-4"/>
              <p className="text-xl">Your cart is empty.</p>
              <p>Add some items to get started!</p>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cartItems.map(({ item, quantity }) => (
                <div key={item.id} className="flex items-center space-x-4 bg-gray-800 p-3 rounded-lg">
                  <img src={item.imageUrl} alt={item.title} className="w-20 h-20 rounded-md object-cover" />
                  <div className="flex-grow">
                    <p className="font-semibold text-white">{item.title}</p>
                    <div className="flex items-center space-x-1 text-sm text-cyan-400">
                       <Icon name="robux" className="w-4 h-4"/>
                       <p>{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => onUpdateQuantity(item.id, quantity - 1)} className="p-1 bg-gray-700 rounded-full hover:bg-gray-600"><Icon name="minus" className="w-4 h-4"/></button>
                    <span className="w-8 text-center font-bold">{quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, quantity + 1)} className="p-1 bg-gray-700 rounded-full hover:bg-gray-600"><Icon name="plus" className="w-4 h-4"/></button>
                  </div>
                  <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-400"><Icon name="trash" className="w-5 h-5"/></button>
                </div>
              ))}
            </div>
          )}

          <div className="p-6 border-t border-gray-700 bg-gray-900">
            <div className="flex justify-between items-center text-lg mb-4">
              <span className="font-semibold">Subtotal:</span>
              <div className="flex items-center space-x-2 font-bold text-cyan-400">
                 <Icon name="robux" className="w-5 h-5"/>
                 <span>{subtotal.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={onCheckout}
              disabled={cartItems.length === 0 || isProcessing}
              className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isProcessing ? (
                <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : 'Checkout'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
