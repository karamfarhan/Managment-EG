import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { getCars } from "../../../store/cars-slice";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteForever } from "react-icons/md";
import DeleteConfirmation from "../../UI/delete_confirmation/DeleteConfirmation";
import classes from "./CarList.module.css";
const CarList = ({ car_number, driver_name, driver, id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const detailPageHandler = () => {
    navigate(`/cars/${driver}/${id}`);
  };
  const { token } = useSelector((state) => state.authReducer);
  const decoded = jwt_decode(token);

  const { is_superuser, permissions } = decoded;
  const [isDelete, setIsDelete] = useState(false);
  const [carId, setCarId] = useState("");
  //delete handler
  const deleteHandler = async (id) => {
    try {
      const res = await fetch(`${window.domain}/cars/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsDelete(false);
      dispatch(getCars(token));

      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err.message);
    }
  };
  //show delete mode
  const deleteModelHandler = (id) => {
    setIsDelete(true);
    setCarId(id);
  };

  //hide delete mode
  const hideDeleteModel = () => {
    setIsDelete(false);
  };

  //navigate to edit
  const navigateEditHandler = () => {
    navigate(`/cars/edit/${id}`);
  };
  return (
    <Fragment>
      {isDelete && (
        <DeleteConfirmation
          hideModel={hideDeleteModel}
          deleteHandler={deleteHandler}
          id={carId}
        />
      )}

      <div className={classes.car}>
        <header>
          <div onClick={detailPageHandler}>
            <p>
              سائق السيارة <span>{driver_name}</span>{" "}
            </p>
            <p>
              رقم سيارة<span>{car_number}</span>{" "}
            </p>
          </div>
          <div className={classes.actions}>
            {(is_superuser || permissions.includes("delete_car")) && (
              <button
                className="deleteIcon"
                onClick={() => deleteModelHandler(id)}
              >
                <MdOutlineDeleteForever />
              </button>
            )}
            {(is_superuser || permissions.includes("change_car")) && (
              <button className="editIcon" onClick={navigateEditHandler}>
                <FiEdit />
              </button>
            )}
          </div>
        </header>
      </div>
    </Fragment>
  );
};

export default CarList;
