import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  empolyeePagination,
  empolyeeSearchPagination,
} from "../../../store/empolyees-slice";
import Paginate from "../../UI/pagination/Paginate";
import ExportExcel from "../../UI/export/ExportExcel";
import LoadingSpinner from "../../UI/loading/LoadingSpinner";
//classes
import classes from "./Empolyess.module.css";
import Phases from "../../UI/phases/Phases";
import { useTranslation } from "react-i18next";

const Empolyess = ({
  data,
  currentPage,
  setCurrentPage,
  searchValue,
  fetchSearchHandler,
  decoded,
}) => {
  const [t, i18n] = useTranslation();

  const dispatch = useDispatch();

  //empolyee counts
  const { data: empolyeeData, isLoading } = useSelector(
    (state) => state.empolyeeReducer
  );
  const empolyeeCount = empolyeeData && empolyeeData.count;

  //paginationFun
  const paginationFun = (obj) => {
    dispatch(empolyeePagination(obj));
  };
  //search behavior
  const searchPagination = (obj) => {
    // //search pagination
    dispatch(empolyeeSearchPagination(obj));
  };

  return (
    <Fragment>
      <div className={classes["table_content"]}>
        {!isLoading && <ExportExcel matter="employees" />}
        {isLoading && <LoadingSpinner />}
        {data &&
          !isLoading &&
          Object.entries(data).map(([key, value], i) => {
            return (
              <div key={i}>
                <h2>
                  {t("employeeDetection")} (
                  {key === "null" ? "المكتب الاداري" : key}){" "}
                </h2>
                <div className={classes.content}>
                  <table>
                    <thead>
                      <th>{t("employeeName")}</th>
                      <th> {t("type")} </th>
                      {/* <th> {t("phases")} </th> */}
                    </thead>
                    {value.map((e, i) => {
                      return (
                        <tbody key={i}>
                          <tr>
                            <td>
                              <Link to={`/staff/${e._id}`}>{e.name}</Link>
                            </td>
                            <td> {e.job} </td>
                          </tr>
                        </tbody>
                      );
                    })}
                  </table>
                </div>
              </div>
            );
          })}

        {empolyeeCount > 10 && (
          <Paginate
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            count={empolyeeCount}
            search={searchValue}
            paginationFun={paginationFun}
            searchPagination={searchPagination}
            searchFn={fetchSearchHandler}
          />
        )}
      </div>
    </Fragment>
  );
};

export default Empolyess;
