import { useContext } from "react";
import { Pagination } from "antd";
import AuthContext from "../../../context/Auth-ctx";

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
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;

  const paginationHandler = (number) => {
    const obj = {
      page: number,
      token,
      id,
    };

    // store current page in session storage
    // sessionStorage.setItem("current-page", number);
    if ((number > 1 && search && search.trim() === "") || number > 1) {
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
