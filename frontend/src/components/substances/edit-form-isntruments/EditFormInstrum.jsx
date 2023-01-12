import { useState, Fragment, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getSubs } from "../../../store/create-substance";
import AuthContext from "../../../context/Auth-ctx";
import Backdrop from "../../UI/backdrop/Backdrop";
import Inputs from "../../UI/inputs/Inputs";
import classes from "./EditFormInstrum.module.css";
import { getInstruments } from "../../../store/create-instruments";
const EditFormInstrum = ({ instruments, setCurrentPage }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const elId = parseInt(params.edit);
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  const selectedInstrument =
  instruments && instruments.results && instruments.results.find((el) => el.id === elId);

  //state
  const [instrumData, setInstrumData] = useState({
    name: selectedInstrument.name,
    description: selectedInstrument.description,
    last_maintain: selectedInstrument.last_maintain,
  });

  const [unitTypes, setUnitTypes] = useState(["T", "KL", "L"]);

  let nameVar = selectedInstrument.name,
    descriptionVar = selectedInstrument.description,
    last_maintainVar = selectedInstrument.last_maintain;

  //validation form
  let formIsValid = false;

  if (
    (instrumData.name.trim() !== "" )  &&
    (instrumData.name !== selectedInstrument.name ||
      instrumData.description !== selectedInstrument.description ||
      instrumData.last_maintain !== selectedInstrument.unit_type)
  ) {
    formIsValid = true;
  }

  //navigate
  const navigate = useNavigate();
  //edit
  const editSubs = async () => {
    const obj = {
      name: instrumData.name,
      description: instrumData.description,
      last_maintain: instrumData.last_maintain,
    };
    // if (obj.name === nameVar) {
    //   delete obj.name;
    // }
    // if (obj.description === descriptionVar) {
    //   delete obj.description;
    // }
    // if (obj.quantity === quantityVar) {
    //   delete obj.quantity;
    // }
    // if (obj.unit_type === typeVar) {
    //   delete obj.unit_type;
    // }
    console.log(obj);
    try {
      const res = await fetch(`http://127.0.0.1:8000/instruments/${elId}/`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      });
      dispatch(getInstruments(token));
      const data = await res.json();
    } catch (err) {
      console.log(err);
    }
  };
 

  //submit Handler
  const submitHandler = (e) => {
    e.preventDefault();
    if (formIsValid === false) return;
    editSubs();
    setCurrentPage(1);
    navigate("/create_subs");
  };
  const backHandler = () => {
    navigate("/create_subs");
  };

  return (
    <Fragment>
      <Backdrop>
        <form className={classes.form} onSubmit={submitHandler}>
          <Inputs
            type="text"
            name="sub-name"
            placeholder="أسم الماكينة"
            value={instrumData.name}
            onChange={(e) => setInstrumData({ ...instrumData, name: e.target.value })}
          />
          <Inputs
            type="date"
            name="last_maintain"
            placeholder="أخر صيانة"
            value={instrumData.last_maintain}
            onChange={(e) =>
              setInstrumData({ ...instrumData, last_maintain: e.target.value })
            }
          />
          <Inputs
            type="text"
            name="sub-description"
            placeholder="معلومات اضافية"
            value={instrumData.description}
            onChange={(e) =>
              setInstrumData({ ...instrumData, description: e.target.value })
            }
          />
          <button disabled={!formIsValid} type="submit">
            تعديل
          </button>
          <button type="button" onClick={() => navigate("/create_subs")}>
            الغاء
          </button>
        </form>
      </Backdrop>
    </Fragment>
  );
};

export default EditFormInstrum;
