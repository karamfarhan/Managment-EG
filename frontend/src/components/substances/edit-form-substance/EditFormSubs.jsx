import { useState, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSubs } from "../../../store/create-substance";
import Backdrop from "../../UI/backdrop/Backdrop";
import Inputs from "../../UI/inputs/Inputs";
import classes from "./EditFormSubs.module.css";
const EditFormSubs = ({ subsEl, setCurrentPage }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const elId = parseInt(params.edit);
  const { token } = useSelector((state) => state.authReducer);

  const selectedSubs =
    subsEl && subsEl.results && subsEl.results.find((el) => el.id === elId);
  if (selectedSubs === null) {
    backHandler();
  }
  //state
  const [subsData, setSubsData] = useState({
    name: selectedSubs.name,
    quantity: selectedSubs.units,
    description: selectedSubs.description,
    unit_type: selectedSubs.unit_type,
  });

  const [selectType, setSelectType] = useState(selectedSubs.unit_type);
  const [unitTypes, setUnitTypes] = useState([
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
  let nameVar = selectedSubs.email,
    descriptionVar = selectedSubs.description,
    quantityVar = selectedSubs.units,
    typeVar = selectedSubs.unit_type;

  //validation form
  let formIsValid = false;

  if (
    (subsData.name.trim() !== "" &&
      (subsData.name !== selectedSubs.name ||
        subsData.description !== selectedSubs.description ||
        selectType !== subsData.unit_type)) ||
    quantityVar !== subsData.quantity
  ) {
    formIsValid = true;
  }

  //navigate
  const navigate = useNavigate();
  //edit
  const editSubs = async () => {
    const obj = {
      name: subsData.name,
      description: subsData.description,
      unit_type: selectType,
      units: subsData.quantity,
    };
    if (obj.name === nameVar) {
      delete obj.name;
    }
    if (obj.description === descriptionVar) {
      delete obj.description;
    }
    if (obj.quantity === quantityVar) {
      delete obj.quantity;
    }
    if (obj.unit_type === typeVar) {
      delete obj.unit_type;
    }
    console.log(obj);
    try {
      const res = await fetch(`http://127.0.0.1:8000/substances/${elId}/`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      });
      dispatch(getSubs(token));
      //setCurrentPage(2);
      return await res.json();
    } catch (err) {
      console.log(err);
    }
  };
  const currentPage = parseInt(sessionStorage.getItem("current-page"));

  //submit Handler
  const submitHandler = (e) => {
    e.preventDefault();
    if (formIsValid === false) return;
    editSubs();
    setCurrentPage(1);
    navigate("/create_subs");
  };
  function backHandler() {
    navigate("/create_subs");
  }

  return (
    <Fragment>
      <Backdrop hideModel={() => navigate("/create_subs")}>
        <form className={classes.form} onSubmit={submitHandler}>
          <Inputs
            type="text"
            name="sub-name"
            placeholder="أسم المادة"
            value={subsData.name}
            onChange={(e) => setSubsData({ ...subsData, name: e.target.value })}
          />
          <Inputs
            type="number"
            name="sub-qunatity"
            placeholder="الكمية"
            min="1"
            step="1"
            value={subsData.quantity}
            onChange={(e) =>
              setSubsData({ ...subsData, quantity: e.target.value })
            }
          />
          <div className={classes.selectType}>
            <select
              value={selectType}
              onChange={(e) => setSelectType(e.target.value)}
            >
              {unitTypes.map((option, i) => {
                return (
                  <option key={i} value={option}>
                    {" "}
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
          <Inputs
            type="text"
            name="sub-description"
            placeholder="معلومات اضافية"
            value={subsData.description}
            onChange={(e) =>
              setSubsData({ ...subsData, description: e.target.value })
            }
          />
          <button disabled={!formIsValid} type="submit">
            {" "}
            تعديل{" "}
          </button>
          <button type="button" onClick={() => navigate("/create_subs")}>
            {" "}
            الغاء{" "}
          </button>
        </form>
      </Backdrop>
    </Fragment>
  );
};

export default EditFormSubs;
