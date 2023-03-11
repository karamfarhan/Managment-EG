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
<<<<<<< HEAD
import { Link } from "react-router-dom";

=======
import { MyChartOne, MyChartTwo } from "./MyCharts";
import { useTranslation } from "react-i18next";
>>>>>>> 73569f1 (side bar modifying)
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
<<<<<<< HEAD
        <div className={classes.home}>
          <h1>الرئيسية</h1>

          <div className={classes.actions}>
            {(is_superuser === true ||
              allPermissions.includes("employee") ||
              allPermissions.includes("insurance")) && (
              <Link to="/staff">
                <span>العاملين بالشركة</span>
                <span>
                  <AiOutlineUserAdd />
                </span>
              </Link>
            )}
            {(is_superuser || allPermissions.includes("store")) && (
              <Link to="/store">
                <span>مشاريع و مخازن الشركة </span>
                <span>
                  <FaStoreAlt />
                </span>
              </Link>
            )}

            {(is_superuser ||
              allPermissions.includes("substance") ||
              allPermissions.includes("instrument")) &&
              (!allPermissions.includes("invoice") ||
                !allPermissions.includes("store")) && (
                <Link to="/create_subs">
                  <span>المخزن الرئيسي</span>
                  <span>
                    <VscPaintcan />
                  </span>
                </Link>
              )}
            {/* {(is_superuser === true || allPermissions.includes("media")) && (
              <Link to="/projects">
                <span>مشاريع الشركة</span>
                <span>
                  <GalleryIcon />
                </span>
              </Link>
            )} */}
            {(is_superuser === true || allPermissions.includes("car")) && (
              <Link to="/cars">
                <span>سيارات الشركة</span>
                <span>
                  <FaCarSide />
                </span>
              </Link>
            )}
=======
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
>>>>>>> 73569f1 (side bar modifying)
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Home;
