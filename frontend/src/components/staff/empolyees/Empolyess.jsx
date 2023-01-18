import { useState } from "react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  empolyeePagination,
  empolyeeSearchPagination,
} from "../../../store/empolyees-slice";
import Paginate from "../../UI/pagination/Paginate";
import EmpolyeePhases from "../../UI/phase in/out/EmpolyeePhases";
import ExportExcel from "../../UI/export/ExportExcel";

//classes
import classes from "./Empolyess.module.css";

const Empolyess = ({
  data,
  currentPage,
  setCurrentPage,
  searchValue,
  fetchSearchHandler,
}) => {
  const dispatch = useDispatch();
  //states
  const [staffId, setStaffId] = useState("");
  const [showPhasesForm, setShowPhasesForm] = useState(false);

  //empolyee counts
  const { data: empolyeeData } = useSelector((state) => state.empolyeeReducer);
  const empolyeeCount = empolyeeData && empolyeeData.count;

  //set today activity
  const [todayActivity, setTodayActivity] = useState("");

  //paginationFun
  const paginationFun = (obj) => {
    dispatch(empolyeePagination(obj));
  };
  //search behavior
  const searchPagination = (obj) => {
    // //search pagination
    dispatch(empolyeeSearchPagination(obj));
  };

  //show phases
  const showPhasesFormHandler = (id, activity) => {
    //set id
    setStaffId(id);
    setShowPhasesForm(true);
    setTodayActivity(activity);
  };

  //hide phase form
  const hidePhaseFormHandler = () => {
    setShowPhasesForm(false);
  };

  return (
    <Fragment>
      {showPhasesForm && (
        <EmpolyeePhases
          id={staffId}
          today_activity={todayActivity}
          hideForm={hidePhaseFormHandler}
        />
      )}
      <div className={classes["table_content"]}>
        <ExportExcel matter="employees" />
        <table>
          <thead>
            <th>أسم الموظف</th>
            <th>رقم الهاتف</th>
            <th>البريد الاكتروني</th>
            <th>المسمي الوظيفي</th>
            <th>تاريخ التوظيف</th>
            <th>مقر العمل</th>
            <th>التأمين</th>
            <th>عدد الاجازات</th>
            <th>محلاظة</th>
            <th>الحضور</th>
          </thead>

          <tbody>
            {data &&
              data.results &&
              data.results.map((el) => {
                return (
                  <tr key={el.id}>
                    <td>
                      <Link to={`/staff/${el.id}`}>{el.name}</Link>
                    </td>

                    <td> {el.number}</td>
                    <td> {el.email}</td>
                    <td> {el.type}</td>
                    <td> {el.signin_date}</td>
                    <td>
                      {el.store_address === null
                        ? "مقر الشركة"
                        : el.store_address}
                    </td>
                    <td>
                      {el.insurance !== null && (
                        <ul>
                          <li>
                            رقم التأمين : <span>{el.insurance.ins_code} </span>{" "}
                          </li>
                        </ul>
                      )}
                    </td>
                    <td> {el.days_off}</td>
                    <td> {el.note}</td>
                    <td>
                      {el.today_activity !== false &&
                        el.today_activity.phase_in !== null &&
                        el.today_activity.phase_out !== null && (
                          <ul>
                            <li>معاد الحضور : {el.today_activity.phase_in} </li>
                            <li>
                              معاد الانصارف : {el.today_activity.phase_out}
                            </li>
                          </ul>
                        )}

                      {(el.today_activity === false ||
                        el.today_activity.phase_out === null) && (
                        <button
                          style={{
                            backgroundColor:
                              el.today_activity.phase_out === null
                                ? "#da3230"
                                : "green",
                          }}
                          onClick={() =>
                            showPhasesFormHandler(el.id, el.today_activity)
                          }>
                          {(el.today_activity === false ||
                            el.today_activity.phase_in === null) &&
                            "سجل الحضور"}

                          {el.today_activity &&
                            el.today_activity.phase_in !== "" &&
                            el.today_activity.phase_out === null &&
                            "سجل الانصراف"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
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
