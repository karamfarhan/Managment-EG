import { useContext } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import AuthContext from "../../../../context/Auth-ctx";
import classes from "./Invoices.module.css";
const Invoices = ({ store }) => {
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  //fetch invoices
  const { data: invoices, error } = useQuery("fetch/invoice", async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/invoices/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {}
  });

  console.log(store)

  return (
    <aside className={classes.invoice} dir="rtl">
      <h2>التحويلات الخاصة ب {store.name}</h2>
      <nav>
        <ul>
          {invoices &&
            invoices.results &&
            invoices.results.map((invoice, i) => {
              return (
                <li key={invoice.id}>
                  <Link to={`/store/${store.id}/${invoice.id}`}>تحويل رقم {i + 1}</Link>
                  <div>
                    <p> تحويل من خلال : {invoice.created_by.username}</p>
                    <p>
                      بتاريخ : {new Date(invoice.created_at).toLocaleString()}
                    </p>
                  </div>
                </li>
              );
            })}
        </ul>
      </nav>
    </aside>
  );
};

export default Invoices;
