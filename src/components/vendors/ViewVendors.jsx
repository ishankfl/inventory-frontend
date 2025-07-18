import { useEffect, useState } from "react";
import {
  searchVendors,
  deleteVendorById,
} from "../../api/vendors"; // make sure this file exists
import SearchBox from "../common/SearchBox";
import Header from "../common/Header";
import AddVendor from "./AddVendor"; // modal for adding vendor
import EditVendor from "./EditVendor"; // modal for editing vendor
import "../../styles/view.scss";

const ViewAllVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [addVendorOpened, setAddVendorOpened] = useState(false);
  const [editVendorOpened, setEditVendorOpened] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState("");

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchVendors(searchTerm, pageNumber);
  }, [searchTerm, pageNumber]);

  const fetchVendors = async (term = "", page = 1) => {
    try {
      setLoading(true);
      const res = await searchVendors(term, page, pageSize);
      if (res.status === 200) {
        setVendors(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setError("Failed to fetch vendors.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching vendors.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      await deleteVendorById(id);
      alert("Vendor deleted successfully.");
      fetchVendors(searchTerm, pageNumber);
    } catch (error) {
      console.error("Error deleting vendor:", error);
      alert("Failed to delete vendor.");
    }
  };

  const handleEdit = (id) => {
    setSelectedVendorId(id);
    setEditVendorOpened(true);
  };

  const handleAddButtonClicked = () => {
    setAddVendorOpened(true);
  };

  const closeModal = () => {
    setAddVendorOpened(false);
    setEditVendorOpened(false);
  };

  return (
    <div className="p-6">
      <div
        className={`transition-all duration-300 ${addVendorOpened || editVendorOpened ? "blur-sm" : ""
          }`}
      >
        <Header
          title="Vendor Management"
          description="Manage and track all company vendors"
          btnTitle="Add Vendor"
          handleButton={handleAddButtonClicked}
        />

        <SearchBox
          label="Vendors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={() => fetchVendors(searchTerm, 1)}
        />

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {!loading && vendors.length === 0 && (
          <p className="empty-state">No vendors found.</p>
        )}

        {!loading && vendors.length > 0 && (
          <>
            <div className="table-container">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">S.N.</th>
                    <th className="table-header">Name</th>
                    <th className="table-header">Email</th>
                    <th className="table-header text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vendors.map((vendor, index) => (
                    <tr key={vendor.id} className="hover:bg-gray-50">
                      <td className="table-cell">
                        {(pageNumber - 1) * pageSize + index + 1}
                      </td>
                      <td className="table-cell">{vendor.name}</td>
                      <td className="table-cell">{vendor.email}</td>
                      <td className="table-cell text-center space-x-2">
                        <button
                          className="action-button button-blue"
                          onClick={() => handleEdit(vendor.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="action-button button-red"
                          onClick={() => handleDelete(vendor.id)}
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

      {(addVendorOpened || editVendorOpened) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {addVendorOpened && (
              <AddVendor
                onClose={closeModal}
                fetchAllVendors={() => fetchVendors(searchTerm, pageNumber)}
              />
            )}
            {editVendorOpened && (
              <EditVendor
                onClose={closeModal}
                id={selectedVendorId}
                fetchAllVendors={() => fetchVendors(searchTerm, pageNumber)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllVendors;
