import SectionHeader from "./SectionHeader";
import FormSelect from "../common/FormSelect";
import FormInput from "../common/FormInput"; // Assuming you have this component
import { PlusIcon } from "lucide-react";

const ItemInformation = ({
  items = [],
  newItem = {},
  errors = { item: {} },
  handleItemChange = () => {},
  handleQuantityOrRateChange = () => {},
  handleOpenForm = () => {},
  setNewItem = () => {},
  setSelectedItem = () => {},
  initialNewItemState = {},
  setErrors = () => {}
}) => {
  return (
    <div>
      <SectionHeader title="Item Information" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

        {/* Currency Dropdown */}
        <FormSelect
          label="Currency"
          name="currency"
          value={newItem.currency}
          onChange={handleItemChange}
          options={[
            { value: "NPR", label: "NPR" },
            { value: "USD", label: "USD" },
            { value: "EUR", label: "EUR" }
          ]}
        />

        {/* Item Dropdown with Add Button */}
        <div className="relative">
          <FormSelect
            label="Item Name"
            name="itemId"
            value={newItem.itemId}
            onChange={handleItemChange}
            options={[
              { value: "", label: "Choose Item" },
              ...items.map(i => ({ value: i.id, label: i.name }))
            ]}
            error={errors.item.itemId}
            required
            className={`border-green-500 ring-2 ring-green-200 pr-10 ${
              errors.item.itemId ? "border-red-500 ring-red-200" : ""
            }`}
          />
          <button
            type="button"
            className="absolute right-2 top-9 p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
            onClick={handleOpenForm}
          >
            <PlusIcon size={18} />
          </button>
        </div>

        {/* Quantity Input */}
        <FormInput
          label="Quantity"
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={handleQuantityOrRateChange}
          error={errors.item.quantity}
          required
        />

        {/* Rate Input */}
        <FormInput
          label="Rate"
          name="rate"
          type="number"
          placeholder="Rate"
          value={newItem.rate}
          onChange={handleQuantityOrRateChange}
          error={errors.item.rate}
          required
        />

        {/* Value Display (Read-Only) */}
        <FormInput
          label="Value"
          name="value"
          type="text"
          value={newItem.value}
          readOnly
          className="bg-gray-100"
        />

        {/* Action Buttons */}
        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700"
            onClick={() => {
              setNewItem(initialNewItemState);
              setSelectedItem(null);
              setErrors(prev => ({ ...prev, item: {} }));
            }}
          >
            Clear
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemInformation;
