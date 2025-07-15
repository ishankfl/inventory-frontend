   const SectionHeader = ({ title, icon }) => (
        <div className="flex items-start gap-4 mb-4">
            <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
            {icon && <span className="text-blue-600 bg-blue-100 rounded-full p-1">{icon}</span>}
        </div>
    );
    export default SectionHeader;