import React, { useState, useEffect } from 'react';
import {
  Eye,
  Edit,
  Search,
  Filter,
  Calendar,
  User,
  Package,
  DollarSign
} from 'lucide-react';
import { fetchAllIssue } from '../../api/receipt';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import { IssueListTable } from './IssueListTable';
import FilterInput from '../common/FilterInput';
import StatCard from '../common/StatCard';

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

  // Pagination
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const issuesPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchAllIssue(currentPage, issuesPerPage);
        if (response.status === 200) {
          setIssues(response.data.data);
          setTotalPages(response.data.pagination.totalPages);
        }
      } catch (err) {
        console.error('Error fetching issues:', err);
        setError(err.message || 'Failed to load issues. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, [currentPage]);

  const filteredIssues = issues.filter((issue) => {
    const totalValue = issue.issueDetails.reduce(
      (sum, item) => sum + item.quantity * item.issueRate,
      0
    );
    return (
      issue.issueId.toLowerCase().includes(filterIssueId.toLowerCase()) &&
      (filterDate
        ? new Date(issue.issueDate).toLocaleDateString().includes(filterDate)
        : true) &&
      issue.issuedByUser.fullName
        .toLowerCase()
        .includes(filterIssuedBy.toLowerCase()) &&
      issue.issueDetails.some((item) =>
        item.item.name.toLowerCase().includes(filterItem.toLowerCase())
      ) &&
      totalValue.toLocaleString().includes(filterTotalValue)
    );
  });



  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-text font-medium">Loading issues...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
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
  const totalItemsIssued = issues.reduce(
    (sum, issue) =>
      sum +
      issue.issueDetails.reduce(
        (itemSum, item) => itemSum + item.quantity,
        0
      ),
    0
  );
  const totalValue = issues.reduce(
    (sum, issue) =>
      sum +
      issue.issueDetails.reduce(
        (itemSum, item) => itemSum + item.quantity * item.issueRate,
        0
      ),
    0
  );

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Header
            description={'Manage and track all inventory issues'}
            handleButton={handleAddIssue}
            title={'Issues Management'}
            btnTitle={' New '}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Issues */}
            <StatCard title="Total Issues" value={totalIssues} icon={<Package className="h-6 w-6 text-primary" />} bg="bg-card1color" />

            {/* Total Items */}
            <StatCard title="Total Items Issued" value={totalItemsIssued} icon={<Package className="h-6 w-6 text-success" />} bg="bg-card2color" />

            {/* Total Value */}
            <StatCard title="Total Value" value={`Rs. ${totalValue.toLocaleString()}`} icon={<DollarSign className="h-6 w-6 text-accent" />} bg="bg-card3color" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Filter Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-text">Filter Issues</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <FilterInput icon={Search} placeholder="Issue ID" value={filterIssueId} onChange={setFilterIssueId} />
              <FilterInput icon={Calendar} placeholder="Date" value={filterDate} onChange={setFilterDate} />
              <FilterInput icon={User} placeholder="Issued By" value={filterIssuedBy} onChange={setFilterIssuedBy} />
              <FilterInput icon={Package} placeholder="Item" value={filterItem} onChange={setFilterItem} />
              <FilterInput icon={DollarSign} placeholder="Total Value" value={filterTotalValue} onChange={setFilterTotalValue} />
            </div>
          </div>

          {/* Table */}
          <IssueListTable
            currentIssues={filteredIssues}
            handleViewIssue={handleViewIssue}
            handleEditIssue={handleEditIssue}
            setCurrentIssues={setIssues}
          />

          {/* Pagination Controls */}
          <div className="p-4 flex justify-between space-x-4 border-t border-gray-100">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



export default IssuesList;
