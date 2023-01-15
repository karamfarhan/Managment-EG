import { Link } from "react-router-dom";
import classes from "./Invoices.module.css";
const Invoices = ({ store }) => {
  const invoices = store.invoices;
  console.log(invoices);
  return (
    <aside className={classes.invoice} dir="rtl">
      <nav>
        <ul>
          {invoices &&
            invoices.map((invoice, i) => {
              return (
                <li key={invoice.id}>
                  <Link to={`/store/${store.id}/${invoice.id}`}>
                    تحويل رقم {i + 1}
                  </Link>
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
