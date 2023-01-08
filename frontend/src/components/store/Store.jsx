import { Fragment, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import classes from "./Store.module.css";
import CreateStoreUi from "../UI/create_store_popup/CreateStoreUi";
import Bar from "../UI/bars/Bar";
import { useEffect } from "react";
import { getStores } from "../../store/create-store-slice";
import AuthContext from "../../context/Auth-ctx";
const Store = () => {
  const dispatch = useDispatch()
  const [showForm, setShowForm] = useState(false);
  
  const authCtx = useContext(AuthContext)



  //store data
  const { store_data } = useSelector((state) => state.storeSlice);
  //get stores
  useEffect(()=> {
 dispatch(getStores(authCtx.token));
  }, [])
console.log(store_data)
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
        {store_data  && store_data.map((store) => {
          return (
            <div className={classes.storeObj} key={store.id}>
              <h3> <span>أسم المخزن:</span> {store.name}</h3>
             <p><span>عنوان المخزن:</span> {store.address}</p>
              <Link to={`/store/${store.id}`}>اظهار التفاصيل</Link>
              {/* <div className={classes.inform}>
              <p> <span className={classes.title}>المنشيء: </span> {store.created_by.username} </p>
              <p> {new Date(store.created_at).toDateString()} </p>
              
               </div> */}
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};
export default Store;
