import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";

//style
import classes from "./InvoiceDetail.module.css";
import ExportExcel from "../../UI/export/ExportExcel";

const InvoiceDetail = () => {
  const { token } = useSelector((state) => state.authReducer);

  const param = useParams();
  console.log(param);
  //invoice id
  const { invoiceId } = param;
  //fetch invoices
  const { data: invoice } = useQuery("fetch/invoice", async () => {
    try {
      const res = await fetch(`${window.domain}/invoices/${invoiceId}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return await res.json();
    } catch (err) {}
  });

  return (
    <>
      <div dir="rtl" className={classes["invoice-container"]}>
        <div>
          <h2>بيانات الصرف</h2>
          <p>
            تاريخ التحويل :
            {new Date(invoice && invoice.created_at).toLocaleString()}
          </p>
          <h3> الملاحظات المهمة : {invoice && invoice.note} </h3>
          <ExportExcel id={param.storeId} matter="invoices" />
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
              invoice.substance_items &&
              invoice.substance_items.map((subs, i) => {
                return (
                  <tr key={i}>
                    <td> {subs.name} </td>
                    <td> {subs.mass} </td>
                    <td> {subs.description} </td>
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
              invoice.instrument_items &&
              invoice.instrument_items.map((instru, i) => {
                return (
                  <tr key={i}>
                    <td> {instru.name} </td>
                    <td> {instru.description} </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InvoiceDetail;
