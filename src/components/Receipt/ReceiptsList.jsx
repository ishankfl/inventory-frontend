import React, { useState, useEffect } from 'react';
import { Eye, Edit, Plus, Search, Filter, Calendar, User, Package, DollarSign } from 'lucide-react';
import { fetchAllReceipts } from '../../api/receipt';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';

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
    const receiptsPerPage = 10;

    const navigate = useNavigate();

    useEffect(() => {
        const loadReceipts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetchAllReceipts();
                if (response.status === 200) {
                    setReceipts(response.data.data || []);
                }
            } catch (err) {
                console.error("Error fetching receipts:", err);
                setError(err.message || 'Failed to load receipts. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadReceipts();
    }, []);

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

    const indexOfLastReceipt = currentPage * receiptsPerPage;
    const indexOfFirstReceipt = indexOfLastReceipt - receiptsPerPage;
    const currentReceipts = filteredReceipts.slice(indexOfFirstReceipt, indexOfLastReceipt);
    const totalPages = Math.ceil(filteredReceipts.length / receiptsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-text font-medium">Loading receipts...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <div className="text-danger text-xl mb-2">⚠️</div>
                <div className="text-danger font-medium">Error: {error}</div>
            </div>
        </div>
    );

    const handleAddReceipt = () => {
        navigate('/receipt');
    };

    const handleEditReceipt = (id) => {
        navigate(`/receipt/edit/${id}`);
    };

    const handleViewReceipt = (id) => {
        navigate(`/receipt-details/${id}`);
    };

    const totalReceipts = receipts.length;
    const totalItemsPurchased = receipts.reduce((sum, receipt) =>
        sum + receipt.receiptDetails.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const totalValue = receipts.reduce((sum, receipt) =>
        sum + receipt.receiptDetails.reduce((itemSum, item) => itemSum + (item.quantity * item.rate), 0), 0
    );

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    {/* <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-text mb-2"></h1>
                            <p className="text-gray-600"></p>
                        </div>
                        <button
                            onClick={handleAddReceipt}
                            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-md"
                        >
                            <Plus className="h-5 w-5" />
                            <span> Receipt</span>
                        </button>
                    </div> */}
                    <div className='flex justify-between items-center'>
                        <Header description={'Manage and track all inventory receipts'} handleButton={handleAddReceipt} title={'Receipts Management'} btnTitle={' Add New'} />

                    </div>

                    {/*  Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-600 mb-1">Total Receipts</h3>
                                    <p className="text-2xl font-bold text-text">{totalReceipts}</p>
                                </div>
                                <div className="bg-card1color p-3 rounded-lg">
                                    <Package className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-600 mb-1">Total Items Purchased</h3>
                                    <p className="text-2xl font-bold text-text">{totalItemsPurchased}</p>
                                </div>
                                <div className="bg-card2color p-3 rounded-lg">
                                    <Package className="h-6 w-6 text-success" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-600 mb-1">Total Value</h3>
                                    <p className="text-2xl font-bold text-text">Rs. {totalValue.toLocaleString()}</p>
                                </div>
                                <div className="bg-card3color p-3 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-accent" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Filter Section */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center space-x-2 mb-4">
                            <Filter className="h-5 w-5 text-gray-500" />
                            <h3 className="text-lg font-semibold text-text">Filter Receipts</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Bill No"
                                    value={filterBillNo}
                                    onChange={(e) => setFilterBillNo(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Date"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Vendor"
                                    value={filterVendor}
                                    onChange={(e) => setFilterVendor(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div className="relative">
                                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Item"
                                    value={filterItem}
                                    onChange={(e) => setFilterItem(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Total Amount"
                                    value={filterTotalAmount}
                                    onChange={(e) => setFilterTotalAmount(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bill No</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vendor</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentReceipts.length > 0 ? currentReceipts.map((receipt, index) => {
                                    const totalAmount = receipt.receiptDetails.reduce(
                                        (sum, item) => sum + (item.quantity * item.rate), 0
                                    );
                                    return (
                                        <tr key={receipt.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-primary">{receipt.billNo}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">{new Date(receipt.receiptDate).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                                                        {receipt.vendor.name.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-text">{receipt.vendor.name}</div>
                                                        <div className="text-sm text-gray-500">{receipt.vendor.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    {receipt.receiptDetails.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-lg p-2">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                                                <span className="text-sm font-medium text-text">{item.item.name}</span>
                                                                <span className="text-xs text-gray-500">({item.quantity} {item.item.unit})</span>
                                                            </div>
                                                            <span className="text-sm font-semibold text-success">
                                                                Rs. {(item.quantity * item.rate).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-lg font-bold text-text">Rs. {totalAmount.toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewReceipt(receipt.id)}
                                                        className="!bg-accent !text-black !py-3 !px-4 text-primary hover:bg-card1color rounded-lg transition-colors duration-200"
                                                        title="View Receipt"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditReceipt(receipt.id)}
                                                        className="!bg-red-600 !text-white !py-3 !px-4 text-accent hover:bg-card3color rounded-lg transition-colors duration-200"
                                                        title="Edit Receipt"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="text-gray-400">
                                                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                <p className="text-lg font-medium">No receipts found</p>
                                                <p className="text-sm">Try adjusting your filters or add a new receipt</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredReceipts.length > receiptsPerPage && (
                        <div className="px-6 py-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Showing {indexOfFirstReceipt + 1} to {Math.min(indexOfLastReceipt, filteredReceipts.length)} of {filteredReceipts.length} results
                                </div>
                                <nav className="flex items-center space-x-2">
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNumber = i + 1;
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => paginate(pageNumber)}
                                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${currentPage === pageNumber
                                                        ? 'bg-primary text-white'
                                                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 !bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReceiptsList;