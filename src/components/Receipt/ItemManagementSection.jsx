import { useState } from "react";
import { FiPlus } from "react-icons/fi";
const ItemManagementSection = ({ 

  items, 
  formData, 
  onAddItem, 
  onRemoveItem, 
  quantityRef, 
  rateRef, 
  calculateTotal, 
  errors,
  setShowForm
}) => {
  const [newItem, setNewItem] = useState({
    itemId: '',
    quantity: '',
    rate: '',
    availableQuantity: 0,
    value: '0.00'
  });

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    
    setNewItem(prev => {
      const updatedItem = { ...prev, [name]: value };
      
      if (name === 'itemId' && value) {
        const selectedItem = items.find(i => i.id === value);
        if (selectedItem) {
          const availableQty = selectedItem.stock?.reduce(
            (sum, stock) => sum + (stock.currentQuantity || 0), 0
          ) || 0;
          updatedItem.availableQuantity = availableQty;
          updatedItem.uom = selectedItem.unit;
        }
      }
      
      return updatedItem;
    });
  };


  const handleQuantityOrRateChange = () => {
    const quantity = parseFloat(quantityRef.current?.value) || 0;
    const rate = parseFloat(rateRef.current?.value) || 0;
    
    setNewItem(prev => ({
      ...prev,
      quantity: quantityRef.current?.value || '',
      rate: rateRef.current?.value || '',
      value: (quantity * rate).toFixed(2)
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    
    const quantity = parseFloat(newItem.quantity);
    const rate = parseFloat(newItem.rate);
    const selectedItem = items.find(i => i.id === newItem.itemId);
    
    if (!selectedItem) {
      alert("Selected item not found");
      return;
    }
    
    const itemToAdd = {
      tempId: Date.now(),
      itemId: newItem.itemId,
      itemName: selectedItem.name,
      quantity: quantity,
      rate: rate,
      value: (quantity * rate).toFixed(2),
      uom: selectedItem.unit,
      availableQuantity: newItem.availableQuantity
    };
    
    onAddItem(itemToAdd);
    setNewItem({
      itemId: '',
      quantity: '',
      rate: '',
      availableQuantity: 0,
      value: '0.00'
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-6">
      {/* Add Item Form */}
      <div className="bg-white p-6 rounded-lg shadow-md flex-1">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Add Items</h2>
        </div>
        <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Item *</label>
            <div className="flex gap-2">
              <select
                name="itemId"
                value={newItem.itemId}
                onChange={handleItemChange}
                className="flex-1 p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Item</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.unit})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                title="Add new item"
              >
                <FiPlus />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available Qty</label>
            <input
              type="text"
              value={newItem.availableQuantity}
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input
              ref={quantityRef}
              type="number"
              name="quantity"
              min="0.01"
              step="0.01"
              onChange={handleQuantityOrRateChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rate *</label>
            <input
              ref={rateRef}
              type="number"
              name="rate"
              min="0"
              step="0.01"
              onChange={handleQuantityOrRateChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input
              type="text"
              value={newItem.value}
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
              readOnly
            />
          </div>
          
          <div className="md:col-span-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setNewItem({
                itemId: '',
                quantity: '',
                rate: '',
                availableQuantity: 0,
                value: '0.00'
              })}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
      
      {/* Added Items List */}
      <div className="bg-white p-6 rounded-lg shadow-md flex-1">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Items to Issue</h2>
        </div>
        <div className="overflow-auto">
          {errors.items && typeof errors.items === 'string' && (
            <p className="text-red-500 text-sm mb-2">{errors.items}</p>
          )}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formData.items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-sm text-gray-500">
                    No items added yet
                  </td>
                </tr>
              ) : (
                formData.items.map(item => (
                  <tr key={item.tempId}>
                    <td className="px-4 py-2 text-sm">{item.itemName}</td>
                    <td className="px-4 py-2 text-sm">{item.quantity} {item.uom}</td>
                    <td className="px-4 py-2 text-sm">{item.rate}</td>
                    <td className="px-4 py-2 text-sm">{item.value}</td>
                    <td className="px-4 py-2 text-sm">
                      <button
                        onClick={() => onRemoveItem(item.tempId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {formData.items.length > 0 && (
                <tr className="bg-gray-50">
                  <td colSpan="3" className="px-4 py-2 text-right font-medium">Total:</td>
                  <td className="px-4 py-2 font-medium">{calculateTotal()}</td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ItemManagementSection;