"use client";

import SearchIcon from "@mui/icons-material/Search";

interface Process {
  id: number;
  name: string;
  effectiveDate: string;
  active: boolean;
}

interface SearchProps {
  placeholder: string;
  tableData: Process[];
  setTableData: React.Dispatch<React.SetStateAction<Process[]>>;
}

const Search: React.FC<SearchProps> = ({
  placeholder,
  tableData,
  setTableData,
}) => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    const filteredData = tableData.filter((process) =>
      process.name.toLowerCase().includes(searchValue) 
    );
    setTableData(filteredData);
  };

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <input
        className="peer block w-[300px]  rounded-md border border-grey-400 py-[9px] pl-10 text-sm outline-0 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={handleSearch}
      />
      <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-dark-900" />
    </div>
  );
};

export default Search;
