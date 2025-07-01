import { useState } from "react";

const QuantityCard = ({ handleRemoveItem, item, issueId, handleDecrement, handleIncrement }) => {
    console.log("Items", item)



    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">{item.product.name}</h4>
                    <div className="flex items-center space-x-3">
                        <div
                            className="px-3 py-2 rounded-[100%]  text-black text-bold hover:bg-gray-300 transition"
                            onClick={() => { handleDecrement(issueId, item.product.id, item.quantityIssued) }}
                            title="Decrease quantity"
                        >
                            -
                        </div>
                        <span className="text-sm text-gray-600">Qty: {item.quantityIssued}</span>
                        <div
                            className="px-3 py-2  rounded-[100%] text-black text-bold  hover:bg-gray-300 transition"
                            onClick={() => { handleIncrement(issueId, item.product.id, item.quantityIssued) }}
                            title="Increase quantity"
                        >
                            +
                        </div>
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
