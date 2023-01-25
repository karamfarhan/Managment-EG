import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  empolyeePagination,
  empolyeeSearchPagination,
  getEmpolyees,
} from "../../../store/empolyees-slice";
import Paginate from "../../UI/pagination/Paginate";
import ExportExcel from "../../UI/export/ExportExcel";

//classes
import classes from "./Empolyess.module.css";
import { useQuery } from "react-query";
import { Fragment } from "react";

const Empolyess = ({
  data,
  currentPage,
  setCurrentPage,
  searchValue,
  fetchSearchHandler,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);

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
  const today = new Date();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  //get locations
  //select locations
  const { data: stores } = useQuery(
    "fetch/locations",
    async () => {
      const res = await fetch("http://127.0.0.1:8000/stores/select_list/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      return data;
    },
    { refetchOnWindowFocus: false }
  );

  //send phase/in
  const sendPhaseIn = async (id) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/employees/${id}/activity/`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            phase_in: time,
          }),
        }
      );
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        dispatch(getEmpolyees(token));
      }

      return await res.json();
    } catch (err) {}
  };

  //send phase out
  const sendPhaseOut = async (id, today_activity) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/employees/${id}/activity/`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            phase_out: time,
            id: today_activity,
          }),
        }
      );
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        dispatch(getEmpolyees(token));
      }

      return await res.json();
    } catch (err) {}
  };
  console.log(stores);
  console.log(data);

  return (
    <Fragment>
      <div className={classes["table_content"]}>
        <ExportExcel matter="employees" />
        <table>
          <thead>
            <th>أسم الموظف</th>
            <th>المسمي الوظيفي</th>
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

                    <td> {el.type}</td>

                    <td>
                      {el.today_activity !== false && (
                        <ul>
                          {el.today_activity.phase_in !== null && (
                            <li>معاد الحضور : {el.today_activity.phase_in} </li>
                          )}
                          {el.today_activity.phase_out !== null && (
                            <li>
                              معاد الانصارف : {el.today_activity.phase_out}
                            </li>
                          )}
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
                            el.today_activity === false
                              ? sendPhaseIn(el.id)
                              : sendPhaseOut(el.id, el.today_activity.id)
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
