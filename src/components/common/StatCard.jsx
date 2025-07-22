const StatCard = ({ title, value, icon, bg = "bg-primary" }) => (
  <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100 w-full">
    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
      <div className="text-center md:text-left">
        <h3 className="text-sm md:text-base font-medium text-gray-500 mb-1">{title}</h3>
        <p className="text-xl md:text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`${bg} p-3 md:p-4 rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </div>
);

export default StatCard;
