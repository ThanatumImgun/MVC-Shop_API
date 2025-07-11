import React from 'react';
import { ItemCategory } from '../types';
import Icon from './Icon';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeCategory: ItemCategory | string;
  onCategoryChange: (category: ItemCategory | string) => void;
  categories: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, activeCategory, onCategoryChange, categories }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sticky top-20 z-30 bg-gray-900">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="search" className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2 bg-gray-800 p-1 rounded-full border border-gray-700 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 flex-shrink-0 ${
                activeCategory === category
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'bg-transparent text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;