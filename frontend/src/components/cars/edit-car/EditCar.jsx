import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Backdrop from "../../UI/backdrop/Backdrop";
import Inputs from "../../UI/inputs/Inputs";
import { FaCarSide } from "react-icons/fa";
import AuthContext from "../../../context/Auth-ctx";
import { useQuery } from "react-query";
//classes
import classes from "./EditCar.module.css";

const EditCar = ({ hideModel }) => {
  const [car, setCar] = useState({});
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  const params = useParams();
  //car id
  const { driverId } = params;

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/cars/${driverId}/`, {
          method: "Get",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setCar(data);
        return data;
      } catch (err) {
        console.log(err);
      }
    };
    fetchCar();
  }, [driverId, token]);

  const carSelected = car;

  const [carData, setCarData] = useState({
    car_model: carSelected.car_model,
    car_type: carSelected.car_type,
    car_number: carSelected.car_number,
    driver: carSelected.driver, //select box
    last_maintain: carSelected.last_maintain,
    maintain_place: carSelected.maintain_place,
    note: carSelected.note,
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

  //get Car
  //Edit car

  //Edit car
  const { refetch: sendCarData } = useQuery(
    "edit/car",
    async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/cars/${driverId}/`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify(carData),
        });
        if (res.ok) {
          navigate("/cars");
        }
        const data = await res.json();
        console.log(data);
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

        return await res.json();
      } catch (err) {
        console.log(err);
      }
    },
    { refetchOnWindowFocus: false }
  );
  return (
    <Backdrop hideModel={hideModel}>
      <div className={classes.createCar}>
        <div className={classes.title}>
          <h3>تعديل السيارة</h3>
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

          <button type="submit"> تعديل </button>
        </form>
      </div>
    </Backdrop>
  );
};

export default EditCar;
