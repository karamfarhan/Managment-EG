import { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Routes, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import DeleteConfirmation from "../../UI/delete_confirmation/DeleteConfirmation";
import {
  deleteInstruments,
  instrumSearchPagination,
  searchInstruments,
} from "../../../store/create-instruments";
import EditFormInstrum from "../edit-form-isntruments/EditFormInstrum";
import Paginate from "../../UI/pagination/Paginate";
import classes from "./Instruments.module.css";
import { instrumentsPagination } from "../../../store/create-instruments";
import Search from "../../UI/search/Search";
import LoadingSpinner from "../../UI/loading/LoadingSpinner";
import ExportExcel from "../../UI/export/ExportExcel";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
const InstrumentsView = ({
  currentPage,
  setCurrentPage,
  searchVal,
  setSearchVal,
}) => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const [isDelete, setIsDelete] = useState(false);
  const [instrumentId, setInstrumentId] = useState("");

  const { data: instrumentsData, isLoading } = useSelector(
    (state) => state.instrumentsReducer
  );

  console.log(instrumentsData);
  //pagination
  const instrumentsCount = instrumentsData && instrumentsData.count;

  //pagination
  const paginationFun = (obj) => {
    dispatch(instrumentsPagination(obj));
  };

  //delete handler
  const deleteHandler = (id) => {
    const obj = {
      id,
      token,
    };
    dispatch(deleteInstruments(obj));
    setIsDelete(false);
  };

  //show delete mode
  const deleteModelHandler = (id) => {
    setIsDelete(true);
    setInstrumentId(id);
  };
  //hide delete mode
  const hideDeleteModel = () => {
    setIsDelete(false);
  };

  //search dispatch
  const searchDispatch = () => {
    setCurrentPage(1);
    const obj = {
      token,
      search: searchVal,
    };
    dispatch(searchInstruments(obj));
  };
  //search pagnation
  const searchPagination = (obj) => {
    dispatch(instrumSearchPagination(obj));
  };
  //edit instruments form
  const editInstrumentsForm = (id) => {
    navigate(`/create_subs/instrument/${id}`);
  };

  return (
    <Fragment>
      {isDelete && (
        <DeleteConfirmation
          hideModel={hideDeleteModel}
          deleteHandler={deleteHandler}
          id={instrumentId}
        />
      )}
      <div>
        {instrumentsData && instrumentsData.data.instruments > 0 && (
          <div
            style={{
              width: " 50%",
              margin: "20px auto",
            }}>
            <Search
              onChange={(e) => setSearchVal(e.target.value)}
              value={searchVal}
              searchData={searchDispatch}
            />
          </div>
        )}
        {isLoading && <LoadingSpinner />}
        <div className={classes["table_content"]}>
          {instrumentsData &&
            instrumentsData.data.instruments === 0 &&
            !isLoading && <h2> لا يوجد أجهزة </h2>}

          <Routes>
            <Route
              path="/instrument/:edit"
              element={
                <EditFormInstrum
                  instruments={instrumentsData}
                  setCurrentPage={setCurrentPage}
                />
              }
            />
          </Routes>

          {instrumentsData &&
            instrumentsData.data.instruments.length > 0 &&
            !isLoading && (
              <div className={classes["table-content"]}>
                <ExportExcel matter="instruments" />
                <table>
                  <thead>
                    <tr>
                      <th>Name </th>
                      <th>Last Maintainance</th>
                      <th>Maintainance Place </th>
                      {/* <th>Available</th> */}
                      {/* <th>Status</th> */}
                      {/* <th>Created At </th> */}
                      <th>Notes </th>
                      <th>Actons</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instrumentsData &&
                      instrumentsData.data &&
                      instrumentsData.data.instruments.map((insruments) => {
                        return (
                          <tr key={insruments._id}>
                            <td>{insruments.name}</td>
                            <td>
                              {insruments.last_maintainace
                                ? new Date(
                                    insruments.last_maintainace
                                  ).toLocaleDateString()
                                : ""}
                            </td>
                            <td>{insruments.place_of_maintainer}</td>
                            <td>{insruments.notes}</td>
                            {/* <td
                              style={{
                                color:
                                  insruments.in_action === false
                                    ? "green"
                                    : "red",
                              }}>
                              {insruments.in_action === false
                                ? "متواجدة"
                                : "خارج المخزن"}
                            </td> */}

                            {/* <td>{insruments.is_working ? "تعمل" : "معطلة"}</td> */}
                            {/* <td>
                              {new Date(
                                insruments.created_at
                              ).toLocaleDateString()}
                            </td> */}
                            {/* <td>{insruments.description}</td> */}
                            <td>
                              <button
                                className="deleteBtn"
                                onClick={() =>
                                  deleteModelHandler(insruments.id)
                                }>
                                <MdOutlineDeleteForever />
                              </button>

                              <button
                                className="editBtn"
                                onClick={() =>
                                  editInstrumentsForm(insruments.id)
                                }>
                                <FiEdit />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>{" "}
              </div>
            )}
          {instrumentsCount > 10 && (
            <Paginate
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              count={instrumentsCount}
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

export default InstrumentsView;
