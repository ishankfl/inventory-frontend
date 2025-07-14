import React, { useState, useEffect } from 'react';
import { Eye, Edit, Plus, Search, Filter, Calendar, User, Package, DollarSign } from 'lucide-react';
import { fetchAllIssue } from '../../api/receipt';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';

const IssuesList = () => {
    const [issues, setIssues] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [filterIssueId, setFilterIssueId] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterIssuedBy, setFilterIssuedBy] = useState('');
    const [filterItem, setFilterItem] = useState('');
    const [filterTotalValue, setFilterTotalValue] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const issuesPerPage = 10;

    const navigate = useNavigate();

    useEffect(() => {
        const loadIssues = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetchAllIssue();
                if (response.status === 200) {
                    setIssues(response.data);
                }
            } catch (err) {
                console.error("Error fetching issues:", err);
                setError(err.message || 'Failed to load issues. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadIssues();
    }, []);
    const filteredIssues = issues.filter(issue => {
        const totalValue = issue.issueDetails.reduce((sum, item) => sum + item.quantity * item.issueRate, 0);
        return (
            issue.issueId.toLowerCase().includes(filterIssueId.toLowerCase()) &&
            (filterDate ? new Date(issue.issueDate).toLocaleDateString().includes(filterDate) : true) &&
            issue.issuedByUser.fullName.toLowerCase().includes(filterIssuedBy.toLowerCase()) &&
            issue.issueDetails.some(item =>
                item.item.name.toLowerCase().includes(filterItem.toLowerCase())
            ) &&
            totalValue.toLocaleString().includes(filterTotalValue)
        );
    });

    const indexOfLastIssue = currentPage * issuesPerPage;
    const indexOfFirstIssue = indexOfLastIssue - issuesPerPage;
    const currentIssues = filteredIssues.slice(indexOfFirstIssue, indexOfLastIssue);
    const totalPages = Math.ceil(filteredIssues.length / issuesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-text font-medium">Loading issues...</span>
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

    const handleAddIssue = () => {
        navigate('/add-issue');
    };

    const handleEditIssue = (id) => {
        navigate(`/edit-issue/${id}`);
    };

    const handleViewIssue = (id) => {
        navigate(`/view-issue/${id}`);
    };

    const totalIssues = issues.length;
    const totalItemsIssued = issues.reduce((sum, issue) =>
        sum + issue.issueDetails.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const totalValue = issues.reduce((sum, issue) =>
        sum + issue.issueDetails.reduce((itemSum, item) => itemSum + (item.quantity * item.issueRate), 0), 0
    );

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                <Header description={'Manage and track all inventory issues'} handleButton={handleAddIssue} title={'Issues Management'} btnTitle = {' New '}/>
                  

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Total Issues Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-600 mb-1">Total Issues</h3>
                                    <p className="text-2xl font-bold text-text">{totalIssues}</p>
                                </div>
                                <div className="bg-card1color p-3 rounded-lg">
                                    <Package className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </div>

                        {/* Total Items Issued Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-600 mb-1">Total Items Issued</h3>
                                    <p className="text-2xl font-bold text-text">{totalItemsIssued}</p>
                                </div>
                                <div className="bg-card2color p-3 rounded-lg">
                                    <Package className="h-6 w-6 text-success" />
                                </div>
                            </div>
                        </div>

                        {/* Total Value Card */}
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
                            <h3 className="text-lg font-semibold text-text">Filter Issues</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Issue ID"
                                    value={filterIssueId}
                                    onChange={(e) => setFilterIssueId(e.target.value)}
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
                                    placeholder="Issued By"
                                    value={filterIssuedBy}
                                    onChange={(e) => setFilterIssuedBy(e.target.value)}
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
                                    placeholder="Total Value"
                                    value={filterTotalValue}
                                    onChange={(e) => setFilterTotalValue(e.target.value)}
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
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Issue ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Issued By</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Value</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentIssues.length > 0 ? currentIssues.map((issue, index) => {
                                    const totalValue = issue.issueDetails.reduce((sum, item) => sum + (item.quantity * item.issueRate), 0);
                                    return (
                                        <tr key={issue.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-primary">{issue.issueId}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">{new Date(issue.issueDate).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                                                        {issue.issuedByUser.fullName.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-text">{issue.issuedByUser.fullName}</div>
                                                        <div className="text-sm text-gray-500">{issue.issuedByUser.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    {issue.issueDetails.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-lg p-2">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                                                <span className="text-sm font-medium text-text">{item.item.name}</span>
                                                                <span className="text-xs text-gray-500">({item.quantity} {item.item.unit})</span>
                                                            </div>
                                                            <span className="text-sm font-semibold text-success">
                                                                Rs. {(item.quantity * item.issueRate).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-lg font-bold text-text">Rs. {totalValue.toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    {/* View Button with Eye Icon */}
                                                    <button
                                                        onClick={() => handleViewIssue(issue.id)}
                                                        className="!bg-accent !text-black !py-   !px-4 text-primary hover:bg-card1color rounded-lg transition-colors duration-200"
                                                        title="View Issue"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    {/* Edit Button with Edit Icon */}
                                                    <button
                                                        onClick={() => handleEditIssue(issue.id)}
                                                        className="!bg-red-600 !text-white !py-3   !px-4  text-accent hover:bg-card3color rounded-lg transition-colors duration-200"
                                                        title="Edit Issue"
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
                                                <p className="text-lg font-medium">No issues found</p>
                                                <p className="text-sm">Try adjusting your filters or add a new issue</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredIssues.length > issuesPerPage && (
                        <div className="px-6 py-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Showing {indexOfFirstIssue + 1} to {Math.min(indexOfLastIssue, filteredIssues.length)} of {filteredIssues.length} results
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
                                        className=" px-3 py-2 text-sm font-medium text-gray-700 !bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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

export default IssuesList;