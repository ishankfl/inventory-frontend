import { useEffect, useState } from "react";
import {
  searchDepartments,
  deleteDepartmentById,
} from "../../api/departments";
import SearchBox from "../common/SearchBox";
import Header from "../common/Header";
import AddDepartment from "./AddDepartment";
import EditDepartment from "./EditDepartment";
import "../../styles/view.scss";

const ViewAllDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [addDepartmentOpened, setAddDepartmentOpened] = useState(false);
  const [editDepartmentOpened, setEditDepartmentOpened] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDepartments(searchTerm, pageNumber);
  }, [pageNumber, searchTerm]);

  const fetchDepartments = async (term = "", page = 1) => {
    try {
      setLoading(true);
      const res = await searchDepartments(term, page, pageSize);
      if (res.status === 200) {
        setDepartments(res.data.data);
        setTotalPages(res.data.totalPages);
      } else {
        setError("Failed to fetch departments.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching departments.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;

    try {
      await deleteDepartmentById(id);
      alert("Department deleted successfully.");
      fetchDepartments(searchTerm, pageNumber); // refetch
    } catch (error) {
      console.error("Error deleting department:", error);
      alert("Failed to delete department.");
    }
  };

  const handleEdit = (deptId) => {
    setSelectedDepartmentId(deptId);
    setEditDepartmentOpened(true);
  };

  const handleAddButtonClicked = () => {
    setAddDepartmentOpened(true);
  };

  const handleSearchFilter = (details) => {
    const trimmed = details.trim();
    setSearchTerm(trimmed);
    setPageNumber(1); // reset to page 1
  };

  const closeModal = () => {
    setAddDepartmentOpened(false);
    setEditDepartmentOpened(false);
  };

  return (
    <div className="p-6">
      <div
        className={`transition-all duration-300 ${addDepartmentOpened || editDepartmentOpened ? "blur-sm" : ""
          }`}
      >
        <Header
          title="Department Management"
          description="Manage and track all company departments"
          btnTitle="Add Department"
          handleButton={handleAddButtonClicked}
        />

        <SearchBox
          label="Departments"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={fetchDepartments}
        />


        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {!loading && departments.length === 0 && (
          <p className="empty-state">No departments found.</p>
        )}

        {!loading && departments.length > 0 && (
          <>
            <div className="table-container">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">S.N.</th>
                    <th className="table-header">Name</th>
                    <th className="table-header">Description</th>
                    <th className="table-header text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {departments.map((department, index) => (
                    <tr
                      key={department.id || index}
                      className="hover:bg-gray-50"
                    >
                      <td className="table-cell">
                        {(pageNumber - 1) * pageSize + index + 1}
                      </td>
                      <td className="table-cell">{department.name}</td>
                      <td className="table-cell">{department.description}</td>
                      <td className="table-cell text-center space-x-2">
                        <button
                          className="action-button button-blue"
                          onClick={() => handleEdit(department.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="action-button button-red"
                          onClick={() => handleDelete(department.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-4 space-x-2">
              <button
                disabled={pageNumber === 1}
                onClick={() => {
                  setPageNumber((prev) => Math.max(prev - 1, 1));
                }}
                className="pagination-button"
              >
                Prev
              </button>
              <span className="px-3 py-1 text-sm">
                Page {pageNumber} of {totalPages}
              </span>
              <button
                disabled={pageNumber === totalPages}
                onClick={() => {
                  setPageNumber((prev) => Math.min(prev + 1, totalPages));
                }}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {(addDepartmentOpened || editDepartmentOpened) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {addDepartmentOpened && (
              <AddDepartment
                onClose={closeModal}
                fetchAllDepartments={() =>
                  fetchDepartments(searchTerm, pageNumber)
                }
              />
            )}
            {editDepartmentOpened && (
              <EditDepartment
                onClose={closeModal}
                id={selectedDepartmentId}
                fetchAllDepartments={() =>
                  fetchDepartments(searchTerm, pageNumber)
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllDepartments;
