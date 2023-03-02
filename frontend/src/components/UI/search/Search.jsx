import { AiOutlineSearch } from "react-icons/ai";
import classes from "./Search.module.css";

const Search = ({ value, onChange, searchData }) => {
  const submitHander = () => {
    if (value === "") return;
    searchData();
  };
  return (
    <div className={classes.wrap} dir="ltr">
      <div className={classes.search}>
        <input
          type="search"
          className={classes.searchTerm}
          value={value}
          onChange={onChange}
        />
        <button className={classes.searchButton} onClick={submitHander}>
          <AiOutlineSearch />
        </button>
      </div>
    </div>
  );
};

export default Search;
