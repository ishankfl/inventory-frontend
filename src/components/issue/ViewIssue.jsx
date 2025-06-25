import React, { useEffect, useState } from 'react';
import { viewIssue } from '../../api/issue';

const ViewIssuePage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await viewIssue();
        setIssues(response.data);
        console.log(response.data);
      } catch (err) {
        console.error('Error fetching issues:', err);
        setError('Failed to load issues.');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Get unique department names
  const departmentNames = [];
  issues.forEach(issue => {
    if (!departmentNames.includes(issue.department.name)) {
      departmentNames.push(issue.department.name);
    }
  });

  const filteredIssues = selectedDepartment === 'all' 
    ? issues 
    : issues.filter(issue => issue.department.name === selectedDepartment);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading issues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center">
            <div className="text-red-500 text-xl mr-3">⚠️</div>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!issues || issues.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-600 text-lg">No issues to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Issued Product Summary</h1>
                <p className="text-gray-600">Total Issues: {filteredIssues.length}</p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-4">
                {/* Department Filter */}
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Departments</option>
                  {departmentNames.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                
                {/* Download All Button */}
              
              </div>
            </div>
          </div>
        </div>

        {/* Issues by Department */}
        {departmentNames
          .filter(dept => selectedDepartment === 'all' || dept === selectedDepartment)
          .map(deptName => (
          <div key={deptName} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span>🏢</span>
                  Department: {deptName}
                </h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredIssues.filter(issue => issue.department.name === deptName).length} Issues
                </span>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {filteredIssues
                .filter(issue => issue.department.name === deptName)
                .map(issue => {
                  const totalAmount = issue.issueItems
                    .map(item => item.quantityIssued * item.product.price)
                    .reduce((a, b) => a + b, 0);

                  return (
                    <div key={issue.id} className="border border-gray-200 rounded-lg p-6">
                      {/* Issue Header */}
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <h3 className="text-lg font-semibold text-gray-900">Issue #{issue.id}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              issue.isCompleted 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {issue.isCompleted ? '✅ Completed' : '⏳ Not Completed'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-medium">Issued By:</span> {issue.issuedBy.fullName} ({issue.issuedBy.email})</p>
                            <p><span className="font-medium">Issue Date:</span> {new Date(issue.issueDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <button
                          // onClick={() => generateSingleIssuePDF(issue)}
                          className="mt-4 lg:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                        >
                          <span>📄</span>
                          Download PDF
                        </button>
                      </div>

                      {/* Products Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Product Name</th>
                              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Description</th>
                              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Quantity</th>
                              <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">Unit Price</th>
                              <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">Total Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {issue.issueItems.map(item => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                                  {item.product.name}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-gray-600">
                                  {item.product.description}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                                    {item.quantityIssued}
                                  </span>
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                                  Rs. {item.product.price.toLocaleString()}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-green-700">
                                  Rs. {(item.quantityIssued * item.product.price).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Issue Summary */}
                      <div className="mt-6 bg-gray-50 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                          <div className="flex items-center gap-6">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Total Items:</span> {issue.issueItems.length}
                            </p>
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            Total Amount: Rs. {totalAmount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        {/* Grand Total Summary */}
        {filteredIssues.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600">Total Issues</p>
                  <p className="text-2xl font-bold text-blue-600">{filteredIssues.length}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {filteredIssues.reduce((total, issue) => total + issue.issueItems.length, 0)}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600">Grand Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    Rs. {filteredIssues.reduce((total, issue) => {
                      return total + issue.issueItems
                        .map(item => item.quantityIssued * item.product.price)
                        .reduce((a, b) => a + b, 0);
                    }, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewIssuePage;