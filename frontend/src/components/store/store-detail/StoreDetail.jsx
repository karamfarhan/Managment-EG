import { useEffect, useContext, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../../../context/Auth-ctx";
import Invoices from "./invoices/Invoices";

//classes
import classes from "./StoreDetail.module.css";

const StoreDetail = () => {
  const [data, setData] = useState({});
  const params = useParams();
  const { storeId } = params;

  //token
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  //get store

  const getTheStore = useCallback(async () => {
    const res = await fetch(`http://127.0.0.1:8000/stores/${storeId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log(data);
    setData(data);
  }, [storeId, token]);

  useEffect(() => {
    getTheStore();
  }, [getTheStore]);

  return (
    <div className={classes.content}>
      <div dir="rtl">
        <h2> {data.name}</h2>
        <p>
          تم انشاء المخزن في :
          <span> {new Date(data.created_at).toLocaleString()} </span>{" "}
        </p>
        <div>
          <p>
            الموقع المرتبط بالمخزن : <span> {data.address}</span>
          </p>
        </div>
        <p>
          <span>{data.description}</span>
        </p>
        <p className={classes.status}>
          حالة المخزن : <span>{data.isActive ? "غير نشط" : " نشط"} </span>{" "}
        </p>
        <div>
          <Invoices store={data} />
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;
