import React, { useState, useRef, useEffect } from "react";

export default function CustomSearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Choose Item",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="border border-gray-300 rounded px-3 py-2 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "" : "text-gray-400"}>
          {value ? value.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
          />
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleOptionClick(opt)}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
