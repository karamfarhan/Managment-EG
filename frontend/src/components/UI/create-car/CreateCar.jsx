import { useState } from "react";
import Backdrop from "../backdrop/Backdrop";
import { FaCarSide } from "react-icons/fa";
import Inputs from "../inputs/Inputs";

import classes from "./CreateCar.module.css";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { getCars } from "../../../store/cars-slice";
import { logout } from "../../../store/auth-slice";
const CreateCar = ({ hideModel }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authReducer);

  //hide model

  const [carData, setCarData] = useState({
    car_model: "",
    car_type: "",
    car_number: "",
    driver: "", //select box
    last_maintain: "",
    maintain_place: "",
    note: "",
  });
  const {
    car_model,
    car_type,
    car_number,
    driver,
    last_maintain,
    maintain_place,
    note,
  } = carData;

  //empolyees
  const { data: employeesName } = useQuery(
    "fetch/empolyees",
    async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/employees/select_list/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status === 401) {
          return dispatch(logout());
        }
        return await res.json();
      } catch (err) {
        console.log(err);
      }
    },
    { refetchOnWindowFocus: false }
  );

  //create car
  const { refetch: sendCarData } = useQuery(
    "send/car",
    async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/cars/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify(carData),
        });
        if (res.ok) {
          dispatch(getCars(token));
          hideModel();
        }
        if (res.status === 401) {
          return dispatch(logout());
        }
        return await res.json();
      } catch (err) {
        console.log(err);
      }
    },
    { refetchOnWindowFocus: false, enabled: false }
  );

  //submit handler
  const submitHandler = (e) => {
    e.preventDefault();

    sendCarData();
  };
  return (
    <Backdrop hideModel={hideModel}>
      <div className={classes.createCar}>
        <div className={classes.title}>
          <h3>سيارة جديدة</h3>
          <span>
            <FaCarSide />
          </span>
        </div>
        <form onSubmit={submitHandler}>
          <div className="select">
            <select
              id="empolyee-id "
              value={driver}
              onChange={(e) =>
                setCarData({ ...carData, driver: e.target.value })
              }
              required>
              <option hidden> السائق </option>
              {employeesName &&
                employeesName.map((el) => {
                  return (
                    <option value={el.pk} key={el.pk}>
                      {el.name}
                    </option>
                  );
                })}
            </select>
          </div>
          <Inputs
            placeholder="طراز السيارة"
            id="car-model "
            type="text"
            value={car_model}
            onChange={(e) =>
              setCarData({ ...carData, car_model: e.target.value })
            }
          />
          <Inputs
            placeholder="نوع السيارة"
            id="car-type "
            type="text"
            value={car_type}
            onChange={(e) =>
              setCarData({ ...carData, car_type: e.target.value })
            }
          />
          <Inputs
            placeholder="رقم السيارة"
            id="car-number "
            type="text"
            value={car_number}
            onChange={(e) =>
              setCarData({ ...carData, car_number: e.target.value })
            }
          />
          <Inputs
            id="last-maintain "
            type="date"
            label="أخر صيانة"
            value={last_maintain}
            onChange={(e) =>
              setCarData({ ...carData, last_maintain: e.target.value })
            }
          />
          <Inputs
            placeholder="مكان صيانة"
            id="place-maintain "
            type="text"
            value={maintain_place}
            onChange={(e) =>
              setCarData({ ...carData, maintain_place: e.target.value })
            }
          />
          <textarea
            placeholder="ملاحظة"
            value={note}
            onChange={(e) =>
              setCarData({ ...carData, note: e.target.value })
            }></textarea>

          <button type="submit"> اضافة </button>
        </form>
      </div>
    </Backdrop>
  );
};

export default CreateCar;
