import Inputs from "../inputs/Inputs";
import { AiOutlineSearch } from "react-icons/ai";
import classes from "./Search.module.css";

const Search = ({ value, onChange, searchData, placeholder }) => {
  const submitHander = (e) => {
    e.preventDefault();
    searchData();
  };
  return (
    <div className={classes.search}>
      <form onSubmit={submitHander}>
        <Inputs
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button type="submit">
          <AiOutlineSearch />
        </button>
      </form>
    </div>
  );
};

export default Search;
