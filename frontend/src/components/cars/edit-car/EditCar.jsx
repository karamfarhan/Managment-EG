import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Backdrop from "../../UI/backdrop/Backdrop";
import Inputs from "../../UI/inputs/Inputs";
import { FaCarSide } from "react-icons/fa";
import { useQuery } from "react-query";
//classes
import classes from "./EditCar.module.css";
import { getCars } from "../../../store/cars-slice";

const EditCar = ({ hideModel, id }) => {
  const [carData, setCarData] = useState({
    car_model: "",
    car_type: "",
    car_number: "",
    driver: "", //select box
    last_maintain: "",
    maintain_place: "",
    car_counter: "",
    note: "",
  });
  const { token } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  //car id
  let formIsValid = false;

  if (
    carData.car_model.trim() !== "" &&
    carData.car_type.trim() !== "" &&
    carData.car_number.trim() !== "" &&
    carData.driver !== "" &&
    carData.last_maintain !== "" &&
    carData.maintain_place.trim() !== ""
  ) {
    formIsValid = true;
  }

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`${window.domain}/cars/${id}/`, {
          method: "Get",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const car = await res.json();
        setCarData({
          car_model: car.car_model,
          car_type: car.car_type,
          car_number: car.car_number,
          driver: car.driver, //select box
          last_maintain: car.last_maintain,
          maintain_place: car.maintain_place,
          note: car.note,
          car_counter: car.car_counter,
        });
        return car;
      } catch (err) {
        console.log(err);
      }
    };
    fetchCar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const {
    car_model,
    car_type,
    car_number,
    driver,
    last_maintain,
    maintain_place,
    car_counter,
    note,
  } = carData;

  //get Car
  //Edit car

  //Edit car
  const { refetch: sendCarData } = useQuery(
    "edit/car",
    async () => {
      try {
        const res = await fetch(`${window.domain}/cars/${id}/`, {
          method: "PATCH",
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
        const res = await fetch(`${window.domain}/employees/select_list/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
              required
            >
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
          <Inputs
            placeholder="عداد السيارة"
            id="car_counter "
            type="text"
            value={car_counter}
            onChange={(e) =>
              setCarData({ ...carData, car_counter: e.target.value })
            }
          />
          <textarea
            placeholder="ملاحظة"
            value={note}
            onChange={(e) => setCarData({ ...carData, note: e.target.value })}
          ></textarea>

          <button disabled={!formIsValid} type="submit">
            {" "}
            تعديل{" "}
          </button>
          <button onClick={() => hideModel()}> الغاء </button>
        </form>
      </div>
    </Backdrop>
  );
};

export default EditCar;
