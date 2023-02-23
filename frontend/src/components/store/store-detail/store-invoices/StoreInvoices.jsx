import { Fragment } from "react";
import { Link } from "react-router-dom";
const StoreInvoices = ({ invoices, data }) => {
  return (
    <Fragment>
      {invoices.length === 0 && <h1>لا يوجد تحويلات</h1>}
      {invoices.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>تاريخ التحويل</th>
              <th>عرض</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{new Date(invoice.created_at).toLocaleDateString()}</td>

                <td>
                  <Link to={`/store/${data.id}/${invoice.id}`}>تفاصيل</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Fragment>
  );
};

export default StoreInvoices;
