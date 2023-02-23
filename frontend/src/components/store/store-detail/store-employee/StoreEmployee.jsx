import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const StoreEmployee = ({ data }) => {
  const [employees, setEmployees] = useState([]);
  //token
  const { token } = useSelector((state) => state.authReducer);

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
        console.log(results);

        setEmployees(results.results);
      } catch (err) {
        console.log(err);
      }
    };

    if (data !== undefined || data !== null) {
      fetchEmployees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  console.log(employees);
  console.log(data.address);
  return (
    <Fragment>
      {employees.length === 0 && <h1>لا يوجد عاملين بالموقع</h1>}

      {employees.length > 0 && (
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
