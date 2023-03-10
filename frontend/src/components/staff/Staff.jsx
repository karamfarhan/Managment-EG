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
    if (
      currentPage === 1 &&
      searchValue.trim() === "" &&
      (getStaff || is_superuser) &&
      isAuth === true
    ) {
      dispatch(getEmpolyees(token));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentPage, searchValue, getStaff, is_superuser, isAuth]);

  function fetchSearchHandler() {
    setCurrentPage(1);
    const obj = {
      token,
      search: searchValue,
    };
    // if true allow search empolyee
    if (getStaff || is_superuser === true) {
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
    <Fragment>
      {/* create staff */}
      {showStaffForm && <StaffForm setStaffForm={setShowStaffForm} />}

      <div>
        {!showStaffForm && location.pathname === "/staff" && (
          <Bar>
            <div className="toolBar">
              {(is_superuser || getStaff) && (
                <Search
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  searchData={fetchSearchHandler}
                />
              )}
              {(permissions.includes("add_employee") || is_superuser) && (
                <button
                  className={classes.btn}
                  onClick={() => setShowStaffForm(true)}
                >
                  <span>
                    <AiOutlineUserAdd />{" "}
                  </span>
<<<<<<< HEAD
                  {t("addEmployee")}
=======
                  Add employee
>>>>>>> c9f6c2a (charts_part_one)
                </button>
              )}
            </div>
          </Bar>
        )}
        <Routes>
          <Route path={`/edit/:empId`} element={<EditEmpolyee />} />
        </Routes>
        {!showStaffForm &&
          empolyees &&
          empolyees.count === 0 &&
          (is_superuser || getStaff) && <h2>{t("noEmployees")}</h2>}
        {empolyees &&
          !showStaffForm &&
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
            />
          )}
      </div>
    </Fragment>
  );
};
