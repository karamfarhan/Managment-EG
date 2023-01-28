import { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Bar from "../UI/bars/Bar";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import StaffForm from "./staff-form/StaffForm";
import Empolyess from "./empolyees/Empolyess";
import { empolyeeSearch, getEmpolyees } from "../../store/empolyees-slice";
import Search from "../UI/search/Search";
import EditEmpolyee from "./empolyees/edit-empolyee/EditEmpolyee";
import classes from "./Staff.module.css";
export const Staff = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authReducer);

  const location = useLocation();
  const { pathname } = location;

  //current page
  const [currentPage, setCurrentPage] = useState(1);
  //show staff form
  const [staffForm, setStaffForm] = useState(false);
  //search
  const [searchValue, setSearchValue] = useState("");

  //data
  const { data: empolyees } = useSelector((state) => state.empolyeeReducer);
  //fetch search data
  //get stores
  useEffect(() => {
    if (currentPage === 1 && searchValue.trim() === "" && staffForm === false) {
      dispatch(getEmpolyees(token));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentPage, searchValue, staffForm, pathname]);
  function fetchSearchHandler() {
    setCurrentPage(1);
    const obj = {
      token,
      search: searchValue,
    };

    dispatch(empolyeeSearch(obj));
  }

  let result =
    empolyees &&
    empolyees.results &&
    empolyees.results.reduce(function (r, a) {
      r[a.store_address] = r[a.store_address] || [];
      r[a.store_address].push(a);
      return r;
    }, Object.create(null));

  return (
    <div dir="rtl">
      {!staffForm && location.pathname === "/staff" && (
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
      <Routes>
        <Route path={`/edit/:empId`} element={<EditEmpolyee />} />
      </Routes>
      {staffForm && <StaffForm setStaffForm={setStaffForm} />}
      {!staffForm &&
        empolyees &&
        empolyees.count > 0 &&
        location.pathname === "/staff" && (
          <Empolyess
            data={result}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            searchValue={searchValue}
            fetchSearchHandler={fetchSearchHandler}
            staffForm={staffForm}
          />
        )}
    </div>
  );
};
