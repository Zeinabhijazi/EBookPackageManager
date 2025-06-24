interface SearchProps {
  placeholder: string;
  onSearch: (query: string) => void;
}

const PackageSearch: React.FC<SearchProps> = ({ placeholder, onSearch }) => {
  //Update the state when the search input changes.
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className="relative flex flex-1 flex-shrink-0 ml-2">
      <input
        className="ml-auto peer block w-[300px] rounded-md border border-grey-400 py-[2px] pl-3 text-sm outline-0 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={handleSearch}
      />
    </div>
  );
};

export default PackageSearch;
