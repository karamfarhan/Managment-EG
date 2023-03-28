import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Backdrop from "../backdrop/Backdrop";
import Inputs from "../inputs/Inputs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import classes from "./CreateSubsModel.module.css";
import { createSubs } from "../../../store/create-substance";
import { createInstruments } from "../../../store/create-instruments";
import { useQuery } from "react-query";
const CreateSubsModel = ({
  hideSubstancesHandler,
  showMattersForm,
  showInstrumentsForm,
}) => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.authReducer);
  // const decoded = jwt_decode(token);
  // const { is_superuser, permissions } = decoded;
  const [substancesData, setSubstancesData] = useState({
    name: "",
    categorty: "",
    quantity: 1,
    note: "",
    last_maintain: "",
    maintain_place: "",
    code: "",
  });

  const [unit_type] = useState([
    "KG",
    "L",
    "TON",
    "M",
    "M²",
    "м³",
    "Paint",
    "Shakara 20",
    "Shakara 25",
    "Shakara 50",
    "Shakara paste",
    "piece",
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

  const { data: categories } = useQuery("category/data", async () => {
    const resposne = await axios.get(`${window.domain}category/select_list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await resposne.data.data.categories;
    console.log(data);

    return data;
  });

  // //authenticated function
  // function subsauth() {
  //   if (is_superuser || permissions.includes("view_substance")) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  // //authenticated function
  // function instauth() {
  //   if (is_superuser || permissions.includes("view_instrument")) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

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
      };

      dispatch(createSubs(obj));
    } else if (showInstrumentsForm === true) {
      const obj = {
        name,
        description,
        token: token,
        last_maintain,
        maintain_place,
      };
      dispatch(createInstruments(obj));
    }

    navigate("/create_subs");

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
          {showMattersForm && (
            <div className={classes.selectType}>
              <select
                defaultValue={selectBox}
                onChange={(e) => setSelectBox(e.target.value)}
                required
              >
                <option hidden selected>
                  التصنيف
                </option>
                {categories &&
                  categories.map((value, i) => {
                    return (
                      <option value={value._id} key={value._id}>
                        {value.category_name}
                      </option>
                    );
                  })}
              </select>
            </div>
          )}
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
                {unit_type.map((value, i) => {
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
