import { useState } from "react";
import { useVendor } from "../../context/VendorContext";
import SearchBox from "../common/SearchBox";
import Header from "../common/Header";
import "../../styles/view.scss";
import AddEditVendorForm from "./AddEditVendorForm";

const ViewAllVendors = () => {
  const {
    vendors,
    loading,
    error,
    pageNumber,
    totalPages,
    searchTerm,
    setSearchTerm,
    setPageNumber,
    fetchVendors,
    deleteVendor,
  } = useVendor();

  const [addVendorOpened, setAddVendorOpened] = useState(false);
  const [editVendorOpened, setEditVendorOpened] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      await deleteVendor(id);
      alert("Vendor deleted successfully.");
    } catch (err) {
      console.error("Error deleting vendor:", err);
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
    setSelectedVendorId(null);
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
                        {(pageNumber - 1) * 6 + index + 1}
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
        <AddEditVendorForm
          id={editVendorOpened ? selectedVendorId : null}
          onClose={closeModal}
          fetchAllVendors={() => fetchVendors(searchTerm, pageNumber)}
        />
      )}
    </div>
  );
};

export default ViewAllVendors;
