import React, {useState} from "react";
import {Input, Button, Select, Option} from "@material-tailwind/react";
import {MagnifyingGlassIcon, ArrowPathIcon} from "@heroicons/react/24/outline";

const CommonFilterBar = ({searchPlaceholder = "검색어를 입력하세요", filterConfigs = [], onSearch}) => {
  const [keyword, setKeyword] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleFilterChange = (filterId, value) => {
    setSelectedFilters((prev) => ({...prev, [filterId]: value}));
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    onSearch({keyword, ...selectedFilters});
  };

  const handleReset = () => {
    setKeyword("");
    setSelectedFilters({});
    onSearch({keyword: "", reset: true});
  };

  return (
      <div
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full flex flex-col xl:flex-row gap-4 items-center justify-between"
      >
        {filterConfigs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-3 w-full xl:w-auto">
              {filterConfigs.map((config) => (
                  <div key={config.id} className="w-full sm:min-w-[160px]">
                    <Select
                        label={config.label}
                        value={selectedFilters[config.id] || ""}
                        onChange={(val) => handleFilterChange(config.id, val)}
                    >
                      {config.options.map((opt) => (
                          <Option key={opt.value} value={opt.value}>
                            {opt.label}
                          </Option>
                      ))}
                    </Select>
                  </div>
              ))}
            </div>
        )}

        <form onSubmit={handleSubmit}
              className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full xl:w-auto xl:flex-1 xl:justify-end"
        >
          <div className="w-full sm:w-[250px] shrink-0">
            <Input
                type="text"
                label={searchPlaceholder}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                icon={<MagnifyingGlassIcon className="h-5 w-5"/>}
                crossOrigin={undefined}
            />
          </div>
          <Button type="submit" variant="gradient" color="blue"
                  className="h-10 shrink-0 flex items-center justify-center px-5">
            조회
          </Button>
          <Button variant="outlined" color="blue-gray" className="h-10 shrink-0 flex items-center justify-center px-4"
                  onClick={handleReset}>
            <ArrowPathIcon className="h-5 w-5"/>
          </Button>
        </form>
      </div>
  );
};

export default CommonFilterBar;
