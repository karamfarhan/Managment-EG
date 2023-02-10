import { useQuery } from "react-query";
import { useSelector } from "react-redux";

//classes
import classes from "./Excel.module.css";

const ExportExcel = ({ matter, id }) => {
  const { token } = useSelector((state) => state.authReducer);

  let link;

  if (id === undefined || id === "") {
    link = `${window.domain}/export/${matter}/`;
  }
  if (id !== undefined) {
    link = `${window.domain}/export/stores/${id}/${matter}/`;
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
