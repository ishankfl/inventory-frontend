import React, { useState, useEffect } from 'react';
import { fetchAllReceipts } from '../../api/receipt';
import { FiEye, FiPrinter, FiDownload, FiEdit } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const ReceiptsList = () => {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const receiptsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const loadReceipts = async () => {
            try {
                setLoading(true);
                const response = await fetchAllReceipts();
                console.log(response.data.data);
                if (response.data.data) {
                    setReceipts(response.data.data);
                } else {
                    setError('No receipts found');
                }
            } catch (err) {
                setError(err.message || 'Failed to load receipts');
            } finally {
                setLoading(false);
            }
        };

        loadReceipts();
    }, []);

    const filteredReceipts = receipts.filter(receipt => 
        receipt.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.receiptDetails.some(item => 
            item.item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const indexOfLastReceipt = currentPage * receiptsPerPage;
    const indexOfFirstReceipt = indexOfLastReceipt - receiptsPerPage;
    const currentReceipts = filteredReceipts.slice(indexOfFirstReceipt, indexOfLastReceipt);
    const totalPages = Math.ceil(filteredReceipts.length / receiptsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div className="text-center py-8">Loading receipts...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    const handleAddReceipt = () => {
        navigate('/receipt');
        return;
    }

    const handleEditReceipt = (id) => {
        navigate(`/receipt/edit/${id}`);
        return;
    }

    return (
        <div className="main-container-box !pt-[0px]  mt-[-50px]">
            
            <div className="view-container overflow-x-auto transition-all duration-300 ">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-800">Total Receipts</h3>
                        <p className="mt-1 text-2xl font-semibold text-blue-600">
                            {receipts.length}
                        </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-green-800">Total Items Purchased</h3>
                        <p className="mt-1 text-2xl font-semibold text-green-600">
                            {receipts.reduce((sum, receipt) => sum + receipt.receiptDetails.length, 0)}
                        </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-purple-800">Total Amount</h3>
                        <p className="mt-1 text-2xl font-semibold text-purple-600">
                            Rs. {receipts.reduce(
                                (sum, receipt) => sum + receipt.receiptDetails.reduce(
                                    (sum, item) => sum + (item.quantity * item.rate), 0
                                ), 0
                            ).toLocaleString()}
                        </p>
                    </div>
                </div>
                <br></br>
                        <button onClick={handleAddReceipt}>Add Receipt</button>
                <div className=" flex justify-between items-center ">
                    <h1 className="text-2xl font-bold text-gray-800">Receipts Inventory</h1>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by bill no, vendor or item..."
                            className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg
                            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                    strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="">
                        <thead className='rounded-lg '>
                            <tr className='rounded-lg font-semibold'>
                                <th className="">Bill No</th>
                                <th className="">Date</th>
                                <th className="">Vendor</th>
                                <th className="">Items</th>
                                <th className="">Total Amount</th>
                                <th className="">Actions</th>
                            </tr>
                            <tr className='bg-gray-100'>
                                <th className=""><input className='!w-[80%] text-black !p-2 !m-0 ' type="text" /></th>
                                <th className=""><input className='!w-[80%] text-black !p-2 !m-0 ' type="text" /></th>
                                <th className=""><input className='!w-[80%] text-black !p-2 !m-0 ' type="text" /></th>
                                <th className=""><input className='!w-[80%] text-black !p-2 !m-0 ' type="text" /></th>
                                <th className=""><input className='!w-[80%] text-black !p-2 !m-0 ' type="text" /> </th>
                                <th className=""><input className='!w-[80%] text-black !p-2 !m-0 ' type="text" /></th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {currentReceipts.length > 0 ? (
                                currentReceipts.map((receipt) => {
                                    const totalAmount = receipt.receiptDetails.reduce(
                                        (sum, item) => sum + (item.quantity * item.rate), 0
                                    );
                                    
                                    return (
                                        <tr key={receipt.id}>
                                            <td className="">
                                                {receipt.billNo}
                                            </td>
                                            <td className="">
                                                {new Date(receipt.receiptDate).toLocaleDateString()}
                                            </td>
                                            <td className="">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                            {receipt.vendor.name.charAt(0)}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {receipt.vendor.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {receipt.vendor.email}
                                                        </div>
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                Rs. {totalAmount.toLocaleString()}
                                            </td>
                                            <td className="">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        to={`/receipt-details/${receipt.id}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <FiEye className="h-5 w-5" />
                                                    </Link>
                                                    <button className="text-gray-600 hover:text-gray-900">
                                                        <FiPrinter className="h-5 w-5" />
                                                    </button>
                                                    <button className="text-white-600 hover:text-green-900">
                                                        <FiDownload className="h-5 w-5" />
                                                    </button>
                                                      <button className="text-red-600 hover:text-green-900" onClick={() => handleEditReceipt(receipt.id)}>
                                                        <FiEdit className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                    
                                        </tr>

                                    );
                                })
                            ) : (
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
                                    className={`px-3 py-1 border-t border-b border-gray-300 bg-white text-sm font-medium ${
                                        currentPage === number
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

                {/* Summary Cards */}
                
            </div>
        </div>
    );
};

export default ReceiptsList;