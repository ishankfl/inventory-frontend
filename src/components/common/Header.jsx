import { Plus } from "lucide-react";

const Header = ({ handleButton, title, description, btnTitle }) => {
  return (
    <div className="flex flex-row sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 w-full mt-8 lg:mt-0 md:mt-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-1">{title}</h1>
        <p className="text-gray-600 text-sm sm:text-base">{description}</p>
      </div>

      <button
        onClick={handleButton}
        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm sm:text-base font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-md shadow transition duration-200"
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>{btnTitle}</span>
      </button>
    </div>
  );
};

export default Header;
