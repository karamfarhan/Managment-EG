import { Fragment, useState } from "react";

import { Link } from "react-router-dom";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import classes from "./Store.module.css";
import CreateStoreUi from "../UI/create_store_popup/CreateStoreUi";
const Store = () => {
  const [showForm, setShowForm] = useState(false);

  //hide form handler
  const hideFormHandler = () => {
    setShowForm(false);
  };
  //show form handler
  const showFormHandler = () => {
    setShowForm(true);
  };
  return (
    <Fragment>
      {showForm && <CreateStoreUi hideFormHandler={hideFormHandler} />}
      <div>
        <button
          onClick={showFormHandler}
          type="button"
          className={classes.addInventory}>
          <SiHomeassistantcommunitystore /> انشاء مخزن
        </button>

        <div className={classes.storeContent}>
          {/* مخازن */}
          <div className={classes.storeObj}>
            <h3>المخزن الرئيسي</h3>

            <Link to="/">اظهار التفاصيل</Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Store;
