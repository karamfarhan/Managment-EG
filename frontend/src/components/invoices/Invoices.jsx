import { useState, Fragment, useEffect } from "react";
import axios from "axios";
import styles from "./Invoices.module.css";
import LoadingSpinner from "../UI/loading/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ExportExcel from "../UI/export/ExportExcel";
const Invoices = () => {
  const [t, i18n] = useTranslation();
  const [storeId, setStoreId] = useState("");
  const [stores, setStores] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const { token } = useSelector((state) => state.authReducer);
  //get stores list
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          `${window.domain}/stores/select_list/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStoreId(response.data[0].pk);
        setStores(response.data);
        return await response.data;
      } catch (err) {}
    };
    fetchStores();
  }, []);
  //get invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      if (storeId === null || storeId === undefined || storeId === "") return;
      setIsLoading(true);
      try {
        const response = await axios.get(`${window.domain}/stores/${storeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsLoading(false);
        const data = await response.data.invoices;
        setInvoices(data);
      } catch (err) {}
    };
    fetchInvoices();
  }, [storeId]);

  //on change
  const storeChangeHandler = (e) => {
    setStoreId(e.target.value);
  };
  console.log(invoices);

  return (
    <Fragment>
      {((invoices && invoices.length === 0) || invoices === undefined) && (
        <h2> {t("invoiceMsg")} </h2>
      )}

      <div className={styles.content}>
        {stores && stores.length > 0 && (
          <div>
            <select onChange={storeChangeHandler} value={storeId}>
              {stores &&
                stores.map((el) => (
                  <option value={el.pk} key={el.pk}>
                    {el.address}
                  </option>
                ))}
            </select>
          </div>
        )}
        {invoices && invoices.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Date</th>
                <th>Created by</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && <LoadingSpinner />}
              {isLoading === false &&
                invoices &&
                invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.id}</td>
                    <td>{new Date(invoice.created_at).toLocaleDateString()}</td>
                    <td>{invoice.created_by.username}</td>
                    <td>
                      <Link
                        className={styles.btn}
                        to={`/store/${storeId}/${invoice.id}`}
                        View></Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </Fragment>
  );
};

export default Invoices;
