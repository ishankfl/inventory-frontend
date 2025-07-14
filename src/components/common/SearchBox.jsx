import { FaSearch } from 'react-icons/fa';

const SearchBox = ({ handleSearchFilter, label }) => {
    return <div className="flex items-center justify-center border border-gray-300 rounded px-2 w-[20%] py-4">
        <FaSearch className="text-gray-500 mr-2 " />
        <input
            type="text"
            placeholder={`Enter ${label} details`}
            className="flex-1 !outline-none !border-none m-0 p-0"

            onChange={(e) => handleSearchFilter(e.target.value)}
        />

    </div>
}
export default SearchBox;