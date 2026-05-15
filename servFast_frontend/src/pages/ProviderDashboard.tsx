import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

interface Service {
  id: string;
  name: string;
  price: string;
  status: 'active' | 'pending';
  orders: number;
}

interface Order {
  id: string;
  title: string;
  price: string;
  status: 'pending' | 'in-progress' | 'completed';
  date: string;
  client: string;
  avatar: string;
}

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Services', value: '1,284', icon: '📊' },
    { label: 'Likes', value: '42', icon: '❤️' },
    { label: 'Earnings', value: '$14,500', icon: '💰' },
    { label: 'Rating', value: '4.8', icon: '⭐' },
  ];

  const services: Service[] = [
    {
      id: '1',
      name: 'Enterprise IT Consulting',
      price: '$2450/mo',
      status: 'active',
      orders: 5,
    },
    {
      id: '2',
      name: 'Cloud Architecture Design',
      price: '$2000/mo',
      status: 'active',
      orders: 3,
    },
    {
      id: '3',
      name: 'Security Vulnerability Scan',
      price: '$800',
      status: 'active',
      orders: 2,
    },
  ];

  const orders: Order[] = [
    {
      id: '1',
      title: 'Enterprise IT Consulting',
      price: '$2,450',
      status: 'in-progress',
      date: 'Today',
      client: 'Sarah Miller',
      avatar: 'https://i.pravatar.cc/40?img=1',
    },
    {
      id: '2',
      title: 'Cloud Architecture Audit',
      price: '$1,500',
      status: 'completed',
      date: 'Yesterday',
      client: 'Alex Norton',
      avatar: 'https://i.pravatar.cc/40?img=2',
    },
    {
      id: '3',
      title: 'Security Vulnerability Scan',
      price: '$800',
      status: 'pending',
      date: '2 days ago',
      client: 'Emma Johnson',
      avatar: 'https://i.pravatar.cc/40?img=3',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'completed':
        return 'bg-blue-50 text-blue-700';
      case 'in-progress':
        return 'bg-orange-50 text-orange-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('-', ' ').toUpperCase();
  };

  return (
    <div
      style={{ minWidth: 1280, fontFamily: "'DM Sans', sans-serif" }}
      className="flex flex-col min-h-screen bg-gray-50"
    >
      <Navbar />

      {/* Header Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Welcome back, Marcus
              </h1>
              <p className="text-sm text-gray-500">
                Here's what's happening with your services today
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                Exporter
              </button>
              <button className="px-5 py-2.5 bg-red-700 text-white font-medium rounded-xl hover:bg-red-800 transition-all cursor-pointer">
                Partager
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-gray-100 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-xs text-gray-400">+8%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-8 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Services Management */}
          <div className="col-span-2">
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Services Management
                </h2>
                <a href="#" className="text-xs font-semibold text-red-700 hover:text-red-800">
                  View All →
                </a>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Service Name
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="text-center px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr
                        key={service.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">
                            {service.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">
                            {service.price}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(
                              service.status
                            )}`}
                          >
                            {getStatusLabel(service.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {service.orders}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="text-gray-400 hover:text-red-700 transition-colors cursor-pointer">
                            ⋮
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
              </div>

              <div className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={order.avatar}
                        alt={order.client}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {order.title}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {order.client}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-900">
                        {order.price}
                      </span>
                      <span
                        className={`inline-block px-2 py-1 text-[10px] font-bold rounded-md ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">{order.date}</p>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <button className="w-full text-xs font-bold text-red-700 hover:text-red-800 transition-colors cursor-pointer">
                  See More Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
