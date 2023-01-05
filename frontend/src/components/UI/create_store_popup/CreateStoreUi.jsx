import { Fragment, useState } from "react";
import ReactDOM from "react-dom";
import Items from "./Items";
import Inputs from "../inputs/Inputs";
import { BsPlusLg } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import classes from "./CreateStoreUI.module.css";

export const Backdrop = ({ hideFormHandler }) => {
  return <div className={classes.backdrop} onClick={hideFormHandler} />;
};

export const InventoryCreator = ({ hideFormHandler }) => {
  const [inputFields, setInputFields] = useState([
    { name: "", quantity: "", category: "" },
  ]);

  //add items filed
  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      {
        title: "",
        quantity: "",
        unit_price: "",
        tax_rate: "",
      },
    ]);
  };

  return (
    <div className={classes.formContent} dir="rtl">
      <span onClick={hideFormHandler}>
        <AiOutlineClose />
      </span>
      <form>
        <div>
          <Inputs type="text" placeholder="أسم المخزن" />
          <Inputs type="text" placeholder="عنوان المخزن" />
        </div>

        {/* محتويات المخزن */}

        <div className={classes.itemsContent}>
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
        </div>

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
