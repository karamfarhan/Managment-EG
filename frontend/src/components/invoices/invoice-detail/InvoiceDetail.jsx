import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { AiOutlinePrinter } from "react-icons/ai";
//style
import classes from "./InvoiceDetail.module.css";
import ExportExcel from "../../UI/export/ExportExcel";

const InvoiceDetail = () => {
  const { token } = useSelector((state) => state.authReducer);

  const param = useParams();
  //invoice id
  const { invoiceId } = param;
  //fetch invoices
  const { data: invoice } = useQuery(
    "fetch/invoice",
    async () => {
      try {
        const res = await fetch(`${window.domain}invoices/${invoiceId}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data);
        return data.invoice;
      } catch (err) {}
    },
    { refetchOnWindowFocus: false }
  );
  return (
    <>
      <div dir="rtl" className={classes["invoice-container"]}>
        <div>
          <h2>بيانات الصرف</h2>

          <div className={classes.detail}>
            <h4> أسم المخزن : {invoice && invoice.store.store_name} </h4>
            <h4>
              تاريخ التحويل :
              {new Date(invoice && invoice.created_at).toLocaleDateString()}
            </h4>
            <h4> الملاحظات المهمة : {invoice && invoice.notes} </h4>
          </div>

          {/* <ExportExcel id={param.storeId} matter="invoices" /> */}
          <button className={classes.printBtn} onClick={() => window.print()}>
            طباعة اذن التحويل{" "}
            <span>
              {" "}
              <AiOutlinePrinter />{" "}
            </span>
          </button>
        </div>
        <table>
          <thead>
            <th> المواد المحولة الي المخزن </th>
            <th>الكمية </th>
            <th>الوصف </th>
          </thead>
          <tbody>
            {invoice &&
              invoice &&
              invoice.substance &&
              invoice.substance.map((subs, i) => {
                return (
                  <tr key={i}>
                    <td>
                      {" "}
                      {subs.substance === null
                        ? "غير معروف"
                        : subs.substance.name}{" "}
                    </td>
                    <td> {subs.quantity} </td>
                    <td> {subs.notes} </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/*instruments*/}

        <table>
          <thead>
            <th> الالات المحولة الي المخزن </th>
            <th>الوصف </th>
          </thead>
          <tbody>
            {invoice &&
              invoice &&
              invoice.instrument &&
              invoice.instrument.map((instru, i) => {
                return (
                  <tr key={i}>
                    <td>
                      {instru === null ? "غير معروف" : instru.instrument.name}{" "}
                    </td>
                    <td> {instru.notes} </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <div className={classes.signature}>
          {" "}
          <h3>توقيع امين المخزن</h3>
          <h3>توقيع المراجع </h3>
        </div>
      </div>
    </>
  );
};

export default InvoiceDetail;
