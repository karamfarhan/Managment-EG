import { useEffect, useState, useCallback, Fragment } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ExportExcel from "../../UI/export/ExportExcel";
import LoadingSpinner from "../../UI/loading/LoadingSpinner";
import Invoices from "./invoices/Invoices";

//classes
import classes from "./StoreDetail.module.css";
import StoreEmployee from "./store-employee/StoreEmployee";
import StoreProjects from "./store-projects/StoreProjects";
import StoreInvoices from "./store-invoices/StoreInvoices";

const StoreDetail = () => {
  const [data, setData] = useState({});
  const [sections, setSections] = useState({
    invoices: false,
    employees: false,
    projects: false,
  });
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

      const res = await fetch(`${window.domain}stores/${storeId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsLoading(false);

      const data = await res.json();
      console.log(data);
      setData(data);
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  useEffect(() => {
    getTheStore();
  }, [getTheStore]);
  const { employees: store_employee, invoices, projects } = sections;

  return (
    <Fragment>
      {isLoading === true && <LoadingSpinner />}
      {isLoading === false && isLoading !== null && (
        <div className={classes.content} dir="rtl">
          <nav>
            <ul>
              {/* <li
                onClick={() => setSections({ projects: true })}
                className={projects === true ? classes.active : ""}>
                المشروعات
              </li> */}
              <li
                onClick={() => setSections({ invoices: true })}
                className={invoices === true ? classes.active : ""}>
                التحويلات
              </li>
              <li
                onClick={() => setSections({ employees: true })}
                className={store_employee === true ? classes.active : ""}>
                العاملين بالموقع
              </li>
            </ul>
          </nav>

          {/* employees  */}
          {sections.employees === true && (
            <div>
              {" "}
              <StoreEmployee data={data} />
            </div>
          )}
          {/* 
          {sections.projects === true && (
            <div>
              {" "}
              <StoreProjects data={data} />{" "}
            </div>
          )} */}
          {/* invoices */}

          {invoices === true && isLoading === false && isLoading !== null && (
            <div>
              <StoreInvoices data={data} invoices={data.invoices} />{" "}
            </div>
          )}

          {/* <div>{sections.invoices === true && <StoreInvoices data={data} />}</div> */}

          {/* {isLoading && <LoadingSpinner />}
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
    )} */}
        </div>
      )}
    </Fragment>
  );
};

export default StoreDetail;
