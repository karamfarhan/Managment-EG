import { Fragment, useState, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import AuthContext from "../../context/Auth-ctx";
import SubstancesView from "./substances_view/SubstancesView";
import { GiSaddle } from "react-icons/gi";
import { TbToolsKitchen } from "react-icons/tb";
import CreateSubsModel from "../UI/create_substances/CreateSubsModel";
import classes from "./CreateSubs.module.css";
import { getSubs } from "../../store/create-substance";
import InstrumentsView from "./instruments_view/InstrumentsView";
import { getInstruments } from "../../store/create-instruments";
import { subsPagination } from "../../store/create-substance";
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
  const [currentPage, setCurrentPage] = useState(
    parseInt(sessionStorage.getItem("current-page")) || 1
  );

  const authCtx = useContext(AuthContext);

  const { token } = authCtx;

  const dispatch = useDispatch();

  //hide model for matters
  const hideSubstancesHandler = () => {
    setShowModel(false);
    setShowInstrumentsForm(false);
  };
  //fetch matters
  useEffect(() => {
    if (showMatters === true && currentPage === 1) {
      dispatch(getSubs(token));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, dispatch, showMatters]);
  //fetch instruments
  useEffect(() => {
    if (showInstrumentsPage === true && currentPage === 1) {
      dispatch(getInstruments(token));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, dispatch, showInstrumentsPage]);

  //fetch matters
  const fetchMatters = () => {
    setShowMatters(true);
    setShowInstrumentsPage(false);
    setCurrentPage(1);
  };

  //fetch instruments
  const fetchInstruments = () => {
    setShowInstrumentsPage(true);
    setShowMatters(false);
    setCurrentPage(1);
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
          <div>
            <button
              id="material"
              type="button"
              name="material"
              onClick={fetchMatters}>
              عرض الموارد
            </button>
          </div>

          <div>
            <button
              id="instruments"
              type="button"
              name="instruments"
              onClick={fetchInstruments}>
              عرض المعدات
            </button>
          </div>
        </div>
        <div className={classes.actions}>
          <button onClick={() => setShowModel(true)}>
            {" "}
            اضافة مواد{" "}
            <span>
              {" "}
              <TbToolsKitchen />{" "}
            </span>{" "}
          </button>
          <button onClick={() => setShowInstrumentsForm(true)}>
            {" "}
            اضافة أجهزة / الات{" "}
            <span>
              {" "}
              <GiSaddle />{" "}
            </span>
          </button>
        </div>
      </div>

      {showMatters && (
        <SubstancesView
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
      {showInstrumentsPage && (
        <InstrumentsView
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </Fragment>
  );
};

export default CreateSubs;
