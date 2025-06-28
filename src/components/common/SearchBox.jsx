import { FaSearch } from 'react-icons/fa';

const SearchBox = ({ handleSearchFilter, label }) => {
    return <div className="flex items-center justify-center border border-gray-300 rounded px-2 w-[20%]">
        <FaSearch className="text-gray-500 mr-2 " />
        <input
            type="text"
            className="flex-1 !outline-none !border-none m-0 p-0"
            placeholder={`Enter ${label} name`}
            onChange={(e) => {
                handleSearchFilter(e.target.value)
            }}
        />
    </div>
}
export default SearchBox;