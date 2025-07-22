import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  User,
  Package,
  DollarSign
} from 'lucide-react';
import { fetchAllReceipts } from '../../api/receipt';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import ReceiptListTable from './ReceiptListTable';
import FilterInput from '../common/FilterInput';
import StatCard from '../common/StatCard';

const ReceiptsList = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterBillNo, setFilterBillNo] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [filterItem, setFilterItem] = useState('');
  const [filterTotalAmount, setFilterTotalAmount] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const receiptsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const loadReceipts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchAllReceipts(currentPage, receiptsPerPage);
        if (response.status === 200 && response.data.success) {
          setReceipts(response.data.data || []);
          setTotalPages(response.data.pagination.totalPages);
        } else {
          setError('Failed to load receipts.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load receipts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadReceipts();
  }, [currentPage]);

  const filteredReceipts = receipts.filter(receipt => {
    const totalAmount = receipt.receiptDetails.reduce(
      (sum, item) => sum + item.quantity * item.rate, 0
    );
    return (
      receipt.billNo.toLowerCase().includes(filterBillNo.toLowerCase()) &&
      (filterDate ? new Date(receipt.receiptDate).toLocaleDateString().includes(filterDate) : true) &&
      receipt.vendor.name.toLowerCase().includes(filterVendor.toLowerCase()) &&
      receipt.receiptDetails.some(item =>
        item.item.name.toLowerCase().includes(filterItem.toLowerCase())
      ) &&
      totalAmount.toLocaleString().includes(filterTotalAmount)
    );
  });

  const currentReceipts = filteredReceipts;

  const handleAddReceipt = () => navigate('/receipt');
  const handleEditReceipt = (id) => navigate(`/receipt/edit/${id}`);
  const handleViewReceipt = (id) => navigate(`/receipt-details/${id}`);

  const totalReceipts = receipts.length;
  const totalItemsPurchased = receipts.reduce((sum, receipt) =>
    sum + receipt.receiptDetails.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
  const totalValue = receipts.reduce((sum, receipt) =>
    sum + receipt.receiptDetails.reduce((itemSum, item) => itemSum + (item.quantity * item.rate), 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-text font-medium">Loading receipts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-danger text-xl mb-2">⚠️</div>
          <div className="text-danger font-medium">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Header
          description="Manage and track all inventory receipts"
          handleButton={handleAddReceipt}
          title="Receipts Management"
          btnTitle=" Add New"
        />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Receipts"
            value={totalReceipts}
            icon={<Package className="h-6 w-6 text-primary" />}
            bg="bg-card1color"
          />
          <StatCard
            title="Total Items Purchased"
            value={totalItemsPurchased}
            icon={<Package className="h-6 w-6 text-success" />}
            bg="bg-card2color"
          />
          <StatCard
            title="Total Value"
            value={`Rs. ${totalValue.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6 text-accent" />}
            bg="bg-card3color"
          />
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-text">Filter Receipts</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <FilterInput icon={Search} placeholder="Bill No" value={filterBillNo} onChange={setFilterBillNo} />
              <FilterInput icon={Calendar} placeholder="Date" value={filterDate} onChange={setFilterDate} />
              <FilterInput icon={User} placeholder="Vendor" value={filterVendor} onChange={setFilterVendor} />
              <FilterInput icon={Package} placeholder="Item" value={filterItem} onChange={setFilterItem} />
              <FilterInput icon={DollarSign} placeholder="Total Amount" value={filterTotalAmount} onChange={setFilterTotalAmount} />
            </div>
          </div>

          {/* Receipt Table */}
          <ReceiptListTable
            currentReceipts={currentReceipts}
            handleEditReceipt={handleEditReceipt}
            handleViewReceipt={handleViewReceipt}
          />

          {/* Pagination */}
          <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-100">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptsList;
