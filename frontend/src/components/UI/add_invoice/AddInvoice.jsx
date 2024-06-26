import { useState } from "react";
import { useQuery } from "react-query";
import Backdrop from "../backdrop/Backdrop";
import Items from "./Items";
import InstrumentsItems from "./InstrumentsItems";
import { BsPlusLg } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import classes from "./AddInvoice.module.css";
import { useSelector } from "react-redux";

const AddInvoice = ({ hideModel, storeName, storeId }) => {
  const [inputFields, setInputFields] = useState([
    { substance: "", mass: 1, description: "" },
  ]);

  //instruments
  const [instrumentInputFields, setInstrumentInputFields] = useState([
    { instrument: "", description: "" },
  ]);
  //note
  const [note, setNote] = useState("");

  //token
  const { token } = useSelector((state) => state.authReducer);

  //form validation
  let formIsValid = false;
  if (inputFields.length !== 0 || instrumentInputFields.length !== 0) {
    formIsValid = true;
  }

  //fetch all substances name
  const { data: substances_name } = useQuery(
    "fetch/substances",
    async () => {
      try {
        const res = await fetch(`${window.domain}/substances/select_list/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return await res.json();
        //console.log(data);
      } catch (err) {
        console.log(err);
      }
    },
    { refetchOnWindowFocus: false }
  );
  //fetch all machine name
  const { data: instruments_name } = useQuery(
    "fetch/instruments_name",
    async () => {
      try {
        const res = await fetch(`${window.domain}/instruments/select_list/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return await res.json();
        //console.log(data);
      } catch (err) {
        console.log(err);
      }
    },
    { refetchOnWindowFocus: false }
  );

  //add items filed
  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      { substance: "", mass: "", description: "" },
    ]);
  };
  //add items instruments
  const instrumentsFiled = () => {
    setInstrumentInputFields([
      ...instrumentInputFields,
      { instrument: "", description: "" },
    ]);
  };

  //create invoice
  const {
    data: invoice,

    refetch: createInvoice,
  } = useQuery(
    "create/invoice",
    async () => {
      try {
        const res = await fetch(
          `${window.domain}/stores/${storeId}/invoices/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              note: note,
              substances: inputFields,
              instruments: instrumentInputFields,
            }),
          }
        );
        if (res.ok) {
          hideModel();
        }
        const data2 = await res.json();

        return data2;
      } catch (err) {
        console.log(err);
      }
    },
    { refetchOnWindowFocus: false, enabled: false }
  );

  //submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    createInvoice();
  };

  return (
    <Backdrop hideModel={hideModel}>
      <form className={classes.form} onSubmit={submitHandler}>
        <span className={classes.close} onClick={hideModel}>
          <AiOutlineCloseCircle />
        </span>
        <h3> برجاء ادخال جميع الموارد أو الاجهزة المحولة الي {storeName} </h3>

        <span className={classes.subtancesText}>الموارد</span>

        <div className={classes["items_container"]}>
          {inputFields.map((inputField, index) => {
            return (
              <Items
                key={index}
                index={index}
                inputField={inputField}
                inputFields={inputFields}
                setInputFields={setInputFields}
                selectBox={substances_name}
              />
            );
          })}
        </div>
        {invoice && invoice.mass && <p className="err-msg"> {invoice.mass} </p>}
        <button type="button" onClick={handleAddFields}>
          <BsPlusLg /> اضافة المزيد
        </button>

        <div>
          <span className={classes.subtancesText}>الاجهزة</span>
        </div>

        <div className={classes["items_container"]}>
          {instrumentInputFields.map((inputField, index) => {
            return (
              <InstrumentsItems
                key={index}
                index={index}
                inputField={inputField}
                inputFields={instrumentInputFields}
                setInputFields={setInstrumentInputFields}
                selectBox={instruments_name}
              />
            );
          })}
        </div>
        <button
          style={{ backgroundColor: "rgb(233, 30, 99)" }}
          type="button"
          onClick={instrumentsFiled}
        >
          <BsPlusLg /> اضافة المزيد
        </button>
        <div className={classes.note} dir="rtl">
          <textarea
            placeholder="ملاحظة عامة"
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>
        <button disabled={!formIsValid} type="submit">
          {" "}
          تحويل{" "}
        </button>
      </form>
    </Backdrop>
  );
};

export default AddInvoice;
