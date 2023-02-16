import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ExportExcel from "../../UI/export/ExportExcel";
import LoadingSpinner from "../../UI/loading/LoadingSpinner";
import Invoices from "./invoices/Invoices";

//classes
import classes from "./StoreDetail.module.css";

const StoreDetail = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(null);
  const params = useParams();
  const { storeId } = params;

  //token
  const { token } = useSelector((state) => state.authReducer);
  //get store
  const getTheStore = useCallback(async () => {
    setIsLoading(true);

    try {
      setIsLoading(true);

      const res = await fetch(`${window.domain}/stores/${storeId}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setIsLoading(false);

      const data = await res.json();
      setData(data);
    } catch (err) {
      console.log(err);
    }
  }, [storeId, token]);

  useEffect(() => {
    getTheStore();
  }, [getTheStore]);
  console.log(data.invoices);
  return (
    <div className={classes.content}>
      {isLoading && <LoadingSpinner />}
      {!isLoading && Object.keys(data).length !== 0 && (
        <div dir="rtl">
          <ExportExcel id={data.id} matter="invoices" />

          <h2>
            التحويلات الخاصة <span>{data.name}</span>{" "}
          </h2>
          {/* <p>
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
          </p> */}
          {data.invoices.length === 0 && <p>لا يوجد تحويلات</p>}
          {data.invoices.length > 0 && (
            <div>
              <Invoices store={data} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoreDetail;
