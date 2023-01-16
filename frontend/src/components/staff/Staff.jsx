import { useContext, useState } from "react";
import { useQuery } from "react-query";
import Bar from "../UI/bars/Bar";
import { AiOutlineUserAdd } from "react-icons/ai";

//style
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StaffForm from "./staff-form/StaffForm";
import AuthContext from "../../context/Auth-ctx";
import Empolyess from "./empolyees/Empolyess";
import classes from "./Staff.module.css";
import { empolyeeSearch, getEmpolyees } from "../../store/empolyees-slice";
import Search from "../UI/search/Search";

export const Staff = () => {
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const { token } = authCtx;
  //current page
  const [currentPage, setCurrentPage] = useState(1);
  //show staff form
  const [staffForm, setStaffForm] = useState(false);
  //search
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    dispatch(getEmpolyees(token));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  //data
  const { data: empolyees } = useSelector((state) => state.empolyeeReducer);
  //fetch search data
  function fetchSearchHandler() {
    setCurrentPage(1);
    const obj = {
      token,
      search: searchValue,
    };

    dispatch(empolyeeSearch(obj));
  }
  return (
    <div dir="rtl">
      {!staffForm && (
        <Bar>
          <div className="toolBar">
            <Search
              placeholder="أبحث عن أسم الموظف أو الموقع"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              searchData={fetchSearchHandler}
            />
            <button className={classes.btn} onClick={() => setStaffForm(true)}>
              انشاء موظف
              <span>
                <AiOutlineUserAdd />
              </span>
            </button>
          </div>
        </Bar>
      )}

      {staffForm && <StaffForm setStaffForm={setStaffForm} />}
      {!staffForm && (
        <Empolyess
          data={empolyees}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          searchValue={searchValue}
          fetchSearchHandler={fetchSearchHandler}
        />
      )}
    </div>
  );
};
