import { Fragment, useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";

import Inputs from "../inputs/Inputs";
import { AiOutlineClose } from "react-icons/ai";
import classes from "./CreateStoreUI.module.css";
import { createStore } from "../../../store/create-store-slice";
import Backdrop from "../backdrop/Backdrop";

export const InventoryCreator = ({ hideFormHandler }) => {
  const [storeData, setStoreData] = useState({
    name: "",
    address: "",
    description: "",
  });
  const { token } = useSelector((state) => state.authReducer);
  const decoded = jwt_decode(token);
  const { is_superuser, permissions } = decoded;

  const getSoresPremission = ["change_store", "view_store", "delete_store"];
  const getAllStores = permissions.some((el) =>
    getSoresPremission.includes(el)
  );
  const dispatch = useDispatch();
  const { name, address, description } = storeData;
  //form validation
  let formIsValid = false;

  if (storeData.address.trim() !== "" && storeData.name.trim() !== "") {
    formIsValid = true;
  }
  //authenticated function
  function auth() {
    if (
      is_superuser ||
      permissions.includes("view_store") ||
      permissions.includes("delete_store")
    ) {
      return true;
    } else {
      return false;
    }
  }

  //submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    if (formIsValid === false) return;
    //store obj
    const storeObj = {
      token: token,
      name,
      address,
      description,
      authenticated: auth(),
    };
    console.log(storeObj);
    dispatch(createStore(storeObj));
    hideFormHandler();
  };

  return (
    <Fragment>
      <Backdrop hideModel={hideFormHandler} />
      <div className={classes.formContent} dir="rtl">
        <span onClick={hideFormHandler}>
          <AiOutlineClose />
        </span>
        <form onSubmit={submitHandler}>
          <div>
            <Inputs
              type="text"
              placeholder="أسم المخزن"
              value={storeData.name}
              onChange={(e) =>
                setStoreData({ ...storeData, name: e.target.value })
              }
            />
            <Inputs
              type="text"
              placeholder="أسم الموقع"
              value={storeData.address}
              onChange={(e) =>
                setStoreData({ ...storeData, address: e.target.value })
              }
            />
            <Inputs
              type="text"
              placeholder=" معلومات اضافية (وصف - ملاحظات- الخ..)"
              value={storeData.description}
              onChange={(e) =>
                setStoreData({ ...storeData, description: e.target.value })
              }
            />
          </div>

          {/* محتويات المخزن */}

          <button disabled={!formIsValid} type="submit">
            اضافة
          </button>
        </form>
      </div>
    </Fragment>
  );
};

const CreateStoreUi = ({ hideFormHandler }) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <InventoryCreator hideFormHandler={hideFormHandler} />,
        document.getElementById("img_popup")
      )}
    </Fragment>
  );
};
export default CreateStoreUi;
