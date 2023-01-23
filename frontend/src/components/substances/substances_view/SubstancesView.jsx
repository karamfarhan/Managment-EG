import { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  deleteSubs,
  searchSubstances,
  subsSearchPagination,
} from "../../../store/create-substance";
import EditFormSubs from "../edit-form-substance/EditFormSubs";

import DeleteConfirmation from "../../UI/delete_confirmation/DeleteConfirmation";
import classes from "./SubstancesView.module.css";
import Paginate from "../../UI/pagination/Paginate";
import Search from "../../UI/search/Search";
import { subsPagination } from "../../../store/create-substance";
import ExportExcel from "../../UI/export/ExportExcel";
const SubstancesView = ({
  currentPage,
  setCurrentPage,
  searchVal,
  setSearchVal,
}) => {
  const { data: subsData } = useSelector((state) => state.subsReducer);

  const [isDelete, setIsDelete] = useState(false);
  const [substanceId, setSubstanceId] = useState("");

  //search value

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authReducer);

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

  //search handler
  const searchHandler = (e) => {
    setSearchVal(e.target.value);
  };

  //search dispatch
  const searchDispatch = () => {
    setCurrentPage(1);
    const obj = {
      token,
      search: searchVal,
    };
    dispatch(searchSubstances(obj));
  };

  //search pagnation
  const searchPagination = (obj) => {
    dispatch(subsSearchPagination(obj));
  };

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

      <div>
        <Search
          onChange={searchHandler}
          value={searchVal}
          searchData={searchDispatch}
        />
        <div className={classes["table_content"]}>
          {subsData && subsData.results.length > 0 && (
            <ExportExcel matter="substances" />
          )}
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

                        <td>
                          {new Date(subs.created_at).toLocaleDateString()}
                        </td>

                        <td>
                          <button onClick={() => editForm(subs.id)}>
                            تعديل
                          </button>
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
              searchPagination={searchPagination}
              search={searchVal}
              searchFn={searchDispatch}
            />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default SubstancesView;
