import React, { useState, useEffect } from 'react';
import { Eye, Printer, Download, Edit } from 'lucide-react';
import { fetchAllIssue } from '../../api/receipt';
import { useNavigate } from 'react-router-dom';
const IssuesList = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const issuesPerPage = 10;
    const navigate = useNavigate();

 

    useEffect(() => {
        const loadIssues = async () => {
            try {
                setLoading(true);
                const response = await fetchAllIssue();
                if (response.status == 200) {
                    setTimeout(() => {

                        setIssues(response.data);
                        setLoading(false);
                    }, 1000);
                }


            } catch (err) {
                setError(err.message || 'Failed to load issues');
                setLoading(false);
            }
        };

        loadIssues();
    }, []);

    const filteredIssues = issues.filter(issue =>
        issue.issueId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.issuedByUser.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.issueDetails.some(item =>
            item.item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const indexOfLastIssue = currentPage * issuesPerPage;
    const indexOfFirstIssue = indexOfLastIssue - issuesPerPage;
    const currentIssues = filteredIssues.slice(indexOfFirstIssue, indexOfLastIssue);
    const totalPages = Math.ceil(filteredIssues.length / issuesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div className="text-center py-8">Loading issues...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    const handleAddIssue = () => {
        alert('Navigate to add issue page');
        return;
    }

    const handleEditIssue = (id) => {
        navigate(`/edit-issue/${id}`)
        // alert(`Edit issue: ${id}`);
        return;
    }

    const handleViewIssue = (id) => {
        alert(`View issue details: ${id}`);
        return;
    }

    return (
        <div className="main-container-box !pt-[0px] mt-[-50px]">
            <div className="view-container overflow-x-auto transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-blue-100 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-700">Total Issues</h3>
                        <p className="mt-1 text-2xl font-semibold text-blue-600">
                            {issues.length}
                        </p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-green-800">Total Items Issued</h3>
                        <p className="mt-1 text-2xl font-semibold text-green-600">
                            {issues.reduce((sum, issue) => sum + issue.issueDetails.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)}
                        </p>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-purple-800">Total Value</h3>
                        <p className="mt-1 text-2xl font-semibold text-purple-600">
                            Rs. {issues.reduce(
                                (sum, issue) => sum + issue.issueDetails.reduce(
                                    (itemSum, item) => itemSum + (item.quantity * item.issueRate), 0
                                ), 0
                            ).toLocaleString()}
                        </p>
                    </div>
                </div>
                <br />
                <button onClick={handleAddIssue} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Add Issue
                </button>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Issues Inventory</h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by issue ID, issued by or item..."
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
                    <table className="min-w-full bg-white">
                        <thead className="rounded-lg">
                            <tr className="rounded-lg font-semibold bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued By</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-2"><input className="w-full text-black p-2 border rounded" type="text" /></th>
                                <th className="px-6 py-2"><input className="w-full text-black p-2 border rounded" type="text" /></th>
                                <th className="px-6 py-2"><input className="w-full text-black p-2 border rounded" type="text" /></th>
                                <th className="px-6 py-2"><input className="w-full text-black p-2 border rounded" type="text" /></th>
                                <th className="px-6 py-2"><input className="w-full text-black p-2 border rounded" type="text" /></th>
                                <th className="px-6 py-2"><input className="w-full text-black p-2 border rounded" type="text" /></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentIssues.length > 0 ? (
                                currentIssues.map((issue) => {
                                    const totalValue = issue.issueDetails.reduce(
                                        (sum, item) => sum + (item.quantity * item.issueRate), 0
                                    );

                                    return (
                                        <tr key={issue.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {issue.issueId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(issue.issueDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                            {issue.issuedByUser.fullName.charAt(0)}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {issue.issuedByUser.fullName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {issue.issuedByUser.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <div className="space-y-1">
                                                    {issue.issueDetails.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between">
                                                            <span>{item.item.name} ({item.quantity} {item.item.unit})</span>
                                                            <span className="font-medium">
                                                                Rs. {(item.quantity * item.issueRate).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                Rs. {totalValue.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900"
                                                        onClick={() => handleViewIssue(issue.id)}
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                    </button>
                                                    <button className="text-red-600 hover:text-green-900" onClick={() => handleEditIssue(issue.id)}>
                                                        <Edit className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No issues found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredIssues.length > issuesPerPage && (
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

export default IssuesList;