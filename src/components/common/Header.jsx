import { Plus } from "lucide-react";

const Header = ({ handleButton, title, description, btnTitle }) => {
  return (
    // <div>
      <div className="flex mb-6 justify-between w-[100%]">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
        <button
          onClick={handleButton}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-md"
        >
          <Plus className="h-5 w-5" />
          <span>{btnTitle}</span>
        </button>
      </div>
    // </div>
  );
};

export default Header;
