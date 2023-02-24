import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const StoreEmployee = ({ data }) => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setLoading] = useState(null);
  //token
  const { token } = useSelector((state) => state.authReducer);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
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
        setLoading(false);

        setEmployees(results.results);
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

  return (
    <Fragment>
      {employees.length === 0 && isLoading === false && isLoading !== null && (
        <h1>لا يوجد عاملين بالموقع</h1>
      )}

      {employees.length > 0 && isLoading === false && isLoading !== null && (
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
                    <td> {el.type}</td>
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
