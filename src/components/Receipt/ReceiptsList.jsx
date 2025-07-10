import React, { useState, useEffect } from 'react';
import { fetchAllReceipts } from '../../api/receipt';
import { Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
                const response = await fetchAllReceipts();
                if (response.status === 200) {
                    setTimeout(() => {
                        setReceipts(response.data.data || []);
                        setLoading(false);
                    }, 1000);
                }
            } catch (err) {
                setError(err.message || 'Failed to load receipts');
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
            new Date(receipt.receiptDate).toLocaleDateString().includes(filterDate) &&
            receipt.vendor.name.toLowerCase().includes(filterVendor.toLowerCase()) &&
            receipt.receiptDetails.some(item =>
                item.item.name.toLowerCase().includes(filterItem.toLowerCase())
            ) &&
            totalAmount.toString().includes(filterTotalAmount)
        );
    });

    const indexOfLastReceipt = currentPage * receiptsPerPage;
    const indexOfFirstReceipt = indexOfLastReceipt - receiptsPerPage;
    const currentReceipts = filteredReceipts.slice(indexOfFirstReceipt, indexOfLastReceipt);
    const totalPages = Math.ceil(filteredReceipts.length / receiptsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div className="text-center py-8">Loading receipts...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    const handleAddReceipt = () => {
        navigate('/receipt');
    };

    const handleEditReceipt = (id) => {
        navigate(`/receipt/edit/${id}`);
    };

    const handleViewReceipt = (id) => {
        navigate(`/receipt-details/${id}`);
    };

    return (
        <div className="main-container-box !pt-[0px] mt-[-50px]">
            <br /><br /><br />
            <div className="view-container overflow-x-auto transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-blue-100 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-700">Total Receipts</h3>
                        <p className="mt-1 text-2xl font-semibold text-blue-600">
                            {receipts.length}
                        </p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-green-800">Total Items Purchased</h3>
                        <p className="mt-1 text-2xl font-semibold text-green-600">
                            {receipts.reduce((sum, receipt) => sum + receipt.receiptDetails.length, 0)}
                        </p>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-purple-800">Total Amount</h3>
                        <p className="mt-1 text-2xl font-semibold text-purple-600">
                            Rs. {receipts
                                .reduce(
                                    (sum, receipt) =>
                                        sum + receipt.receiptDetails.reduce(
                                            (sum, item) => sum + (item.quantity * item.rate), 0
                                        ), 0
                                ).toLocaleString()}
                        </p>
                    </div>
                </div>
                <br />
                <button onClick={handleAddReceipt} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Add Receipt
                </button>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="rounded-lg">
                            <tr className="font-semibold bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Bill No</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Vendor</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Items</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Total Amount</th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Actions</th>
                            </tr>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-2">
                                    <input
                                        className="search-input"
                                        placeholder="Search Bill No"
                                        value={filterBillNo}
                                        onChange={(e) => setFilterBillNo(e.target.value)}
                                    />
                                </th>
                                <th className="px-6 py-2">
                                    <input
                                        className="search-input"
                                        placeholder="Search Date"
                                        value={filterDate}
                                        onChange={(e) => setFilterDate(e.target.value)}
                                    />
                                </th>
                                <th className="px-6 py-2">
                                    <input
                                        className="search-input"
                                        placeholder="Search Vendor"
                                        value={filterVendor}
                                        onChange={(e) => setFilterVendor(e.target.value)}
                                    />
                                </th>
                                <th className="px-6 py-2">
                                    <input
                                        className="search-input"
                                        placeholder="Search Item"
                                        value={filterItem}
                                        onChange={(e) => setFilterItem(e.target.value)}
                                    />
                                </th>
                                <th className="px-6 py-2">
                                    <input
                                        className="search-input"
                                        placeholder="Search Amount"
                                        value={filterTotalAmount}
                                        onChange={(e) => setFilterTotalAmount(e.target.value)}
                                    />
                                </th>
                                <th className="px-6 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentReceipts.length > 0 ? currentReceipts.map(receipt => {
                                const totalAmount = receipt.receiptDetails.reduce(
                                    (sum, item) => sum + (item.quantity * item.rate), 0
                                );
                                return (
                                    <tr key={receipt.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{receipt.billNo}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(receipt.receiptDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    {receipt.vendor.name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{receipt.vendor.name}</div>
                                                    <div className="text-sm text-gray-500">{receipt.vendor.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="space-y-1">
                                                {receipt.receiptDetails.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between">
                                                        <span>{item.item.name} ({item.quantity} {item.item.unit})</span>
                                                        <span className="font-medium">
                                                            Rs. {(item.quantity * item.rate).toLocaleString()}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">Rs. {totalAmount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button className="text-blue-600 hover:text-blue-900" onClick={() => handleViewReceipt(receipt.id)}>
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                                <button className="text-red-600 hover:text-green-900" onClick={() => handleEditReceipt(receipt.id)}>
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No receipts found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredReceipts.length > receiptsPerPage && (
                    <div className="flex justify-center mt-6">
                        <nav className="inline-flex rounded-md shadow">
                            <button
                                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`px-3 py-1 border-t border-b border-gray-300 bg-white text-sm font-medium ${currentPage === number
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {number}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceiptsList;