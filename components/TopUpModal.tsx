
import React, { useState } from 'react';
import Icon from './Icon';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopUp: (amount: number) => void;
  isProcessing: boolean;
}

const TOP_UP_AMOUNTS = [500, 1000, 2500, 5000];

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, onTopUp, isProcessing }) => {
  const [amount, setAmount] = useState<string>('');

  if (!isOpen) return null;

  const handleTopUp = () => {
    const numericAmount = parseInt(amount, 10);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      onTopUp(numericAmount);
    }
  };

  const handlePresetClick = (presetAmount: number) => {
    setAmount(presetAmount.toString());
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8 relative transform transition-all animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <Icon name="close" className="w-7 h-7" />
        </button>
        <h2 className="text-3xl font-bold text-center mb-2">Top Up Wallet</h2>
        <p className="text-gray-400 text-center mb-6">Add funds to your account instantly.</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {TOP_UP_AMOUNTS.map(preset => (
                <button
                    key={preset}
                    onClick={() => handlePresetClick(preset)}
                    className={`p-3 rounded-lg font-bold flex flex-col items-center justify-center transition-all border-2 ${amount === preset.toString() ? 'bg-cyan-500 border-cyan-400 text-white' : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500'}`}
                >
                    <Icon name="robux" className="w-6 h-6 mb-1"/>
                    <span>{preset.toLocaleString()}</span>
                </button>
            ))}
        </div>
        
        <div className="relative mb-6">
          <Icon name="robux" className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-cyan-400 pointer-events-none"/>
          <input
            type="number"
            placeholder="Or enter custom amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-900 text-white placeholder-gray-500 border-2 border-gray-700 rounded-lg py-3 pl-12 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <button
          onClick={handleTopUp}
          disabled={isProcessing || !amount || parseInt(amount, 10) <= 0}
          className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center text-lg"
        >
          {isProcessing ? (
            <div className="w-7 h-7 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : `Top Up ${amount ? parseInt(amount, 10).toLocaleString() : ''}`}
        </button>
      </div>
    </div>
  );
};

export default TopUpModal;
