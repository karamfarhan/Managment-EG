import { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
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
  const location = useLocation();
  const { pathname } = location;
  const { token } = useSelector((state) => state.authReducer);

  const decoded = jwt_decode(token);
  const { is_superuser, permissions } = decoded;
  const empolyeePremission = [
    "change_employee",
    "delete_employee",
    "view_employeeactivity",
    "change_employeeactivity",
    "delete_employeeactivity",
    "view_employee",
  ];
  const getStaff = permissions.some((el) => empolyeePremission.includes(el));

  //current page
  const [currentPage, setCurrentPage] = useState(1);
  //show staff form
  const [staffForm, setStaffForm] = useState(false);
  //search
  const [searchValue, setSearchValue] = useState("");

  //data
  const { data: empolyees } = useSelector((state) => state.empolyeeReducer);
  console.log(empolyees);
  //fetch search data
  //get stores
  useEffect(() => {
    if (
      currentPage === 1 &&
      searchValue.trim() === "" &&
      staffForm === false &&
      (getStaff || is_superuser)
    ) {
      dispatch(getEmpolyees(token));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    currentPage,
    searchValue,
    staffForm,
    pathname,
    getStaff,
    is_superuser,
  ]);

  function fetchSearchHandler() {
    setCurrentPage(1);
    const obj = {
      token,
      search: searchValue,
    };
    // if true allow search empolyee
    if (getEmpolyees || is_superuser === true) {
      dispatch(empolyeeSearch(obj));
    }
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
            {(is_superuser || getStaff) && (
              <Search
                placeholder="أبحث عن أسم الموظف أو الموقع"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                searchData={fetchSearchHandler}
              />
            )}
            {(is_superuser || permissions.includes("add_employee")) && (
              <button
                className={classes.btn}
                onClick={() => setStaffForm(true)}>
                انشاء موظف
                <span>
                  <AiOutlineUserAdd />
                </span>
              </button>
            )}
          </div>
        </Bar>
      )}
      <Routes>
        <Route path={`/edit/:empId`} element={<EditEmpolyee />} />
      </Routes>
      {(is_superuser || permissions.includes("add_employee")) && staffForm && (
        <StaffForm setStaffForm={setStaffForm} />
      )}
      {!staffForm &&
        empolyees &&
        empolyees.count > 0 &&
        location.pathname === "/staff" &&
        (is_superuser || getStaff) && (
          <Empolyess
            decoded={decoded}
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
