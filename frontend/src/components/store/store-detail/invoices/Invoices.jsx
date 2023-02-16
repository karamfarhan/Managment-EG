import { Link } from "react-router-dom";
import classes from "./Invoices.module.css";
const Invoices = ({ store }) => {
  const invoices = store.invoices;
  return (
    <aside className={classes.invoice} dir="rtl">
      <nav>
        <ul>
          {invoices &&
            invoices.map((invoice, i) => {
              return (
                <li key={invoice.id}>
                  <Link to={`/store/${store.id}/${invoice.id}`}>تحويل</Link>
                  <span>
                    {" "}
                    بتاريخ : {new Date(
                      invoice.created_at
                    ).toLocaleString()}{" "}
                  </span>
                </li>
              );
            })}
        </ul>
      </nav>
    </aside>
  );
};

export default Invoices;
