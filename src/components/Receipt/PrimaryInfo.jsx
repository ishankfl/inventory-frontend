import SectionHeader from "./SectionHeader";

const PrimaryInfoBox = ({
    vendors = [],
    primaryInfo = {},
    errors = { primary: {} },
    handlePrimaryChange = () => { },
}) => {
    return (
        <div>
            <SectionHeader title="Primary Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Entry Of */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Entry Of</label>
                    <select
                        name="entryOf"
                        value={primaryInfo.entryOf}
                        onChange={handlePrimaryChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3 ${errors.primary.entryOf ? "border-red-500" : ""
                            }`}
                    >
                        <option value="PURCHASE">PURCHASE</option>
                        <option value="SALE">SALE</option>
                    </select>
                    {errors.primary.entryOf && (
                        <p className="mt-1 text-sm text-red-600">{errors.primary.entryOf}</p>
                    )}
                </div>

                {/* Receipt No (read-only) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Receipt #</label>
                    <input
                        type="text"
                        name="receiptNo"
                        value={primaryInfo.receiptNo}
                        onChange={handlePrimaryChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3 bg-gray-100 ${errors.primary.receiptNo ? "border-red-500" : ""
                            }`}
                        readOnly
                    />
                    {errors.primary.receiptNo && (
                        <p className="mt-1 text-sm text-red-600">{errors.primary.receiptNo}</p>
                    )}
                </div>

                {/* Receipt Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Receipt Date (AD) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="receiptDateAD"
                        value={primaryInfo.receiptDateAD}
                        onChange={handlePrimaryChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3 ${errors.primary.receiptDateAD ? "border-red-500" : ""
                            }`}
                        required
                    />
                    {errors.primary.receiptDateAD && (
                        <p className="mt-1 text-sm text-red-600">{errors.primary.receiptDateAD}</p>
                    )}
                </div>

                {/* Bill No */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Bill Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="billNo"
                        value={primaryInfo.billNo}
                        onChange={handlePrimaryChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3 ${errors.primary.billNo ? "border-red-500" : ""
                            }`}
                        required
                    />
                    {errors.primary.billNo && (
                        <p className="mt-1 text-sm text-red-600">{errors.primary.billNo}</p>
                    )}
                </div>

                {/* Bill Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Bill Date (AD)</label>
                    <input
                        type="date"
                        name="billDateAD"
                        value={primaryInfo.billDateAD}
                        onChange={handlePrimaryChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3 ${errors.primary.billDateAD ? "border-red-500" : ""
                            }`}
                    />
                    {errors.primary.billDateAD && (
                        <p className="mt-1 text-sm text-red-600">{errors.primary.billDateAD}</p>
                    )}
                </div>

                {/* Vendor */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Vendor <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="vendor"
                        value={primaryInfo.vendor}
                        onChange={handlePrimaryChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3 ${errors.primary.vendor ? "border-red-500" : ""
                            }`}
                        required
                    >
                        <option value="">Select Vendor</option>
                        {vendors.map((v) => (
                            <option key={v.id} value={v.id}>
                                {v.name}
                            </option>
                        ))}
                    </select>
                    {errors.primary.vendor && (
                        <p className="mt-1 text-sm text-red-600">{errors.primary.vendor}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrimaryInfoBox;
