import { useState } from "react";
import { Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthContext from "../../../context/Auth-ctx";
import classes from "./Empolyess.module.css";
import {
  empolyeePagination,
  empolyeeSearchPagination,
  getEmpolyees,
} from "../../../store/empolyees-slice";
import Paginate from "../../UI/pagination/Paginate";
import EmpolyeePhases from "../../UI/phase in/out/EmpolyeePhases";
import { useQuery } from "react-query";

const Empolyess = ({
  data,
  currentPage,
  setCurrentPage,
  searchValue,
  fetchSearchHandler,
  staffForm,
}) => {
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  //states
  const [staffId, setStaffId] = useState("");
  const [showPhasesForm, setShowPhasesForm] = useState(false);

  //empolyee counts
  const { data: empolyeeData } = useSelector((state) => state.empolyeeReducer);
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

  //show phases
  const showPhasesFormHandler = (id) => {
    //set id
    setStaffId(id);
    setShowPhasesForm(true);
  };

  //hide phase form
  const hidePhaseFormHandler = () => {
    setShowPhasesForm(false);
  };

  return (
    <Fragment>
      {showPhasesForm && (
        <EmpolyeePhases id={staffId} hideForm={hidePhaseFormHandler} />
      )}
      <div className={classes["table_content"]}>
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
                      <button onClick={() => showPhasesFormHandler(el.id)}>
                        سجل حضور
                      </button>
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
