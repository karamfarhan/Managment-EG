import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../UI/loading/LoadingSpinner";

const StoreEmployee = ({ data, storeId }) => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setLoading] = useState(null);
  //token
  const { token } = useSelector((state) => state.authReducer);
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${window.domain}employees/?location=${storeId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        console.log(data);

        setLoading(false);
        setEmployees(data.results.employees);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    if (data !== undefined || data !== null) {
      fetchEmployees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  console.log(employees);
  return (
    <Fragment>
      {isLoading && <LoadingSpinner />}
      {employees && employees.length === 0 && isLoading === false && (
        <h1>لا يوجد عاملين بالموقع</h1>
      )}

      {employees &&
        employees.length > 0 &&
        isLoading === false &&
        isLoading !== null && (
          <table>
            <thead>
              <th>الأسم</th>
              <th>المسمي الوظيفي</th>
            </thead>
            <tbody>
              {employees &&
                employees.map((el) => {
                  return (
                    <tr key={el.id}>
                      <td> {el.name}</td>
                      <td> {el.job}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
    </Fragment>
  );
};

export default StoreEmployee;
