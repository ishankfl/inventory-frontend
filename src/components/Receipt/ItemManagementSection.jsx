import { useState, useRef, useEffect } from "react";
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';
import { FiPlus } from "react-icons/fi";
import { itemSchema } from "../../utils/yup/receipt-form.vaid";

const ItemManagementSection = ({
  items,
  formData,
  onAddItem,
  onRemoveItem,
  calculateTotal,
  errors,
  setShowForm
}) => {
  const [newItem, setNewItem] = useState({
    itemId: '',
    quantity: '1',
    rate: '0',
    availableQuantity: 0,
    value: '0.00',
    uom: ''
  });

  const quantityRef = useRef(null);
  const rateRef = useRef(null);

  useEffect(() => {
    if (newItem.itemId) {
      const selectedItem = items.find(i => i.id === newItem.itemId);
      if (selectedItem) {
        const fetchedAvailableQty = selectedItem.stock?.reduce(
          (sum, stock) => sum + (stock.currentQuantity || 0), 0
        ) || 0;

        const alreadyAdded = formData.items.find(i => i.itemId === newItem.itemId);
        const alreadyQty = alreadyAdded ? parseFloat(alreadyAdded.quantity) : 0;
        const remainingQty = fetchedAvailableQty - alreadyQty;

        setNewItem(prev => ({
          ...prev,
          availableQuantity: remainingQty < 0 ? 0 : remainingQty,
          rate: selectedItem.price.toString(),
          uom: selectedItem.unit
        }));
      }
    }
  }, [formData.items, newItem.itemId, items]);

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantityOrRateChange = (e) => {
    const { name, value } = e.target;
    const quantity = name === "quantity" ? parseFloat(value) || 0 : parseFloat(newItem.quantity) || 0;
    const rate = name === "rate" ? parseFloat(value) || 0 : parseFloat(newItem.rate) || 0;

    setNewItem(prev => ({
      ...prev,
      [name]: value,
      value: (quantity * rate).toFixed(2)
    }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();

    const quantity = parseFloat(newItem.quantity);
    const rate = parseFloat(newItem.rate);
    const selectedItem = items.find(i => i.id === newItem.itemId);

    if (!selectedItem) {
      alert("Selected item not found");
      return;
    }

    try {
      await itemSchema.validate(newItem, { abortEarly: false });

      const updatedItem = {
        tempId: Date.now(),
        itemId: newItem.itemId,
        itemName: selectedItem.name,
        quantity,
        rate,
        value: (quantity * rate).toFixed(2),
        uom: selectedItem.unit,
        availableQuantity: newItem.availableQuantity - quantity
      };

      const existingIndex = formData.items.findIndex(i => i.itemId === newItem.itemId);

      if (existingIndex !== -1) {
        onAddItem({ updatedItem, isUpdate: true });
      } else {
        onAddItem({ updatedItem, isUpdate: false });
      }

      setNewItem({
        itemId: '',
        quantity: '1',
        rate: '0',
        availableQuantity: 0,
        value: '0.00',
        uom: ''
      });

      if (quantityRef.current) quantityRef.current.value = "1";
      if (rateRef.current) rateRef.current.value = "0";
    } catch (validationError) {
      if (validationError.inner && validationError.inner.length > 0) {
        const messages = validationError.inner.map(err => `• ${err.message}`).join("\n");
        alert(`Please fix the following errors:\n${messages}`);
      } else {
        alert(`Validation error: ${validationError.message}`);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-md flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormSelect
              label="Item *"
              name="itemId"
              value={newItem.itemId}
              onChange={handleItemChange}
              options={[
                { value: "", label: "Select Item" },
                ...items.map(item => ({
                  value: item.id,
                  label: `${item.name} (${item.unit})`,
                  disabled: formData.items.some(i => i.itemId === item.id)
                }))
              ]}
              error={errors.itemId}
            />
          </div>

          <FormInput
            label="Available Qty"
            type="text"
            value={newItem.availableQuantity}
            readOnly
            className="bg-gray-100"
          />

          <FormInput
            label="Quantity *"
            name="quantity"
            type="number"
            ref={quantityRef}
            value={newItem.quantity}
            onChange={handleQuantityOrRateChange}
            min="0.01"
            step="0.01"
            error={errors.quantity}
          />

          <FormInput
            label="Rate *"
            name="rate"
            type="number"
            ref={rateRef}
            value={newItem.rate}
            onChange={handleQuantityOrRateChange}
            min="0"
            step="0.01"
            disabled
            error={errors.rate}
          />

          <FormInput
            label="Value"
            type="text"
            value={newItem.value}
            readOnly
            className="bg-gray-100"
          />

          <div className="md:col-span-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setNewItem({
                itemId: '',
                quantity: '1',
                rate: '0',
                availableQuantity: 0,
                value: '0.00',
                uom: ''
              })}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {formData.items.some(i => i.itemId === newItem.itemId) ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md flex-1">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Items to Issue</h2>
        </div>
        <div className="overflow-auto">
          {errors.items && typeof errors.items === 'string' && (
            <p className="text-red-500 text-sm mb-2">{errors.items}</p>
          )}
          <table className="">
            <thead className="">
              <tr>
                <th className="">Item</th>
                <th className="">Qty</th>
                <th className="">Rate</th>
                <th className="">Value</th>
                <th className="">Action</th>
              </tr>
            </thead>
            <tbody className="min-h-full bg-white divide-y divide-gray-200">
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
                    <td className="px-4 py-2 text-sm">
                      {item.quantity} {item.uom}
                      {errors[`items[${formData.items.indexOf(item)}].quantity`] && (
                        <p className="text-red-500 text-xs">
                          {errors[`items[${formData.items.indexOf(item)}].quantity`]}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm">{item.rate}</td>
                    <td className="px-4 py-2 text-sm">{item.value}</td>
                    <td className="px-4 py-2 text-sm">
                      <button
                        type="button"
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
