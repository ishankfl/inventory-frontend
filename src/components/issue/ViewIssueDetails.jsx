import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Printer, Calendar, User,
  Hash, Mail, Package, FileText, Box, CheckCircle, XCircle
} from 'lucide-react';
import { fetchIssueById } from '../../api/issue';
import '../../styles/innerdetails.css';

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isPrinting, setIsPrinting] = React.useState(false);

  React.useEffect(() => {
    const loadIssue = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchIssueById(id);
        if (response.data) {
          setIssue(response.data);
        } else {
          setError('Issue not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load issue');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadIssue();
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
          <p className="text-gray-600 text-lg">Loading issue details...</p>
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
          <h2 className="error-title">Error Loading Issue</h2>
          <p className="error-message">{error}</p>
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="center-box">
        <div className="spinner-box">
          <Box className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Issue not found</p>
        </div>
      </div>
    );
  }

  const totalAmount = issue.issueItems.reduce(
    (sum, item) => sum + (item.quantityIssued * item.product.price), 0
  );

  return (
    <div className="receipt-container">
      <div className="receipt-wrapper">
        {/* Header */}
        <button onClick={() => navigate(-1)} className="back-to-list">
          <ArrowLeft className="back-icon" />
          <span className="back-text">Back to Issues</span>
        </button>

        <div className="header-content">
          <div className="receipt-header-left">
            <div className="receipt-icon-box">
              <Box className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="receipt-title-box">Issue Details</h1>
              <p className="receipt-id">ID: {issue.id}</p>
            </div>
          </div>
          <div className="button-wrap">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="print-btn"
            >
              <Printer className="w-5 h-5 mr-2" />
              {isPrinting ? 'Printing...' : 'Print Issue'}
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

        {/* Issue Card */}
        <div className="receipt-card">
          <div className="receipt-card-header">
            <div className="receipt-card-header-grid">
              <div className="header-item">
                <div className="header-icon"><Hash className="w-5 h-5" /></div>
                <div>
                  <p className="header-label">Issue ID</p>
                  <p className="header-value">{issue.id}</p>
                </div>
              </div>
              <div className="header-item">
                <div className="header-icon"><Calendar className="w-5 h-5" /></div>
                <div>
                  <p className="header-label">Date Issued</p>
                  <p className="header-value">
                    {new Date(issue.issueDate).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="header-item">
                <div className="header-icon">
                  {issue.isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
                <div>
                  <p className="header-label">Status</p>
                  <p className="header-value">
                    {issue.isCompleted ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Department Info */}
            <div className="vendor-section">
              <div className="vendor-title">
                <div className="vendor-icon-box"><User className="w-5 h-5 text-gray-600" /></div>
                <h2 className="vendor-title-text">Department Information</h2>
              </div>
              <div className="vendor-info-box">
                <div className="vendor-grid">
                  <div>
                    <p className="vendor-label">Department Name</p>
                    <p className="vendor-value">{issue.department.name}</p>
                  </div>
                  <div>
                    <p className="vendor-label">Department Code</p>
                    <p className="vendor-value">{issue.department.code || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="vendor-label">Location</p>
                    <p className="vendor-value">{issue.department.location || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Issuer Info */}
            <div className="vendor-section mt-6">
              <div className="vendor-title">
                <div className="vendor-icon-box"><User className="w-5 h-5 text-gray-600" /></div>
                <h2 className="vendor-title-text">Issued By</h2>
              </div>
              <div className="vendor-info-box">
                <div className="vendor-grid">
                  <div>
                    <p className="vendor-label">Staff Name</p>
                    <p className="vendor-value">{issue.issuedBy.fullName}</p>
                  </div>
                  <div>
                    <p className="vendor-label">Email Address</p>
                    <div className="vendor-email">
                      <Mail className="vendor-email-icon" />
                      <p className="font-medium text-gray-800">{issue.issuedBy.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="vendor-label">Staff ID</p>
                    <p className="vendor-value">{issue.issuedBy.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="items-section mt-6">
              <div className="items-title">
                <div className="items-icon-box"><Package className="w-5 h-5 text-gray-600" /></div>
                <h2 className="items-title-text">Items Issued</h2>
              </div>
              <div className="items-table-container">
                <table className="items-table">
                  <thead className="items-thead">
                    <tr>
                      <th className="items-th text-left">Item</th>
                      <th className="items-th text-left">Description</th>
                      <th className="items-th text-center">Qty Issued</th>
                      <th className="items-th text-right">Unit Price</th>
                      <th className="items-th text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issue.issueItems.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'items-row-white' : 'items-row-gray'}>
                        <td className="items-td">
                          <div className="item-name">{item.product.name}</div>
                          <div className="item-desc">{item.product.description || 'No description'}</div>
                        </td>
                        <td className="items-td unit-text">{item.product.description || 'N/A'}</td>
                        <td className="items-td qty-text">{item.quantityIssued}</td>
                        <td className="items-td unit-price">Rs. {item.product.price.toLocaleString()}</td>
                        <td className="items-td total-price">Rs. {(item.quantityIssued * item.product.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="summary-container">
              <div className="summary-box">
                <h2 className="summary-title">Issue Summary</h2>
                <div className="space-y-4">
                  <div className="summary-line">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium">{issue.issueItems.length}</span>
                  </div>
                  <div className="summary-total-box">
                    <div className="summary-line">
                      <span className="total-amount">Total Amount:</span>
                      <span className="total-value">Rs. {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {issue.deliveryNote && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Notes</h3>
                <p className="text-gray-600">{issue.deliveryNote}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="footer-note">
          <p>This is an official issue record. Please keep it for your records.</p>
          <p className="mt-1">Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;