import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Printer, Calendar, User,
  Hash, Mail, Package, FileText
} from 'lucide-react';
import { fetchReceiptById } from '../../api/receipt';
import '../../styles/innerdetails.css';

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

    if (id) loadReceipt();
  }, [id]);

  const handlePrint = async () => {
    setIsPrinting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    window.print();
    setIsPrinting(false);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('PDF download would start here');
    setIsDownloading(false);
  };

  if (loading) {
    return (
      <div className="center-box">
        <div className="spinner-box">
          <div className="spinner-icon"></div>
          <p className="text-gray-600 text-lg">Loading receipt details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center-box">
        <div className="error-box">
          <div className="error-icon">
            <FileText className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="error-title">Error Loading Receipt</h2>
          <p className="error-message">{error}</p>
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="center-box">
        <div className="spinner-box">
          <FileText className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Receipt not found</p>
        </div>
      </div>
    );
  }

  const subtotal = receipt.receiptDetails.reduce(
    (sum, item) => sum + (item.quantity * item.rate), 0
  );
  const taxRate = 0.13;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  return (
    <div className="receipt-container">
      <div className="receipt-wrapper">
        {/* Header */}
        <button onClick={() => navigate(-1)} className="back-to-list">
          <ArrowLeft className="back-icon" />
          <span className="back-text">Back to Receipts</span>
        </button>

        <div className="header-content">
          <div className="receipt-header-left">
            <div className="receipt-icon-box">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="receipt-title-box">Receipt Details</h1>
              <p className="receipt-id">ID: {receipt.id}</p>
            </div>
          </div>
          <div className="button-wrap">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="print-btn"
            >
              <Printer className="w-5 h-5 mr-2" />
              {isPrinting ? 'Printing...' : 'Print Receipt'}
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="download-btn"
            >
              <Download className="w-5 h-5 mr-2" />
              {isDownloading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Receipt Card */}
        <div className="receipt-card">
          <div className="receipt-card-header">
            <div className="receipt-card-header-grid">
              <div className="header-item">
                <div className="header-icon"><Hash className="w-5 h-5" /></div>
                <div>
                  <p className="header-label">Receipt ID</p>
                  <p className="header-value">{receipt.id}</p>
                </div>
              </div>
              <div className="header-item">
                <div className="header-icon"><Calendar className="w-5 h-5" /></div>
                <div>
                  <p className="header-label">Date Issued</p>
                  <p className="header-value">
                    {new Date(receipt.receiptDate).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="header-item">
                <div className="header-icon"><FileText className="w-5 h-5" /></div>
                <div>
                  <p className="header-label">Bill Number</p>
                  <p className="header-value">{receipt.billNo}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Vendor Info */}
            <div className="vendor-section">
              <div className="vendor-title">
                <div className="vendor-icon-box"><User className="w-5 h-5 text-gray-600" /></div>
                <h2 className="vendor-title-text">Vendor Information</h2>
              </div>
              <div className="vendor-info-box">
                <div className="vendor-grid">
                  <div>
                    <p className="vendor-label">Vendor Name</p>
                    <p className="vendor-value">{receipt.vendor.name}</p>
                  </div>
                  <div>
                    <p className="vendor-label">Email Address</p>
                    <div className="vendor-email">
                      <Mail className="vendor-email-icon" />
                      <p className="font-medium text-gray-800">{receipt.vendor.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="vendor-label">Vendor ID</p>
                    <p className="vendor-value">{receipt.vendor.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="items-section">
              <div className="items-title">
                <div className="items-icon-box"><Package className="w-5 h-5 text-gray-600" /></div>
                <h2 className="items-title-text">Items Purchased</h2>
              </div>
              <div className="items-table-container">
                <table className="items-table">
                  <thead className="items-thead">
                    <tr>
                      <th className="items-th text-left">Item</th>
                      <th className="items-th text-left">Unit</th>
                      <th className="items-th text-center">Qty</th>
                      <th className="items-th text-right">Unit Price</th>
                      <th className="items-th text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipt.receiptDetails.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'items-row-white' : 'items-row-gray'}>
                        <td className="items-td">
                          <div className="item-name">{item.item.name}</div>
                          <div className="item-desc">{item.item.description || 'No description'}</div>
                        </td>
                        <td className="items-td unit-text">{item.item.unit || 'EA'}</td>
                        <td className="items-td qty-text">{item.quantity}</td>
                        <td className="items-td unit-price">NPR {item.rate.toLocaleString()}</td>
                        <td className="items-td total-price">NPR {(item.quantity * item.rate).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="summary-container">
              <div className="summary-box">
                <h2 className="summary-title">Payment Summary</h2>
                <div className="space-y-4">
                  <div className="summary-line">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">NPR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-line">
                    <span className="text-gray-600">Tax (13%):</span>
                    <span className="font-medium">NPR {taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="summary-total-box">
                    <div className="summary-line">
                      <span className="total-amount">Total Amount:</span>
                      <span className="total-value">NPR {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-note">
          <p>This is an official receipt. Please keep it for your records.</p>
          <p className="mt-1">Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDetails;
