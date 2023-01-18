import { useState, useContext } from "react";
import { useQuery } from "react-query";
import AuthContext from "../../../context/Auth-ctx";
import Search from "../../UI/search/Search";

const PhaseInOutSecion = ({ id }) => {
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  const [search, setSearch] = useState("");

  const { data, refetch: searchData } = useQuery(
    "search/phasein",
    async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/employees/${id}/activity?search=${search}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return await res.json();
      } catch (err) {}
    },
    { refetchOnWindowFocus: false, enabled: false }
  );
  return (
    <>
      <Search
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        searchData={searchData}
        placeholder="أبحث عن التاريخ yyyy-mm"
      />

      <table>
        {data && data.results && data.results.length === 0 && (
          <p>لا يوجد تسجيلات في هذا الشهر</p>
        )}
        {data &&
          data.results.map((el) => {
            return (
              <>
                <p> حضور/انصراف بتاريخ {el.date} </p>

                <tr>
                  <th> حضور </th>
                  <td>{el.phase_in}</td>
                </tr>
                <tr>
                  <th> انصراف </th>
                  <td>{el.phase_out}</td>
                </tr>
              </>
            );
          })}
      </table>
    </>
  );
};

export default PhaseInOutSecion;
