import React from 'react';
import { DashboardData } from '../types';
import Icon from './Icon';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DashboardData | null;
}

const StatCard: React.FC<{ title: string; value: React.ReactNode; icon: 'revenue' | 'sales' | 'cart' }> = ({ title, value, icon }) => (
    <div className="bg-gray-800 p-4 rounded-lg flex items-center">
        <div className="p-3 rounded-full bg-gray-700 mr-4">
            <Icon name={icon} className="w-6 h-6 text-cyan-400"/>
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const DashboardModal: React.FC<DashboardModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col p-6 relative transform transition-all animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h2 className="text-3xl font-bold text-purple-400 flex items-center gap-3">
            <Icon name="chart-bar" className="w-8 h-8"/>
            Sales Dashboard
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <Icon name="close" className="w-8 h-8" />
          </button>
        </div>

        {!data ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-t-transparent border-purple-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto pr-3 space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Revenue" value={<><Icon name="robux" className="inline-block w-5 h-5 mr-1"/>{data.totalRevenue.toLocaleString()}</>} icon="revenue" />
                <StatCard title="Total Items Sold" value={data.totalItemsSold.toLocaleString()} icon="cart" />
                <StatCard title="Total Transactions" value={data.totalSales.toLocaleString()} icon="sales" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Best Selling Items */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-bold text-xl mb-3 text-white">Top Selling Items</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                                <tr>
                                    <th className="p-2">Rank</th>
                                    <th className="p-2">Item</th>
                                    <th className="p-2 text-right">Units Sold</th>
                                    <th className="p-2 text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.bestSellingItems.map((item, index) => (
                                    <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="p-2 font-bold">#{index + 1}</td>
                                        <td className="p-2 font-semibold">{item.title}</td>
                                        <td className="p-2 text-right">{item.unitsSold.toLocaleString()}</td>
                                        <td className="p-2 text-right text-cyan-400 font-semibold">{item.revenue.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-bold text-xl mb-3 text-white">Recent Transactions</h3>
                    <div className="space-y-3">
                        {data.recentTransactions.map(txn => (
                            <div key={txn.id} className="bg-gray-700/50 p-3 rounded-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold">{txn.username}</p>
                                        <p className="text-xs text-gray-400">{new Date(txn.date).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-400">+{txn.totalAmount.toLocaleString()}</p>
                                    </div>
                                </div>
                                <ul className="text-sm mt-1 border-t border-gray-600 pt-1">
                                    {txn.items.map(item => (
                                        <li key={item.itemId}>{item.quantity}x {item.title}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardModal;