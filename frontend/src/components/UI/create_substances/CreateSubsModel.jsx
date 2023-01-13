import { Fragment, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import AuthContext from "../../../context/Auth-ctx";
import Backdrop from "../backdrop/Backdrop";
import Inputs from "../inputs/Inputs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import classes from "./CreateSubsModel.module.css";
import { createSubs } from "../../../store/create-substance";
import { getSubs } from "../../../store/create-substance";
import { createInstruments } from "../../../store/create-instruments";
import { getInstruments } from "../../../store/create-instruments";
const CreateSubsModel = ({
  hideSubstancesHandler,
  showMattersForm,
  showInstrumentsForm,
  showMattersPage,
  instrumentsPage,
}) => {
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  const [categortyBtn, setCategoryBtn] = useState(["مادة سائلة", "مادة صلبة"]);

  const [substancesData, setSubstancesData] = useState({
    name: "",
    categorty: "",
    quantity: 1,
    description: "",
    last_maintain: "",
    maintain_place: "",
  });
  const [selectType, setSelectType] = useState(["T", "KL", "L"]);
  const [selectBox, setSelectBox] = useState("");

  const dispatch = useDispatch();
  const {
    name,

    quantity,
    description,
    last_maintain,
    maintain_place,
  } = substancesData;

  //form validation
  let formIsValid = false;

  if (showMattersForm) {
    if (name.trim() !== "" && selectBox.trim() !== "") {
      formIsValid = true;
    }
  }
  if (showInstrumentsForm) {
    if (
      name.trim() !== "" &&
      last_maintain.trim() !== "" &&
      maintain_place.trim() !== ""
    ) {
      formIsValid = true;
    }
  }
  //submit handler

  const submitHandler = (e) => {
    e.preventDefault();

    if (formIsValid === false) return;
    //post subtances
    if (showMattersPage) {
      const obj = {
        name,
        unitType: selectBox,
        quantity,
        description,
        token: token,
      };
      dispatch(createSubs(obj));
      console.log("CREATED SUBS");
    }

    if (showInstrumentsForm) {
      const obj = {
        name,
        description,
        token: token,
        last_maintain,
        maintain_place,
      };
      dispatch(createInstruments(obj));
      console.log("CREATED INSTRUM");
    }

    hideSubstancesHandler();
  };

  return (
    <Fragment>
      <Backdrop hideModel={hideSubstancesHandler} />
      <div className={classes.form}>
        <span className={classes.closeModel} onClick={hideSubstancesHandler}>
          <AiOutlineCloseCircle />{" "}
        </span>

        <h2> {showInstrumentsForm ? "اضافة اله - جهاز" : "اضافة مادة"} </h2>
        <form onSubmit={submitHandler}>
          <Inputs
            type="text"
            placeholder={showInstrumentsForm ? "أسم الاله" : "أسم المادة"}
            value={name}
            required
            onChange={(e) =>
              setSubstancesData({ ...substancesData, name: e.target.value })
            }
          />

          {showInstrumentsForm && (
            <div style={{ textAlign: "start" }}>
              <label>برجاء ادخال معاد اخر صيانة</label>
              <Inputs
                type="date"
                placeholder="أخر صيانة"
                value={last_maintain}
                required
                onChange={(e) =>
                  setSubstancesData({
                    ...substancesData,
                    last_maintain: e.target.value,
                  })
                }
              />
            </div>
          )}
          {showInstrumentsForm && (
            <Inputs
              type="text"
              placeholder="مكان الصيانة"
              value={maintain_place}
              required
              onChange={(e) =>
                setSubstancesData({
                  ...substancesData,
                  maintain_place: e.target.value,
                })
              }
            />
          )}
          {showMattersForm && (
            <div className={classes.selectType}>
              <select
                value={selectBox}
                onChange={(e) => setSelectBox(e.target.value)}
                required>
                <option hidden selected>
                  وحدة القياس
                </option>
                {selectType.map((value, i) => {
                  return (
                    <option value={value} key={i}>
                      {" "}
                      {value}{" "}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          {showMattersForm && (
            <Inputs
              type="number"
              placeholder="الكمية"
              min="1"
              value={quantity}
              required
              onChange={(e) =>
                setSubstancesData({
                  ...substancesData,
                  quantity: e.target.value,
                })
              }
            />
          )}

          <Inputs
            type="text"
            placeholder="الوصف"
            value={description}
            onChange={(e) =>
              setSubstancesData({
                ...substancesData,
                description: e.target.value,
              })
            }
          />
          {/* <div className={classes.actions}>
            {categortyBtn.map((el, i) => {
              return (
                <button value={el} type="button" key = {i}>
                  {el}
                </button>
              );
            })
          </div>*/}
          <button type="submit" disabled={!formIsValid}>
            أضف
          </button>
        </form>
      </div>
    </Fragment>
  );
};

export default CreateSubsModel;
