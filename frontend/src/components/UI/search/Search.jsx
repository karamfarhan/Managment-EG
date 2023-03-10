<<<<<<< HEAD
=======
import Inputs from "../inputs/Inputs";
>>>>>>> c9f6c2a (charts_part_one)
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
<<<<<<< HEAD
        <button className={classes.searchButton} onClick={submitHander}>
          <AiOutlineSearch />
        </button>
      </div>
=======
        <button type="submit">
          <AiOutlineSearch />
        </button>
      </form>
>>>>>>> c9f6c2a (charts_part_one)
    </div>
  );
};

export default Search;
