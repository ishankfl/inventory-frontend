import { useState } from "react";

const QuantityCard = ({ handleRemoveItem, item, issueId, handleDecrement, handleIncrement }) => {
    console.log("Items", item)



    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">{item.product.name}</h4>
                    <div className="flex items-center space-x-3">
                        <button
                            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition"
                            onClick={() => { handleDecrement(issueId, item.product.id, item.quantityIssued) }}
                            title="Decrease quantity"
                        >
                            -
                        </button>
                        <span className="text-sm text-gray-600">Qty: {item.quantityIssued}</span>
                        <button
                            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition"
                            onClick={() => { handleIncrement(issueId, item.product.id, item.quantityIssued) }}
                            title="Increase quantity"
                        >
                            +
                        </button>
                    </div>
                </div>
                <button
                    className="ml-4 w-8 h-8 flex items-center justify-center hover:bg-red-50 hover:text-red-500 rounded-full transition-colors duration-200"
                    title="Remove product"
                    onClick={() => { handleRemoveItem(item.product.id, item.quantityissued) }}
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default QuantityCard;
