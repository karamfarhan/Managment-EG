import { Fragment, useState } from "react";
import jwt_decode from "jwt-decode";
import StaffForm from "../staff/staff-form/StaffForm";

import { AiOutlineUserAdd } from "react-icons/ai";
import { FaCarSide } from "react-icons/fa";
import { VscPaintcan } from "react-icons/vsc";
import { FaStoreAlt } from "react-icons/fa";
import classes from "./Home.module.css";
import { useSelector } from "react-redux";
import CreateStoreUi from "../UI/create_store_popup/CreateStoreUi";
import CreateSubsModel from "../UI/create_substances/CreateSubsModel";
import CreateCar from "../UI/create-car/CreateCar";
import { MyChartOne, MyChartTwo } from "./MyCharts";
import { useTranslation } from "react-i18next";
const Home = () => {
  const [staffForm, setStaffForm] = useState(false);
  const [storeForm, setStoreForm] = useState(false);
  const [subsForm, setSubsForm] = useState(false);
  const [showInstrumentsForm, setShowInstrumentsForm] = useState(false);
  const [showCars, setShowCars] = useState(false);
  const token = useSelector((state) => state.authReducer.token);
  const decoded = jwt_decode(token);
  const { is_superuser, permissions } = decoded;
  const allPermissions = permissions.join(" ");
  const [t, i18n] = useTranslation();

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
              <span>{t("NEW ACCOUNTS")}</span>
              <p>36</p>
            </div>

            <div>
              <span> {t("COMPANY PROJECTS")} </span>
              <p>36</p>
            </div>

            <div>
              <span>{t("TOTAL EMPLOYEES")} </span>
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
