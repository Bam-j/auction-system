import React, {useState} from "react";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";

const CommonSearchInput = ({
                             onSearch,
                             placeholder = "검색어 입력...",
                             className = ""
                           }) => {
  const [keyword, setKeyword] = useState("");

  const triggerSearch = () => {
    if (onSearch) {
      onSearch(keyword);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      triggerSearch();
    }
  };

  return (
      <div className={`relative w-full max-w-[320px] ${className}`}>
        <input
            type="text"
            className="w-full h-10 pl-4 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
            placeholder={placeholder}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
        />

        <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
            onClick={triggerSearch}
            aria-label="Search"
        >
          <MagnifyingGlassIcon className="h-5 w-5"/>
        </button>
      </div>
  );
};

export default CommonSearchInput;