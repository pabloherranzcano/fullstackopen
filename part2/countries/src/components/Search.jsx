const Search = ({searchName, onChange}) => {
  return (
    <>
      Find countries <input value={searchName} onChange={onChange} />
    </>
  );
};

export default Search;