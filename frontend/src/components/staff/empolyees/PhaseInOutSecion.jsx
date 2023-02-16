import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import Search from "../../UI/search/Search";

const PhaseInOutSecion = ({ id }) => {
  const { token } = useSelector((state) => state.authReducer);

  const [search, setSearch] = useState("");

  const { data, refetch: searchData } = useQuery(
    "search/phasein",
    async () => {
      try {
        const res = await fetch(
          `${window.domain}/employees/${id}/activity?search=${search}`,
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
