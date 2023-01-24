import { useContext } from "react";
import { useParams } from "react-router-dom";
import {useSelector} from "react-redux"
import { useQuery } from "react-query";
import AuthContext from "../../../../../context/Auth-ctx";

//style
import classes from "./InvoiceDetail.module.css";
import ExportExcel from "../../../../UI/export/ExportExcel";

const InvoiceDetail = () => {
  const { token } = useSelector((state) => state.authReducer);

  const param = useParams();

  //invoice id
  const { invoiceId } = param;
  //fetch invoices
  const { data: invoice } = useQuery("fetch/invoice", async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/invoices/${invoiceId}/`, {
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
          <h2>بيانات المخزن</h2>
          <p>
            تاريخ الانشاء :
            {new Date(invoice && invoice.created_at).toLocaleString()}
          </p>
          <h3> الملاحظات المهمة : {invoice && invoice.note} </h3>
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
              invoice.substance_items.map((subs) => {
                return (
                  <tr key={subs.id}>
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
            <th> الالات الي المخزن </th>

            <th>الوصف </th>
          </thead>
          <tbody>
            {invoice &&
              invoice &&
              invoice.instrument_items &&
              invoice.instrument_items.map((instru) => {
                return (
                  <tr key={instru.id}>
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
