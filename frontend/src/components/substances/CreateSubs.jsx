import { Fragment, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import SubstancesView from "./substances_view/SubstancesView";

import { getSubs } from "../../store/create-substance";
import InstrumentsView from "./instruments_view/InstrumentsView";
import { getInstruments } from "../../store/create-instruments";
import CreateSubsModel from "../UI/create_substances/CreateSubsModel";
import classes from "./CreateSubs.module.css";

const CreateSubs = () => {
  //for add matters
  const [showModel, setShowModel] = useState(false);
  //for add instruments
  const [showInstrumentsForm, setShowInstrumentsForm] = useState(false);
  //show matters
  const [showMatters, setShowMatters] = useState(false);
  //show instruments
  const [showInstrumentsPage, setShowInstrumentsPage] = useState(false);
  //current page
  const [currentPage, setCurrentPage] = useState(1);
  //search value
  const [searchVal, setSearchVal] = useState("");

  const { token } = useSelector((state) => state.authReducer);
  const decoded = jwt_decode(token);
  const { is_superuser, permissions } = decoded;
  const dispatch = useDispatch();
  console.log(showMatters);
  console.log(showInstrumentsPage);
  //fetch matters
  useEffect(() => {
    if (
      showMatters === true &&
      showModel === false &&
      showInstrumentsPage === false &&
      currentPage === 1 &&
      searchVal === ""
    ) {
      dispatch(getSubs(token));
    }
    //fetch instruments

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    dispatch,
    showMatters,
    searchVal,
    showInstrumentsPage,
    showModel,
  ]);

  useEffect(() => {
    if (
      showInstrumentsPage === true &&
      currentPage === 1 &&
      showInstrumentsForm === false &&
      showMatters === false &&
      searchVal === ""
    ) {
      dispatch(getInstruments(token));
    }
  }, [
    currentPage,
    dispatch,
    searchVal,
    showInstrumentsForm,
    showInstrumentsPage,
    showMatters,
  ]);

  //fetch matters
  const fetchMatters = () => {
    setShowMatters(true);
    setShowInstrumentsPage(false);
    setCurrentPage(1);
    setSearchVal("");
  };

  //fetch instruments
  const fetchInstruments = () => {
    setShowInstrumentsPage(true);
    setShowMatters(false);
    setCurrentPage(1);
    setSearchVal("");
  };
  const hideSubstancesHandler = () => {
    setShowModel(false);
    setShowInstrumentsForm(false);
  };
  return (
    <Fragment>
      {(showModel || showInstrumentsForm) && (
        <CreateSubsModel
          hideSubstancesHandler={hideSubstancesHandler}
          showMattersForm={showModel}
          instrumentsPage={showInstrumentsPage}
          showMattersPage={showMatters}
          showInstrumentsForm={showInstrumentsForm}
        />
      )}
      {/* المخزن الرئيسي*/}

      <div className={classes["main_inventory"]}>
        <h2>ادارة الموارد / المخزن الرئيسي</h2>
      </div>

      <div className={classes.buttons}>
        <div className={classes.show}>
          {(permissions.includes("view_substance") || is_superuser) && (
            <div>
              <button
                id="material"
                type="button"
                name="material"
                onClick={fetchMatters}
              >
                عرض الموارد
              </button>
              <button type="button" onClick={() => setShowModel(true)}>
                اضافة موارد
              </button>
            </div>
          )}

          {(permissions.includes("view_instrument") || is_superuser) && (
            <div>
              <button
                id="instruments"
                type="button"
                name="instruments"
                onClick={fetchInstruments}
              >
                عرض المعدات
              </button>
              <button
                type="button"
                onClick={() => setShowInstrumentsForm(true)}
              >
                اضافة معدات
              </button>
            </div>
          )}
        </div>
      </div>

      {showMatters &&
        (permissions.includes("view_substance") || is_superuser) && (
          <SubstancesView
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setSearchVal={setSearchVal}
            searchVal={searchVal}
          />
        )}
      {showInstrumentsPage &&
        (permissions.includes("view_instrument") || is_superuser) && (
          <InstrumentsView
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setSearchVal={setSearchVal}
            searchVal={searchVal}
          />
        )}
    </Fragment>
  );
};

export default CreateSubs;
