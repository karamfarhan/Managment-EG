import { useState } from "react";
import { FaCarSide } from "react-icons/fa";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from "../backdrop/Backdrop";


import Inputs from "../inputs/Inputs";

import { logout } from "../../../store/auth-slice";
import { getCars } from "../../../store/cars-slice";
import classes from "./CreateCar.module.css";

const CreateCar = ({ hideModel }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authReducer);
  // const decoded = jwt_decode(token);

  // const { is_superuser, permissions } = decoded;

  //hide model

  const [carData, setCarData] = useState({
    car_model: "",
    car_type: "",
    car_number: "",
    driver: "", //select box
    last_maintain: "",
    maintain_place: "",
    note: "",
    counter: "",
  });
  const {
    car_model,
    car_type,
    car_number,
    driver,
    last_maintain,
    maintain_place,
    note,
    counter,
  } = carData;

  let formIsValid = false;

  if (
    car_model.trim() !== "" &&
    car_type.trim() !== "" &&
    driver !== "" &&
    last_maintain !== "" &&
    maintain_place.trim() !== ""
  ) {
    formIsValid = true;
  }

  //empolyees
  const { data: drivers } = useQuery(
    "fetch/empolyees",
    async () => {
      try {
        const res = await fetch(`${window.domain}employees/select-driver`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 401) {
          return dispatch(logout());
        }
        const data =  await res.json();
      
       const driverNames = data.results.employees

       return driverNames
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
        const res = await fetch(`${window.domain}cars/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify(carData),
        });
        if (res.ok) {
          hideModel();
            dispatch(getCars(token));
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
              required
            >
              <option hidden> السائق </option>
              {drivers &&
                drivers.map((el) => {
                  return (
                    <option value={el._id} key={el._id}>
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
          <Inputs
            placeholder="عداد السيارة"
            id="counter"
            value={counter}
            onChange={(e) =>
              setCarData({ ...carData, counter: e.target.value })
            }
          />
          <textarea
            placeholder="ملاحظة"
            value={note}
            onChange={(e) => setCarData({ ...carData, note: e.target.value })}
          ></textarea>

          <button disabled={!formIsValid} type="submit">
            {" "}
            اضافة{" "}
          </button>
        </form>
      </div>
    </Backdrop>
  );
};

export default CreateCar;
