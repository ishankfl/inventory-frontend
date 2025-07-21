import { useState } from "react";
import { useDepartmentContext } from "../../context/DepartmentContext";
import SearchBox from "../common/SearchBox";
import Header from "../common/Header";
import AddDepartment from "./AddDepartment";
import EditDepartment from "./EditDepartment";
import "../../styles/view.scss";

const ViewAllDepartments = () => {
  const {
    departments,
    loading,
    error,
    pageNumber,
    setPageNumber,
    totalPages,
    searchTerm,
    setSearchTerm,
    fetchDepartments,
    deleteDepartment,
  } = useDepartmentContext();

  const [addDepartmentOpened, setAddDepartmentOpened] = useState(false);
  const [editDepartmentOpened, setEditDepartmentOpened] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    try {
      await deleteDepartment(id);
      alert("Department deleted successfully.");
    } catch (error) {
      console.error("Error deleting department:", error);
      alert("Failed to delete department.");
    }
  };

  const handleEdit = (deptId) => {
    setSelectedDepartmentId(deptId);
    setEditDepartmentOpened(true);
  };

  const handleSearchFilter = (term) => {
    setSearchTerm(term.trim());
    setPageNumber(1);
  };

  const closeModal = () => {
    setAddDepartmentOpened(false);
    setEditDepartmentOpened(false);
  };

  return (
    <div className="p-6">
      <div className={`${addDepartmentOpened || editDepartmentOpened ? "blur-sm" : ""}`}>
        <Header
          title="Department Management"
          description="Manage and track all company departments"
          btnTitle="Add"
          handleButton={() => setAddDepartmentOpened(true)}
        />

        <SearchBox
          label="Departments"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={() => fetchDepartments(searchTerm, pageNumber)}
        />

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {!loading && departments.length === 0 && <p className="empty-state">No departments found.</p>}

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
                    <tr key={department.id || index} className="hover:bg-gray-50">
                      <td className="table-cell">{(pageNumber - 1) * 6 + index + 1}</td>
                      <td className="table-cell">{department.name}</td>
                      <td className="table-cell">{department.description}</td>
                      <td className="table-cell text-center space-x-2">
                        <button className="action-button button-blue" onClick={() => handleEdit(department.id)}>
                          Edit
                        </button>
                        <button className="action-button button-red" onClick={() => handleDelete(department.id)}>
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
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                className="pagination-button"
              >
                Prev
              </button>
              <span className="px-3 py-1 text-sm">
                Page {pageNumber} of {totalPages}
              </span>
              <button
                disabled={pageNumber === totalPages}
                onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
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
              <AddDepartment onClose={closeModal} fetchAllDepartments={fetchDepartments} />
            )}
            {editDepartmentOpened && (
              <EditDepartment
                onClose={closeModal}
                id={selectedDepartmentId}
                fetchAllDepartments={fetchDepartments}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllDepartments;
