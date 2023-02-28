import { useState } from "react";
import axios from "axios";
import styles from "./Invoices.module.css";
import LoadingSpinner from "../UI/loading/LoadingSpinner";
import { useEffect } from "react";
const Invoices = () => {
  const [storeId, setStoreId] = useState("");
  const [stores, setStores] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  //get stores list
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          `${window.domain}/stores/select_list/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token-management"
              )}`,
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
      setIsLoading(true);
      try {
        const response = await axios.get(`${window.domain}/stores/${storeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-management")}`,
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

  return (
    <div className={styles.content}>
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
                  <button
                    className={styles.btn}
                    onClick={() => {
                      window.location.href = `${window.domain}/invoices/${invoice.pk}`;
                    }}>
                    View
                  </button>
                </td>
              </tr>
            ))}

          {/* <tr>
            <td>1</td>
            <td>2020-01-01</td>
            <td>100</td>
            <td>Paid</td>
            <td>
              <button>Edit</button>
            </td>
          </tr>
          <tr>
            <td>1</td>
            <td>2020-01-01</td>
            <td>100</td>
            <td>Paid</td>
            <td>
              <button>Edit</button>
            </td>
          </tr> */}
        </tbody>
      </table>
      {isLoading === false && invoices && invoices.length === 0 && (
        <p>No invoices added for this store</p>
      )}
    </div>
  );
};

export default Invoices;
