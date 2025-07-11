import React from 'react';
import { User } from '../types';
import Icon from './Icon';

interface HeaderProps {
  user: User | null;
  cartItemCount: number;
  onCartClick: () => void;
  onTopUpClick: () => void;
  onInventoryClick: () => void;
  onAdminClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, cartItemCount, onCartClick, onTopUpClick, onInventoryClick, onAdminClick }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400 tracking-wider uppercase">Robux Store</h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user && (
              <div className="hidden sm:flex items-center space-x-3 bg-gray-900/50 p-2 rounded-full">
                <img src={user.avatarUrl} alt={user.username} className="w-10 h-10 rounded-full border-2 border-cyan-500" />
                <div className="text-right">
                  <p className="font-semibold text-sm">{user.username}</p>
                  <div className="flex items-center justify-end space-x-1 text-cyan-400">
                    <Icon name="robux" className="w-4 h-4"/>
                    <p className="font-bold text-sm">{user.balance.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
            
            {user?.role === 'user' && (
              <>
                <button
                  onClick={onInventoryClick}
                  className="hidden sm:block bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
                >
                  Inventory
                </button>
                <button
                  onClick={onTopUpClick}
                  className="hidden sm:block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
                >
                  Top Up
                </button>
              </>
            )}

            {user?.role === 'admin' && (
              <button
                onClick={onAdminClick}
                className="hidden sm:block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
              >
                Admin Panel
              </button>
            )}

            <button
              onClick={onCartClick}
              className="relative bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-full transition-colors duration-200"
              aria-label={`Open cart with ${cartItemCount} items`}
            >
              <Icon name="cart" className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
