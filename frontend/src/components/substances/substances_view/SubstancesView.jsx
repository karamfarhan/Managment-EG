import { Fragment, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import AuthContext from "../../../context/Auth-ctx";
import { deleteSubs } from "../../../store/create-substance";
import { getSubs } from "../../../store/create-substance";
import EditFormSubs from "../edit-form-substance/EditFormSubs";

import DeleteConfirmation from "../../UI/delete_confirmation/DeleteConfirmation";
import classes from "./SubstancesView.module.css";
import Paginate from "../../UI/pagination/Paginate";
import { subsPagination } from "../../../store/create-substance";
import EditFormInstrum from "../edit-form-isntruments/EditFormInstrum";
const SubstancesView = ({ currentPage, setCurrentPage }) => {
  const { data: subsData } = useSelector((state) => state.subsReducer);

  const [isDelete, setIsDelete] = useState(false);
  const [substanceId, setSubstanceId] = useState("");
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;

  const navigate = useNavigate();

  //pagination
  const subsCount = subsData && subsData.count;

  //delete handler

  const deleteHandler = (id) => {
    const obj = {
      id,
      token,
    };
    dispatch(deleteSubs(obj));
    setIsDelete(false);
  };
  //show delete mode
  const deleteModelHandler = (id) => {
    setIsDelete(true);
    setSubstanceId(id);
  };

  //hide delete mode
  const hideDeleteModel = () => {
    setIsDelete(false);
  };
  //edit form
  const editForm = (id) => {
    navigate(`/create_subs/subs/${id}`);
  };

  //pagination
  const paginationFun = (obj) => {
    dispatch(subsPagination(obj));
  };

  // useEffect(() => {
  //   const obj = {
  //     token,
  //     page: currentPage,
  //   };

  //   if (currentPage === 1) {
  //     dispatch(ge(obj));
  //   }
  // }, [currentPage, dispatch, token]);

  return (
    <Fragment>
      {/*edit form*/}

      <Routes>
        <Route
          path="/subs/:edit"
          element={
            <EditFormSubs
              subsEl={subsData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          }
        />
      </Routes>

      {isDelete && (
        <DeleteConfirmation
          hideModel={hideDeleteModel}
          deleteHandler={deleteHandler}
          id={substanceId}
        />
      )}

      <div className={classes["table_content"]}>
        {subsData && subsData.results && subsData.results.length === 0 && (
          <p className={classes.msg_p}> لا يوجد مواد </p>
        )}

        {subsData && subsData.results.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>أسم الخامة</th>
                <th>الكمية</th>
                <th>الوصف</th>
                <th>متوافر</th>
                <th>تاريخ الاضافة</th>
                <th>حدث</th>
              </tr>
            </thead>
            <tbody>
              {subsData &&
                subsData.results &&
                subsData.results.map((subs) => {
                  return (
                    <tr key={subs.id}>
                      <td>{subs.name}</td>
                      <td>
                        {subs.units} {subs.unit_type}
                      </td>
                      <td>{subs.description}</td>

                      <td>{subs.is_available ? "متوافر" : "غير متوافر"}</td>

                      <td>{new Date(subs.created_at).toLocaleDateString()}</td>

                      <td>
                        <button onClick={() => editForm(subs.id)}>تعديل</button>
                        <button onClick={() => deleteModelHandler(subs.id)}>
                          حذف
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
        {subsCount > 10 && (
          <Paginate
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            count={subsCount}
            paginationFun={paginationFun}
          />
        )}
      </div>
    </Fragment>
  );
};

export default SubstancesView;
