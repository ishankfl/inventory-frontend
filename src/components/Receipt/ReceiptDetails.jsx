import React from 'react';
import { useParams } from 'react-router-dom';
import { fetchReceiptById } from '../../api/receipt';

const ReceiptDetails = () => {
    const { id } = useParams();
    const [receipt, setReceipt] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const loadReceipt = async () => {
            try {
                setLoading(true);
                const response = await fetchReceiptById(id);
                if (response.data) {
                    setReceipt(response.data);
                } else {
                    setError('Receipt not found');
                }
            } catch (err) {
                setError(err.message || 'Failed to load receipt');
            } finally {
                setLoading(false);
            }
        };

        loadReceipt();
    }, [id]);

    if (loading) return <div className="text-center py-8">Loading receipt details...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    if (!receipt) return <div className="text-center py-8">Receipt not found</div>;

    // Calculate total amount
    const totalAmount = receipt.receiptDetails.reduce(
        (sum, item) => sum + (item.quantity * item.rate), 0
    );

    return (
        <div className=" mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Receipt Details</h1>
                
                {/* Receipt Header Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Basic Information</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium">Receipt ID:</span> {receipt.id}</p>
                            <p><span className="font-medium">Date:</span> {new Date(receipt.receiptDate).toLocaleDateString()}</p>
                            <p><span className="font-medium">Bill No:</span> {receipt.billNo}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Vendor Information</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium">Vendor:</span> {receipt.vendor.name}</p>
                            <p><span className="font-medium">Email:</span> {receipt.vendor.email}</p>
                            <p><span className="font-medium">Vendor ID:</span> {receipt.vendor.id}</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Items</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {receipt.receiptDetails.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.item.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.item.unit}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.rate.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {(item.quantity * item.rate).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="flex justify-end">
                    <div className="bg-gray-50 p-4 rounded-lg w-full md:w-1/3">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Summary</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium">Subtotal:</span>
                                <span>{totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Tax (13%):</span>
                                <span>{(totalAmount * 0.13).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                <span className="font-medium">Total Amount:</span>
                                <span className="font-bold">{(totalAmount * 1.13).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end space-x-4">
                    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                        Print Receipt
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptDetails;