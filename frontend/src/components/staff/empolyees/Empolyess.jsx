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

const Empolyess = ({
  data,
  currentPage,
  setCurrentPage,
  searchValue,
  fetchSearchHandler,
  staffForm,
}) => {
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const { token } = authCtx;

  const [isDelete, setIsDelete] = useState(false);

  //empolyee counts
  const { data: empolyeeData } = useSelector((state) => state.empolyeeReducer);
  const empolyeeCount = empolyeeData && empolyeeData.count;

  //delete staff
  const deleteHandler = async (id) => {
    const res = await fetch(`http://127.0.0.1:8000/employees/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setIsDelete(false);
    if (res.ok) {
      dispatch(getEmpolyees(token));
    }
    const data = await res.json();
    console.log(data);
    return data;
  };

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
            <th>الاحداث</th>
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
                    <td style={{ display: "flex" }}></td>
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
