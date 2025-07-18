import { FaSearch } from 'react-icons/fa';

const SearchBox = ({ value, onChange, label = 'Items', onSearch }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (onSearch) onSearch();
        }
    };

    const handleSearchClick = () => {
        if (onSearch) onSearch();
    };

    return (
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white w-full sm:w-[300px]">
            <button onClick={handleSearchClick} type="button" className="!p-0 !m-0 bg-[#FFFFFF00] text-gray-500 mr-2">
                <FaSearch />
            </button>
            <input
                type="text"
                placeholder={`Search ${label}...`}
                className="!p-1 !m-1 flex-1 outline-none border-none bg-transparent text-sm"
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                aria-label={`Search ${label}`}
            />
        </div>
    );
};

export default SearchBox;
