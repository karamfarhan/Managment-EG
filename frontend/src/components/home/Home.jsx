import { Fragment, useState } from "react";
import StaffForm from "../staff/staff-form/StaffForm";

import classes from "./Home.module.css";
import CreateStoreUi from "../UI/create_store_popup/CreateStoreUi";
import CreateSubsModel from "../UI/create_substances/CreateSubsModel";
import CreateCar from "../UI/create-car/CreateCar";
import { MyChartOne, MyChartTwo } from "./MyCharts";
const Home = () => {
  const [staffForm, setStaffForm] = useState(false);
  const [storeForm, setStoreForm] = useState(false);
  const [subsForm, setSubsForm] = useState(false);
  const [showInstrumentsForm, setShowInstrumentsForm] = useState(false);
  const [showCars, setShowCars] = useState(false);

  let formsVisible = staffForm;

  //hide model for matters
  const hideSubstancesHandler = () => {
    setSubsForm(false);
    setShowInstrumentsForm(false);
  };

  return (
    <Fragment>
      {/* staff form  */}
      {staffForm && <StaffForm setStaffForm={setStaffForm} />}
      {/* store form  */}
      {storeForm && (
        <CreateStoreUi hideFormHandler={() => setStoreForm(false)} />
      )}
      {/* substance form */}
      {(subsForm || showInstrumentsForm) && (
        <CreateSubsModel
          hideSubstancesHandler={hideSubstancesHandler}
          showMattersForm={subsForm}
          showInstrumentsForm={showInstrumentsForm}
        />
      )}
      {/* cars form */}
      {showCars && <CreateCar hideModel={() => setShowCars(false)} />}

      {!formsVisible && (
        <div className={classes.home} id="dashbaord">
          <div className={classes.actions}>
            <div>
              <span>New ACCOUNTS </span>
              <p>36</p>
            </div>

            <div>
              <span> COMPANY PROJECTS </span>
              <p>36</p>
            </div>

            <div>
              <span>TOTAL EXPANSES </span>
              <p>36</p>
            </div>

            {/* <div>
              <span>سيارات الشركة</span>
              <p>36</p>
            </div> */}
          </div>

          <div style={{ display: "flex", marginTop: "20px", flexWrap: "wrap" }}>
            <MyChartOne />
            <MyChartTwo />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Home;
