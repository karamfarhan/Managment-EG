import { useEffect, useState, useCallback } from "react";
import { useQuery } from "react-query";
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
  const [employees, setEmployees] = useState([]);
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
  }, [storeId]);
  //staff

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(
          `${window.domain}/employees/?search=${data.address}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const results = await res.json();
        setEmployees(results.results);
        console.log(results);
        console.log(employees);
      } catch (err) {
        console.log(err);
      }
    };

    if (data !== undefined || data !== null) {
      fetchEmployees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  //gallery
  useEffect(() => {
    const fetchImg = async () => {
      try {
        const res = await fetch(
          `${window.domain}/images/?search=${data.name}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const d = await res.json();
        console.log(d);
      } catch (err) {
        console.log(err);
      }
    };

    if (data !== undefined || data !== null) {
      fetchImg();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  console.log(employees);
  useEffect(() => {
    getTheStore();
  }, [getTheStore]);
  return (
    <div className={classes.content}>
      {isLoading && <LoadingSpinner />}
      {!isLoading && Object.keys(data).length !== 0 && (
        <div dir="rtl">
          <ExportExcel id={data.id} matter="invoices" />

          <h2>
            التحويلات الخاصة <span>{data.name}</span>{" "}
          </h2>

          {data.invoices.length === 0 && <p>لا يوجد تحويلات</p>}
          {data.invoices.length > 0 && (
            <div>
              <Invoices store={data} />
            </div>
          )}

          <div>
            <h2>الموظفين بالشركة</h2>

            <div>
              {employees &&
                employees.map((el) => {
                  return <p key={el.id}> {el.name} </p>;
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDetail;
