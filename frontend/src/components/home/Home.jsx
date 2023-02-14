import { Fragment, useState } from "react";
import jwt_decode from "jwt-decode";
import StaffForm from "../staff/staff-form/StaffForm";

import { AiOutlineUserAdd } from "react-icons/ai";
import { FaCarSide } from "react-icons/fa";
import { VscPaintcan } from "react-icons/vsc";
import { GiRayGun } from "react-icons/gi";
import { FaStoreAlt } from "react-icons/fa";
import classes from "./Home.module.css";
import { useSelector } from "react-redux";
import CreateStoreUi from "../UI/create_store_popup/CreateStoreUi";
import CreateSubsModel from "../UI/create_substances/CreateSubsModel";
import CreateCar from "../UI/create-car/CreateCar";

const Home = () => {
  const [staffForm, setStaffForm] = useState(false);
  const [storeForm, setStoreForm] = useState(false);
  const [subsForm, setSubsForm] = useState(false);
  const [showInstrumentsForm, setShowInstrumentsForm] = useState(false);
  const [showCars, setShowCars] = useState(false);
  const token = useSelector((state) => state.authReducer.token);
  const decoded = jwt_decode(token);
  const { is_superuser, permissions } = decoded;

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
        <div className={classes.home}>
          <h1>الرئيسية</h1>

          <div className={classes.actions}>
            {(is_superuser || permissions.includes("add_employee")) && (
              <button onClick={() => setStaffForm(true)}>
                <span>اضافة موظف</span>
                <span>
                  <AiOutlineUserAdd />
                </span>
              </button>
            )}
            {(is_superuser || permissions.includes("add_store")) && (
              <button onClick={() => setStoreForm(true)}>
                <span>اضافة مخزن</span>
                <span>
                  <FaStoreAlt />
                </span>
              </button>
            )}

            {(permissions.includes("add_substance") || is_superuser) && (
              <button onClick={() => setSubsForm(true)}>
                <span>اضافة خامات</span>
                <span>
                  <VscPaintcan />
                </span>
              </button>
            )}
            {(permissions.includes("add_instrument") || is_superuser) && (
              <button onClick={() => setShowInstrumentsForm(true)}>
                <span>اضافة أجهزة</span>
                <span>
                  <GiRayGun />
                </span>
              </button>
            )}
            {(is_superuser || permissions.includes("add_car")) && (
              <button onClick={() => setShowCars(true)}>
                <span>اضافة سيارة</span>
                <span>
                  <FaCarSide />
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Home;
