import { FaSearch } from 'react-icons/fa';

const SearchBox = ({ value, onChange, label }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    return (
        <div className="flex items-center justify-center border border-gray-300 rounded px-2 w-[20%] py-3 bg-white">
            <FaSearch className="text-gray-500 mr-2" />
            <input
                type="text"
                placeholder={`Search ${label}...`}
                className="flex-1 !outline-none !border-none m-0 p-0"
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default SearchBox;