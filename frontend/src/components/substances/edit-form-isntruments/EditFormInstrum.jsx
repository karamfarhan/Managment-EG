import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from "../../UI/backdrop/Backdrop";
import Inputs from "../../UI/inputs/Inputs";
import classes from "./EditFormInstrum.module.css";
import { getInstruments } from "../../../store/create-instruments";
const EditFormInstrum = ({ instruments, setCurrentPage }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const elId = parseInt(params.edit);
  const { token } = useSelector((state) => state.authReducer);

  const selectedInstrument =
    instruments &&
    instruments.results &&
    instruments.results.find((el) => el.id === elId);

  //state
  const [instrumData, setInstrumData] = useState({
    name: selectedInstrument.name,
    description: selectedInstrument.description,
    last_maintain: selectedInstrument.last_maintain,
    maintain_site: selectedInstrument.maintain_place,
    in_action: selectedInstrument.in_action,
  });

  let nameVar = selectedInstrument.name,
    descriptionVar = selectedInstrument.description,
    last_maintainVar = selectedInstrument.last_maintain,
    maintainSite = selectedInstrument.maintain_place,
    inAction = selectedInstrument.in_action;

  //validation form
  let formIsValid = false;

  if (
    (instrumData.name.trim() !== "" &&
      (instrumData.name !== nameVar ||
        instrumData.description !== descriptionVar ||
        instrumData.last_maintain !== last_maintainVar)) ||
    (instrumData.maintain_site.trim() !== "" &&
      maintainSite !== instrumData.maintain_site) ||
    instrumData.in_action !== inAction
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
      maintain_place: instrumData.maintain_site,
      in_action: instrumData.in_action === "true" ? true : false,
    };
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
      return data;
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

  return (
    <Backdrop hideModel={() => navigate("/create_subs")}>
      <form className={classes.form} onSubmit={submitHandler}>
        <Inputs
          type="text"
          name="sub-name"
          placeholder="أسم الماكينة"
          value={instrumData.name}
          onChange={(e) =>
            setInstrumData({ ...instrumData, name: e.target.value })
          }
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
          name="last_maintain"
          placeholder="مكان الصيانة"
          value={instrumData.maintain_site}
          onChange={(e) =>
            setInstrumData({ ...instrumData, maintain_site: e.target.value })
          }
        />

        <div className="select">
          <select
            value={instrumData.in_action}
            onChange={(e) =>
              setInstrumData({ ...instrumData, in_action: e.target.value })
            }
          >
            <option value={false}> موجودة بالمخزن </option>
            <option value={true}> غير موجودة </option>
          </select>
        </div>

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
  );
};

export default EditFormInstrum;
