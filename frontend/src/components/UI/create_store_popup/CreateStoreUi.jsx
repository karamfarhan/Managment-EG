import { Fragment, useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";

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

  const dispatch = useDispatch();
  const { name, address, description } = storeData;
  //form validation
  let formIsValid = false;

  if (storeData.address.trim() !== "" && storeData.name.trim() !== "") {
    formIsValid = true;
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
    };
    dispatch(createStore(storeObj));
    //s dispatch(getStores(token));
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

          {/* <div className={classes.itemsContent}>
          {" "}
          {inputFields.map((inputField, index) => (
            <Items
              key={index}
              index={index}
              inputField={inputField}
              inputFields={inputFields}
              setInputFields={setInputFields}
            />
          ))}
          <button type="button" onClick={handleAddFields}>
            <BsPlusLg />
          </button>
        </div> */}

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
