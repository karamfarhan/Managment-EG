import Inputs from "../inputs/Inputs";
import classes from "./Search.module.css";

const Search = ({ value, onChange, searchData }) => {
  const submitHander = (e) => {
    e.preventDefault();
    searchData();
  };
  return (
    <div className={classes.search}>
      <form onSubmit={submitHander}>
        <Inputs
          type="search"
          placeholder=" أبحث من خلال اسم الموقع أو أسم الموظف"
          value={value}
          onChange={onChange}
        />
        <button type="submit">بحث</button>
      </form>
    </div>
  );
};

export default Search;
