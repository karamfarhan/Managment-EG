import { useState, useEffect, Fragment } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import jwt_decode from "jwt-decode";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import Empolyess from "./empolyees/Empolyess";
import Bar from "../UI/bars/Bar";
import { empolyeeSearch, getEmpolyees } from "../../store/empolyees-slice";
import Search from "../UI/search/Search";
import StaffForm from "./staff-form/StaffForm";
import EditEmpolyee from "./empolyees/edit-empolyee/EditEmpolyee";
import classes from "./Staff.module.css";
export const Staff = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token } = useSelector((state) => state.authReducer);
  const [t, i18n] = useTranslation();
  const decoded = jwt_decode(token);
  //const { is_superuser, permissions } = decoded;
  const empolyeePremission = [
    "change_employee",
    "delete_employee",
    "view_employeeactivity",
    "change_employeeactivity",
    "delete_employeeactivity",
    "view_employee",
  ];
  //const getStaff = permissions.some((el) => empolyeePremission.includes(el));

  const [showStaffForm, setShowStaffForm] = useState(false);

  //current page
  const [currentPage, setCurrentPage] = useState(1);

  //search
  const [searchValue, setSearchValue] = useState("");
  //data
  const { data: empolyees } = useSelector((state) => state.empolyeeReducer);

  const isAuth = useSelector((state) => state.authReducer.isAuth);
  //fetch search data
  //get stores
  useEffect(() => {
    if (currentPage === 1 && searchValue.trim() === "" && isAuth === true) {
      console.log(token);
      dispatch(getEmpolyees(token));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentPage, searchValue, isAuth]);

  function fetchSearchHandler() {
    setCurrentPage(1);
    // const obj = {
    //   token,
    //   search: searchValue,
    // };
    // if true allow search empolyee
    // if (getStaff || is_superuser === true) {
    //   dispatch(empolyeeSearch(obj));
    // }
  }

  let result =
    empolyees &&
    empolyees.results &&
    empolyees.results.employees.reduce(function (r, a) {
      r[a.location && a.location.store_address && a.location.store_address] =
        r[a.location && a.location.store_address && a.location.store_address] ||
        [];
      r[
        a.location && a.location.store_address && a.location.store_address
      ].push(a);
      return r;
    }, Object.create(null));

  console.log(result);
  return (
    <Fragment>
      {/* create staff */}
      {showStaffForm && <StaffForm setStaffForm={setShowStaffForm} />}

      <div>
        {!showStaffForm && location.pathname === "/staff" && (
          <Bar>
            <div className="toolBar">
              <Search
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                searchData={fetchSearchHandler}
              />

              <button
                className={classes.btn}
                onClick={() => setShowStaffForm(true)}
              >
                <span>
                  <AiOutlineUserAdd />{" "}
                </span>
                {t("addEmployee")}
              </button>
            </div>
          </Bar>
        )}
        <Routes>
          <Route path={`/edit/:empId`} element={<EditEmpolyee />} />
        </Routes>
        {!showStaffForm && empolyees && empolyees.count === 0 && (
          <h2>{t("noEmployees")}</h2>
        )}
        {empolyees &&
          empolyees.results &&
          !showStaffForm &&
          empolyees.count > 0 &&
          location.pathname === "/staff" && (
            <Empolyess
              decoded={decoded}
              data={result}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              searchValue={searchValue}
              fetchSearchHandler={fetchSearchHandler}
            />
          )}
      </div>
    </Fragment>
  );
};
