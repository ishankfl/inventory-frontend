import { Edit, Eye, Package } from "lucide-react";

export const IssueListTable = ({currentIssues,handleViewIssue,handleEditIssue}) => {
    return (
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
            </div>)
}