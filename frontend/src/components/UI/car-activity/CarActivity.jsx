import { useState } from "react";
import Backdrop from "../backdrop/Backdrop";
import Inputs from "../inputs/Inputs";
import Items from "./Items";
import { BsPlusLg } from "react-icons/bs";
import classes from "./CarActivity.module.css";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { getCars } from "../../../store/cars-slice";

const CarActivity = ({ hideModel, id, driver }) => {
  const { token } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const [carData, setCarData] = useState({
    activity_date: "",
    distance: "",
    notes: "",
  });
  const { activity_date, distance, description, notes } = carData;
  const [inputFields, setInputFields] = useState([
    { place_from: "", place_to: "" },
  ]);

  const handleAddFields = () => {
    setInputFields([...inputFields, { place_from: "", place_to: "" }]);
  };

  //send car activity
  const { data, refetch } = useQuery(
    "send/activity",
    async () => {
      try {
        const res = await fetch(`${window.domain}cars/${id}/car-activity/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            activity_date,
            distance,
            description,
            destination: inputFields,
            notes,
          }),
        });
        if (res.ok) {
          //  dispatch(getCars(token));
          hideModel();
        }
        const data = await res.json();

        return await res.json();
      } catch (err) {}
    },
    { enabled: false, refetchOnWindowFocus: false }
  );
  // submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    refetch();
  };

  return (
    <Backdrop hideModel={hideModel}>
      <div className={classes.car_activity}>
        <h2>برجاء تسجيل أخر تحركات للسيارة </h2>
        <form onSubmit={submitHandler}>
          <Inputs
            type="date"
            label="التاريخ"
            value={activity_date}
            onChange={(e) =>
              setCarData({ ...carData, activity_date: e.target.value })
            }
          />
          <Inputs
            type="text"
            placeholder="اجمالي المسافة المقطوعة"
            value={distance}
            onChange={(e) =>
              setCarData({ ...carData, distance: e.target.value })
            }
          />
          <p> أدخل خط السير </p>

          {inputFields.map((input, i) => {
            return (
              <Items
                key={i}
                index={i}
                inputField={input}
                inputFields={inputFields}
                setInputFields={setInputFields}
              />
            );
          })}
          <button type="button" onClick={handleAddFields}>
            <BsPlusLg />{" "}
            {inputFields.length === 0 ? "سجل تحركات السيارة" : "اضافة المزيد"}
          </button>

          <textarea
            placeholder="ملاحظات"
            value={description}
            onChange={(e) =>
              setCarData({ ...carData, description: e.target.value })
            }
          ></textarea>
          <button type="submit">تأكيد</button>
        </form>
      </div>
    </Backdrop>
  );
};

export default CarActivity;
