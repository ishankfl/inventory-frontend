// src/components/receipt/useReceipt.js
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import {
  fetchAllVendors,
  fetchAllItems,
  fetchReceiptById,
  createReceipt,
  updateReceipt,
} from '../../api/receipt';
import {
  itemSchema,
  validateItem,
  validatePrimaryInfo,
  primaryInfoSchema,
} from '../../utils/yup/receipt-form.vaid';

const initialPrimaryInfo = {
  entryOf: 'PURCHASE',
  stockFlowTo: 'STORE',
  receiptId: '',
  receiptDateAD: new Date().toISOString().split('T')[0],
  receiptDateBS: '',
  fiscalYear: '2081-2082',
  purchaseType: 'CREDIT',
  billNo: '',
  billDateAD: new Date().toISOString().split('T')[0],
  billDateBS: '',
  vendor: '',
};

const initialNewItemState = {
  currency: 'NPR',
  itemId: '',
  itemGroup: '',
  uom: '',
  isComplimentary: 'NO',
  taxStructure: '',
  quantity: '',
  rate: '',
  value: '',
  discountPercent: '',
  discountAmount: '0.00',
};

export const useReceipt = (isEdit = false) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [newItem, setNewItem] = useState(initialNewItemState);
  const [primaryInfo, setPrimaryInfo] = useState(initialPrimaryInfo);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [randomForReceipt, setRandomForReceipt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ primary: {}, item: {} });

  useEffect(() => {
    getVendors();
    getItems();
    if (!isEdit) generateRandom();
    else loadReceiptData();
  }, [id]);

  const generateRandom = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '#__';
    for (let i = 0; i < 12; i++)
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    setRandomForReceipt(result);
  };

  const loadReceiptData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchReceiptById(id);
      if (response.data) {
        const receipt = response.data;
        const receiptDate = new Date(receipt.receiptDate).toISOString().split('T')[0];

        setPrimaryInfo(prev => ({
          ...prev,
          receiptId: receipt.id,
          receiptDateAD: receiptDate,
          billNo: receipt.billNo,
          billDateAD: receiptDate,
          vendor: receipt.vendorId,
        }));

        const formattedItems = receipt.receiptDetails.map(item => ({
          tempId: `${item.id}-${Date.now()}`,
          id: item.id,
          itemId: item.itemId,
          itemName: item.item?.name || 'Unknown Item',
          currency: 'NPR',
          itemGroup: item.item?.itemGroup || '',
          uom: item.item?.unit || '',
          isComplimentary: 'NO',
          taxStructure: '',
          quantity: item.quantity.toString(),
          rate: item.rate.toString(),
          value: (item.quantity * item.rate).toFixed(2),
          discountPercent: '0',
          discountAmount: '0.00',
        }));

        setAddedItems(formattedItems);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getVendors = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllVendors();
      if (response.status === 200) {
        setVendors(response.data.data);
        if (!isEdit && response.data.data.length > 0) {
          setPrimaryInfo(prev => ({
            ...prev,
            vendor: response.data.data[0].id.toString(),
          }));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllItems();
      if (response.status === 200) setItems(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrimaryChange = async e => {
    const { name, value } = e.target;
    setPrimaryInfo(prev => ({ ...prev, [name]: value }));

    if (errors.primary[name]) {
      try {
        await Yup.reach(primaryInfoSchema, name).validate(value);
        setErrors(prev => ({
          ...prev,
          primary: { ...prev.primary, [name]: undefined },
        }));
      } catch (err) {
        setErrors(prev => ({
          ...prev,
          primary: { ...prev.primary, [name]: err.message },
        }));
      }
    }
  };

  const handleItemChange = async e => {
    const { name, value } = e.target;
    setNewItem(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'itemId') {
        const selected = items.find(i => i.id.toString() === value);
        if (selected) {
          updated.itemGroup = selected.itemGroup || '';
          updated.uom = selected.uom || '';
          updated.rate = selected.price || '';
          setSelectedItem(selected);
        }
      }
      return updated;
    });

    if (errors.item[name]) {
      try {
        await Yup.reach(itemSchema, name).validate(value);
        setErrors(prev => ({
          ...prev,
          item: { ...prev.item, [name]: undefined },
        }));
      } catch (err) {
        setErrors(prev => ({
          ...prev,
          item: { ...prev.item, [name]: err.message },
        }));
      }
    }
  };

  const handleQuantityOrRateChange = async e => {
    const { name, value } = e.target;
    setNewItem(prev => {
      const updated = { ...prev, [name]: value };
      const qty = parseFloat(updated.quantity) || 0;
      const rate = parseFloat(updated.rate) || 0;
      updated.value = (qty * rate).toFixed(2);
      return updated;
    });

    if (errors.item[name]) {
      try {
        await Yup.reach(itemSchema, name).validate(value);
        setErrors(prev => ({
          ...prev,
          item: { ...prev.item, [name]: undefined },
        }));
      } catch (err) {
        setErrors(prev => ({
          ...prev,
          item: { ...prev.item, [name]: err.message },
        }));
      }
    }
  };

  const handleAddItem = async e => {
    e.preventDefault();
    const isValid = await validateItem(setErrors, newItem);
    if (!isValid) return;

    const selected = items.find(i => i.id.toString() === newItem.itemId);
    if (!selected) return alert('Selected item not found');

    const itemToAdd = {
      ...newItem,
      tempId: Date.now(),
      itemName: selected.name,
    };

    const existingIndex = addedItems.findIndex(item => item.itemId === newItem.itemId);
    const updatedItems = [...addedItems];

    if (existingIndex >= 0) updatedItems[existingIndex] = itemToAdd;
    else updatedItems.push(itemToAdd);

    setAddedItems(updatedItems);
    setNewItem(initialNewItemState);
    setSelectedItem(null);
  };

  const handleRemoveItem = tempId => {
    setAddedItems(prev => prev.filter(item => item.tempId !== tempId));
  };

  const calculateTotal = () =>
    addedItems
      .reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0)
      .toFixed(2);

  const handleSubmitReceipt = async () => {
    if (!isEdit) primaryInfo.receiptId = randomForReceipt;

    const isPrimaryValid = await validatePrimaryInfo(setErrors, primaryInfo);
    if (!isPrimaryValid || addedItems.length === 0) {
      if (addedItems.length === 0) {
        return { success: false, message: 'Please add at least one item' };
      }
      return { success: false, message: 'Primary information is invalid' };
    }

    const receiptData = {
      id: isEdit ? id : randomForReceipt,
      receiptId: primaryInfo.receiptId,
      receiptDate: primaryInfo.receiptDateAD,
      billNo: primaryInfo.billNo,
      vendorId: primaryInfo.vendor,
      receiptDetails: addedItems.map(item => ({
        id: item.id || undefined,
        itemId: item.itemId,
        quantity: parseFloat(item.quantity),
        rate: parseFloat(item.rate),
      })),
    };

    try {
      setIsLoading(true);
      const response = isEdit
        ? await updateReceipt(receiptData.id, receiptData)
        : await createReceipt(receiptData);

      if (response.data) {
        return { success: true };
      }
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
    handleSubmitReceipt,
    calculateTotal,
  };
};
