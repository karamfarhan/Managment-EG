import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Backdrop from "../backdrop/Backdrop";
import Inputs from "../inputs/Inputs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import classes from "./CreateSubsModel.module.css";
import { createSubs } from "../../../store/create-substance";
import { createInstruments } from "../../../store/create-instruments";
const CreateSubsModel = ({
  hideSubstancesHandler,
  showMattersForm,
  showInstrumentsForm,
}) => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.authReducer);
  const decoded = jwt_decode(token);
  const { is_superuser, permissions } = decoded;
  const [substancesData, setSubstancesData] = useState({
    name: "",
    categorty: "",
    quantity: 1,
    description: "",
    last_maintain: "",
    maintain_place: "",
  });

  const [selectType] = useState([
    "كيلوجرام",
    "لتر",
    "طن",
    "متر طولي",
    "متر مربع",
    "متر مكعب",
    "دهان",
    "شكارة 20",
    "شكارة 25",
    "شكارة 50",
    "شكارة معجون",
    "قطعة",
  ]);
  const [selectBox, setSelectBox] = useState("");

  const dispatch = useDispatch();
  const { name, quantity, description, last_maintain, maintain_place } =
    substancesData;

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

  //authenticated function
  function subsauth() {
    if (is_superuser || permissions.includes("view_substance")) {
      return true;
    } else {
      return false;
    }
  }
  //authenticated function
  function instauth() {
    if (is_superuser || permissions.includes("view_instrument")) {
      return true;
    } else {
      return false;
    }
  }

  //submit handler
  const submitHandler = (e) => {
    e.preventDefault();

    if (formIsValid === false) return;
    //post subtances
    if (showMattersForm === true) {
      const obj = {
        name,
        unitType: selectBox,
        quantity,
        description,
        token: token,
        authenticated: subsauth(),
      };

      dispatch(createSubs(obj));
    } else if (showInstrumentsForm === true) {
      const obj = {
        name,
        description,
        token: token,
        last_maintain,
        maintain_place,
        authenticated: instauth(),
      };
      dispatch(createInstruments(obj));
    }
    if (is_superuser || subsauth() || instauth()) {
      navigate("/create_subs");
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

        <form onSubmit={submitHandler}>
          <h2> {showInstrumentsForm ? "اضافة اله - جهاز" : "اضافة مادة"} </h2>

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
                defaultValue={selectBox}
                onChange={(e) => setSelectBox(e.target.value)}
                required
              >
                <option hidden selected>
                  وحدة القياس
                </option>
                {selectType.map((value, i) => {
                  return (
                    <option value={value} key={i}>
                      {value}
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

          <button type="submit" disabled={!formIsValid}>
            أضف
          </button>
        </form>
      </div>
    </Fragment>
  );
};

export default CreateSubsModel;
