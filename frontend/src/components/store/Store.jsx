import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import classes from "./Store.module.css";
import CreateStoreUi from "../UI/create_store_popup/CreateStoreUi";
import Bar from "../UI/bars/Bar";
const Store = () => {
  const [showForm, setShowForm] = useState(false);

  //store data
  const { store_data } = useSelector((state) => state.storeSlice);
  console.log(store_data);
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
      <Bar>
        <button
          onClick={showFormHandler}
          type="button"
          className={classes.addInventory}>
          <SiHomeassistantcommunitystore /> انشاء مخزن
        </button>
      </Bar>
      <div className={classes.storeContent}>
        {/* مخازن */}
        {store_data.map((store) => {
          return (
            <div className={classes.storeObj} key={store.id}>
              <h3>{store.name} </h3>;<p>{store.address} </p>;
              <Link to="/">اظهار التفاصيل</Link>;
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};
export default Store;
