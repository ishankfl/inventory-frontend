import { useEffect, useState } from "react";
import { deleteDepartmentById, getAllDepartments } from "../../api/departments";
import SearchBox from "../common/SearchBox";
import Header from "../common/Header";
import AddDepartment from './AddDepartment';
import EditDepartment from './EditDepartment';
import '../../styles/view.scss';

const ViewAllDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [originalDepartments, setOriginalDepartments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [addDepartmentOpened, setAddDepartmentOpened] = useState(false);
  const [editDepartmentOpened, setEditDepartmentOpened] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await getAllDepartments();
      if (response.status === 200) {
        setDepartments(response.data);
        setOriginalDepartments(response.data);
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
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    try {
      await deleteDepartmentById(id);
      alert("Department deleted successfully.");
      setDepartments(depts => depts.filter(dept => dept.id !== id));
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
    if (!details || details.trim() === '') {
      setDepartments(originalDepartments);
      return;
    }

    const lowerDetails = details.trim().toLowerCase();
    const filteredDepartments = originalDepartments.filter(item =>
      item.name.toLowerCase().includes(lowerDetails) ||
      item.description.toLowerCase().includes(lowerDetails)
    );

    setDepartments(filteredDepartments);
  };

  const closeModal = () => {
    setAddDepartmentOpened(false);
    setEditDepartmentOpened(false);
  };

  return (
    <div className="p-6">
      <div className={`transition-all duration-300 ${addDepartmentOpened || editDepartmentOpened ? "blur-sm" : ""}`}>
        <Header
          title="Department Management"
          description="Manage and track all company departments"
          btnTitle="Add Department"
          handleButton={handleAddButtonClicked}
        />
        
        <SearchBox handleSearchFilter={handleSearchFilter} label="Department" />

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {!loading && !error && departments.length === 0 && (
          <p className="empty-state">No departments found.</p>
        )}

        {!loading && departments.length > 0 && (
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
                    <td className="table-cell">{index + 1}</td>
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
        )}
      </div>

      {(addDepartmentOpened || editDepartmentOpened) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {addDepartmentOpened && (
              <AddDepartment
                onClose={closeModal}
                fetchAllDepartments={fetchDepartments}
              />
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