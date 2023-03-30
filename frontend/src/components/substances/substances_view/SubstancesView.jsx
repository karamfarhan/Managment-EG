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
import LoadingSpinner from "../../UI/loading/LoadingSpinner";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
const SubstancesView = ({
  currentPage,
  setCurrentPage,
  searchVal,
  setSearchVal,
  substances,
  categoryCode,
}) => {
  const { data: subsData, isLoading } = useSelector(
    (state) => state.subsReducer
  );
  console.log(subsData);
  const [isDelete, setIsDelete] = useState(false);
  const [substanceId, setSubstanceId] = useState("");

  //search value

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authReducer);
  // const decoded = jwt_decode(token);
  // const { is_superuser, permissions } = decoded;
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
  console.log(categoryCode);
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
        {/* {subsData && subsData.results.length > 0 && isLoading === false && (
          <div
            style={{
              width: " 50%",
              margin: "20px auto",
            }}
          >
            <Search
              onChange={searchHandler}
              value={searchVal}
              searchData={searchDispatch}
            />
          </div>
        )} */}
        {isLoading && <LoadingSpinner />}
        <div className={classes["table_content"]}>
          {/* {subsData && !isLoading && subsData.results.length > 0 && (
            <ExportExcel matter="substances" />
          )}
          {subsData && subsData.results && subsData.results.length === 0 && (
            <h2> No Substances are found</h2>
          )} */}

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Notes</th>

                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {substances &&
                isLoading === false &&
                substances.map((substance, i) => (
                  <tr key={substance._id}>
                    <td>
                      <span style={{ fontWeight: "bold", color: "red" }}>
                        {" "}
                        {categoryCode}{" "}
                      </span>{" "}
                      {substance.number} -- {substance.name}
                    </td>
                    <td>
                      {substance.quantity} {substance.unit_type}
                    </td>
                    <td>{substance.note}</td>

                    {/* <td>{subs.is_available ? "متوافر" : "غير متوافر"}</td> */}
                    {/* 
                        <td>
                          {new Date(subs.created_at).toLocaleDateString()}
                        </td> */}

                    <td>
                      <button
                        className="deleteBtn"
                        onClick={() => deleteModelHandler(substance._id)}
                      >
                        <MdOutlineDeleteForever />
                      </button>

                      <button
                        className="editBtn"
                        onClick={() => editForm(substance._id)}
                      >
                        <FiEdit />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

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
