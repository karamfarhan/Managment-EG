import { Fragment, useState, useContext } from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import Items from "./Items";
import Inputs from "../inputs/Inputs";
import { BsPlusLg } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import classes from "./CreateStoreUI.module.css";
import { useEffect } from "react";
import { createStore, getStores } from "../../../store/create-store-slice";
import AuthContext from "../../../context/Auth-ctx";

export const Backdrop = ({ hideFormHandler }) => {
  return <div className={classes.backdrop} onClick={hideFormHandler} />;
};

export const InventoryCreator = ({ hideFormHandler }) => {
  const [inputFields, setInputFields] = useState([
    { name: "", quantity: "", category: "" },
  ]);

  const [storeData, setStoreData] = useState({
    name: "",
    address: "",
    description: "",
  });
  const {token} = useContext(AuthContext)
  const dispatch = useDispatch();
  const { name, address, description } = storeData;






  //submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    //store obj
    const storeObj = {
      token : token,
      name,
      address,
      description,
    };
    dispatch(createStore(storeObj));
    dispatch(getStores(token));

  };

  return (
    <div className={classes.formContent} dir="rtl">
      <span onClick={hideFormHandler}>
        <AiOutlineClose />
      </span>
      <form onSubmit={submitHandler}>
        <div>
          <Inputs
            type="text"
            placeholder="أسم المخزن"
            onChange={(e) =>
              setStoreData({ ...storeData, name: e.target.value })
            }
          />
          <Inputs
            type="text"
            placeholder="عنوان المخزن"
            onChange={(e) =>
              setStoreData({ ...storeData, address: e.target.value })
            }
          />
          <Inputs
            type="text"
            placeholder=" معلومات اضافية (وصف - ملاحظات- الخ..)"
            onChange={(e) =>
              setStoreData({ ...storeData, address: e.target.value })
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

        <button type="submit">اضافة</button>
      </form>
    </div>
  );
};

const CreateStoreUi = ({ hideFormHandler }) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop hideFormHandler={hideFormHandler} />,
        document.getElementById("backdrop")
      )}
      {ReactDOM.createPortal(
        <InventoryCreator hideFormHandler={hideFormHandler} />,
        document.getElementById("img_popup")
      )}
    </Fragment>
  );
};
export default CreateStoreUi;
