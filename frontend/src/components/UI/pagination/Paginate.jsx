import { useSelector } from "react-redux";
import { Pagination } from "antd";

import classes from "./Paginate.module.css";

const Paginate = ({
  setCurrentPage,
  currentPage,
  count,
  paginationFun,
  search,
  searchPagination,
  searchFn,
  id,
}) => {
  const { token } = useSelector((state) => state.authReducer);

  const paginationHandler = (number) => {
    const obj = {
      page: number,
      token,
      id,
    };

    // store current page in session storage
    // sessionStorage.setItem("current-page", number);
    if (number > 1 && search === "") {
      paginationFun(obj);
    }
    if (number > 1 && search && search !== "") {
      obj.search = search;
      searchPagination(obj);
    }
    if (number === 1 && search && search !== "") {
      searchFn();
    }
    setCurrentPage(number);
  };

  return (
    <div className={classes.pagination}>
      <Pagination
        onChange={(value) => paginationHandler(value)}
        pageSize={10}
        total={count}
        current={currentPage}
      />
    </div>
  );
};

export default Paginate;
