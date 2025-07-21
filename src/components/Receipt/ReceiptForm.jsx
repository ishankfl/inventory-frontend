import { Eye } from 'lucide-react';
import AddEditItemForm from '../item/AddEditItemForm';
import PrimaryInfoBox from './PrimaryInfo';
import ItemInformation from './ItemInformation';
import AddedItemsTable from './AddedItemsTable';
import { useReceipt } from './useReceipt';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ToastNotification from '../common/ToggleNotification'; // ✅ Import toast

const ReceiptForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null); // ✅ Toast state

  const {
    vendors,
    items,
    addedItems,
    newItem,
    primaryInfo,
    selectedItem,
    hoveredRow,
    isLoading,
    randomForReceipt,
    errors,
    initialNewItemState,
    setHoveredRow,
    setNewItem,
    setSelectedItem,
    handlePrimaryChange,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    handleQuantityOrRateChange,
    handleSubmitReceipt: submitReceiptLogic,
    calculateTotal,
  } = useReceipt(isEdit);

  const handleViewReceipt = () => navigate('/receipts');

  const handleRowClick = (item) => {
    setNewItem({ ...initialNewItemState, ...item });
  };

  const handleSubmitReceipt = async () => {
    const result = await submitReceiptLogic();

    if (result?.success) {
      setToast({
        type: 'success',
        message: isEdit ? 'Receipt updated successfully.' : 'Receipt saved successfully.',
        duration: 3000,
      });
      setTimeout(() => navigate('/receipts'), 3000);
    } else {
      setToast({
        type: 'error',
        message: result?.message || 'Failed to submit receipt.',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), toast.duration || 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (isLoading && isEdit) {
    return (
      <div className="bg-gray-100 p-2 sm:p-2 lg:p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p>Loading receipt data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-2 lg:p-4 min-h-screen relative">
      {toast && (
        <ToastNotification
          key={Date.now()}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mx-auto">
        <div className="flex flex-col px-24 gap-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">
                {isEdit ? 'Edit Receipt' : 'Create Receipt'}
              </h1>
              <p className="text-gray-600">Manage and track all inventory receipts</p>
            </div>
            <button
              onClick={handleViewReceipt}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-md"
            >
              <Eye className="h-5 w-5" />
              <span>View Previous</span>
            </button>
          </div>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <AddEditItemForm
              onClose={() => setShowForm(false)}
              onSubmitSuccess={() => {
                setShowForm(false);
              }}
            />
          </div>
        )}

        <form onSubmit={handleAddItem}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 py-4 justify-items-center">
            <div className="bg-white py-8 px-4 rounded-lg shadow-md w-[80%]">
              <PrimaryInfoBox
                errors={errors}
                handlePrimaryChange={handlePrimaryChange}
                primaryInfo={primaryInfo}
                vendors={vendors}
                isEdit={isEdit}
                randomForReceipt={randomForReceipt}
              />
            </div>

            <div className="py-8 px-4 bg-white rounded-lg shadow-md w-[80%]">
              <ItemInformation
                items={items}
                newItem={newItem}
                errors={errors}
                handleItemChange={handleItemChange}
                handleQuantityOrRateChange={handleQuantityOrRateChange}
                handleOpenForm={() => setShowForm(true)}
                setNewItem={setNewItem}
                setSelectedItem={setSelectedItem}
                initialNewItemState={initialNewItemState}
                setErrors={() => {}}
              />
            </div>
          </div>
        </form>

        <div className="px-16">
          <AddedItemsTable
            addedItems={addedItems}
            hoveredRow={hoveredRow}
            setHoveredRow={setHoveredRow}
            handleRowClick={handleRowClick}
            handleRemoveItem={handleRemoveItem}
            calculateTotal={calculateTotal}
          />
        </div>

        <div className="mt-8 flex justify-end gap-4 px-24">
          <button
            type="button"
            className="px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700"
            onClick={() => {
              setToast({
                type: 'info',
                message: 'Changes discarded.',
                duration: 2000,
              });
              setTimeout(() => navigate('/receipt-list'), 1000);
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`px-6 py-2 rounded-md text-white font-semibold ${
              addedItems.length === 0 || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-700'
            }`}
            onClick={handleSubmitReceipt}
            disabled={addedItems.length === 0 || isLoading}
          >
            {isLoading
              ? isEdit
                ? 'Updating...'
                : 'Saving...'
              : isEdit
              ? 'Update Receipt'
              : 'Save Receipt'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptForm;
