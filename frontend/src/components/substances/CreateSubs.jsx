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
const CreateSubs = () => {
  //for add matters
  const [showModel, setShowModel] = useState(false);
  //for add instruments
  const [showInstrumentsForm, setShowInstrumentsForm] = useState(false);
  //show matters
  const [showMatters, setShowMatters] = useState(false);
  //show instruments
  const [showInstrumentsPage, setShowInstrumentsPage] = useState(false);
  const authCtx = useContext(AuthContext);

  const { token } = authCtx;

  const dispatch = useDispatch();

  //hide model for matters
  const hideSubstancesHandler = () => {
    setShowModel(false);
    setShowInstrumentsForm(false)
  };
  //fetch matters
  useEffect(()=>{
    if (showMatters===true) {
      dispatch(getSubs(token));
    }
  }, [showMatters])
    //fetch instruments
    useEffect(()=>{
      if (showInstrumentsPage===true) {
        dispatch(getInstruments(token));
      }
    }, [showInstrumentsPage])

  //fetch matters
  const fetchMatters = () => {
   setShowMatters((prevState) => !prevState);
   setShowInstrumentsPage(false)
  };

  
  //fetch instruments
  const fetchInstruments = () => {
    setShowInstrumentsPage((prevState) => !prevState);
    setShowMatters(false)
   };
 
  return (
    <Fragment>
      {(showModel || showInstrumentsForm) &&  (
        <CreateSubsModel hideSubstancesHandler={hideSubstancesHandler} showMattersForm={showModel} instrumentsPage ={showInstrumentsPage} showMattersPage = {showMatters} showInstrumentsForm = {showInstrumentsForm}/>
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
          onClick={fetchMatters}
        >
       
    {showMatters ? "اخفاء" : "اظهار الموارد"}
        </button>
      </div>

      <div>
        <button id="instruments" type="button" name="instruments" onClick={fetchInstruments}
        >
         {showInstrumentsPage ? "اخفاء" : "اظهار المعدات"}
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

   
      {showMatters  && <SubstancesView />}
      {showInstrumentsPage && <InstrumentsView /> }
    </Fragment>
  );
};

export default CreateSubs;
