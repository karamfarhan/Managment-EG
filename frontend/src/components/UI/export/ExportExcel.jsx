import { useContext } from "react";
import { useQuery } from "react-query";
import AuthContext from "../../../context/Auth-ctx";

//classes
import classes from "./Excel.module.css";

const ExportExcel = ({ matter, id }) => {
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  console.log(matter);
  console.log(id);

  let link;

  if (id === undefined || id === "") {
    link = `http://127.0.0.1:8000/export/${matter}/`;
  }
  if (id !== undefined) {
    link = `http://127.0.0.1:8000/export/stores/${id}/${matter}/`;
  }

  const { data, refetch } = useQuery(
    "export/excel",
    async () => {
      try {
        const res = await fetch(link, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(res.statusText || "Somethin went wrong");
        }
        const blob = await res.blob();
        const fileURL = window.URL.createObjectURL(blob);
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = `${matter}.xls`;
        alink.click();
      } catch (err) {}
    },
    { refetchOnWindowFocus: false, enabled: false }
  );

  console.log(data);

  return (
    <button className={classes.btn} onClick={refetch}>
      تصدير EXECL
    </button>
  );
};

export default ExportExcel;
