import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Calendar, User, Hash, Mail, Package, FileText } from 'lucide-react';
import { fetchReceiptById } from '../../api/receipt';


const ReceiptDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isPrinting, setIsPrinting] = React.useState(false);

  React.useEffect(() => {
    const loadReceipt = async () => {
      try {
        setLoading(true);
        setError(null);
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

    if (id) {
      loadReceipt();
    }
  }, [id]);

  const handlePrint = async () => {
    setIsPrinting(true);
    // Simulate print process
    await new Promise(resolve => setTimeout(resolve, 1500));
    window.print();
    setIsPrinting(false);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    // In real app, this would trigger actual PDF download
    alert('PDF download would start here');
    setIsDownloading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading receipt details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <FileText className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Receipt</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Receipt not found</p>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = receipt.receiptDetails.reduce(
    (sum, item) => sum + (item.quantity * item.rate), 0
  );
  const taxRate = 0.13;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  return (
    <div className="min-h-screen bg-gray-50 mt-[-50px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white text-gray-600 hover:text-gray-800 mb-4 transition-colors duration-200 "
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Receipts
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Receipt Details</h1>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button 
                onClick={handlePrint}
                disabled={isPrinting}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Printer className="w-4 h-4 mr-2" />
                {isPrinting ? 'Printing...' : 'Print'}
              </button>
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Receipt Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <Hash className="w-5 h-5 mr-2 opacity-80" />
                <div>
                  <p className="text-sm opacity-80">Receipt ID</p>
                  <p className="font-semibold">{receipt.id}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 opacity-80" />
                <div>
                  <p className="text-sm opacity-80">Date</p>
                  <p className="font-semibold">{new Date(receipt.receiptDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2 opacity-80" />
                <div>
                  <p className="text-sm opacity-80">Bill No</p>
                  <p className="font-semibold">{receipt.billNo}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Vendor Information */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 text-gray-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Vendor Information</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Vendor Name</p>
                    <p className="font-medium text-gray-800">{receipt.vendor.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-1" />
                      <p className="font-medium text-gray-800">{receipt.vendor.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vendor ID</p>
                    <p className="font-medium text-gray-800">{receipt.vendor.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Package className="w-5 h-5 text-gray-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Items</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-4 font-semibold text-gray-700 border-b">Item</th>
                      <th className="text-left p-4 font-semibold text-gray-700 border-b">Unit</th>
                      <th className="text-center p-4 font-semibold text-gray-700 border-b">Quantity</th>
                      <th className="text-right p-4 font-semibold text-gray-700 border-b">Rate</th>
                      <th className="text-right p-4 font-semibold text-gray-700 border-b">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipt.receiptDetails.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-4 border-b border-gray-200">
                          <div className="font-medium text-gray-800">{item.item.name}</div>
                        </td>
                        <td className="p-4 border-b border-gray-200 text-gray-600">
                          {item.item.unit}
                        </td>
                        <td className="p-4 border-b border-gray-200 text-center font-medium">
                          {item.quantity}
                        </td>
                        <td className="p-4 border-b border-gray-200 text-right font-medium">
                          NPR {item.rate.toLocaleString()}
                        </td>
                        <td className="p-4 border-b border-gray-200 text-right font-semibold">
                          NPR {(item.quantity * item.rate).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Section */}
            <div className="flex justify-end">
              <div className="w-full md:w-96 bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">NPR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax (13%):</span>
                    <span className="font-medium">NPR {taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                      <span className="text-xl font-bold text-blue-600">NPR {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDetails;