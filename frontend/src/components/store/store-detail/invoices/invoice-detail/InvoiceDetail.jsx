import { useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import AuthContext from "../../../../../context/Auth-ctx";

//style
import classes from './InvoiceDetail.module.css'

const InvoiceDetail = () => {
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  const param = useParams();

  //invoice id
  const { invoiceId } = param;

  //fetch invoices
  const { data: invoice, error } = useQuery("fetch/invoice", async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/invoices/${invoiceId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      return data;
    } catch (err) {}
  });


  return (
    <div dir="rtl" className = {classes['invoice-container']}>
     <div>  <h2>بيانات المخزن</h2>
     <p>تاريخ الانشاء : {new Date(invoice && invoice.created_at).toLocaleString()} </p>
     <h3> الملاحظات المهمة : {invoice && invoice.note} </h3></div>

      <table>
        <thead>
          <th> المواد المحولة الي المخزن </th>
          <th>الكمية </th>
          <th>الوصف </th>
        </thead>
        <tbody>
          {invoice && invoice.substances && invoice.substances.map((subs) => {
            return (
              <tr key={subs.id}>
                <td> {subs.substance_name} </td>
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
            <th> المواد المحولة الي المخزن </th>
           
            <th>الوصف </th>
          </thead>
          <tbody>
            {invoice && invoice.instruments && invoice.instruments.map((instru) => {
              return (
                <tr key={instru.id}>
                  <td> {instru.instrument_name} </td>
            
                  <td> {instru.description} </td>
                </tr>
              );
            })}
          </tbody>
        </table>











    </div>
  );
};

export default InvoiceDetail;