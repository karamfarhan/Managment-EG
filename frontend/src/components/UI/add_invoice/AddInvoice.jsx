import { useState } from "react";
import { useQuery } from "react-query";
import Backdrop from "../backdrop/Backdrop";
import Items from "./Items";
import InstrumentsItems from "./InstrumentsItems";
import { BsPlusLg } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import classes from "./AddInvoice.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getStores } from "../../../store/create-store-slice";

const AddInvoice = ({ hideModel, fetchInvoices, storeId }) => {
  const dispatch = useDispatch();
  const [inputFields, setInputFields] = useState([
    { substance: "", quantity: 1, notes: "" },
  ]);

  //instruments
  const [instrumentInputFields, setInstrumentInputFields] = useState([
    { instrument: "", notes: "" },
  ]);
  //note
  const [note, setNote] = useState("");

  //err message

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
        const res = await fetch(`${window.domain}substance/select_list/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    { refetchOnWindowFocus: false }
  );
  console.log(substances_name);
  //fetch all machine name
  const { data: instruments_name } = useQuery(
    "fetch/instruments_name",
    async () => {
      try {
        const res = await fetch(`${window.domain}instrument/select_list/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        return data;
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
      { substance: "", quantity: "", notes: "" },
    ]);
  };
  //add items instruments
  const instrumentsFiled = () => {
    setInstrumentInputFields([
      ...instrumentInputFields,
      { instrument: "", notes: "" },
    ]);
  };

  //create invoice
  const { data: invoice, refetch: createInvoice } = useQuery(
    "create/invoice",
    async () => {
      //body object
      const invoiceObj = {
        substance: inputFields,
        instrument: instrumentInputFields,
        notes: note,
      };

      instrumentInputFields.forEach((el) => {
        if (el.instrument === "") {
          delete invoiceObj.instrument;
        }
        if (el.substance === "") {
          delete invoiceObj.substance;
        }
      });

      try {
        const res = await fetch(`${window.domain}stores/${storeId}/invoice/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify(invoiceObj),
        });
        console.log(storeId);

        if (res.ok) {
          fetchInvoices();
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

        <span className={classes.subtancesText}>الموارد</span>
        <div className={classes["items_container"]}>
          {substances_name &&
            substances_name.data &&
            inputFields.map((inputField, index) => {
              return (
                <Items
                  key={index}
                  index={index}
                  inputField={inputField}
                  inputFields={inputFields}
                  setInputFields={setInputFields}
                  selectBox={substances_name.data.substances}
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
          {instruments_name &&
            instrumentInputFields.map((inputField, index) => {
              return (
                <InstrumentsItems
                  key={index}
                  index={index}
                  inputField={inputField}
                  inputFields={instrumentInputFields}
                  setInputFields={setInstrumentInputFields}
                  selectBox={instruments_name.data.instruments}
                />
              );
            })}
        </div>
        <button
          style={{ backgroundColor: "rgb(233, 30, 99)" }}
          type="button"
          onClick={instrumentsFiled}>
          <BsPlusLg /> اضافة المزيد
        </button>
        <div className={classes.note} dir="rtl">
          <textarea
            placeholder="ملاحظة عامة"
            onChange={(e) => setNote(e.target.value)}></textarea>
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
