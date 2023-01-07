import { AccountBase, Transaction } from "plaid";
import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import { formatAmount } from "utils/utils";
import DatePicker from "react-datepicker";
import { useDebounce } from "utils/hooks/useDebounce";

interface AccountDetailProps {
  account: AccountBase;
}

const TransactionsTable = ({
  transactions,
  onClick,
}: {
  transactions: Transaction[];
  onClick: (transaction: Transaction) => void;
}) => {
  return transactions && transactions.length > 0 ? (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Name</th>
          <th>Categories</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((item: Transaction, index: number) => (
          <tr key={index}>
            <td>{item.date}</td>
            <td>
              <span
                className="cursor-pointer underline"
                onClick={() => onClick(item)}
              >
                {item.name || item.merchant_name}
              </span>
            </td>
            <td>
              <pre>{item.category?.join(", ")}</pre>
            </td>
            <td>
              {formatAmount(item.amount)} {item.iso_currency_code}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div>
      We are sorry, but we could not find any transaction with these parameters.
    </div>
  );
};

const AccountDetailItemValue = ({
  title,
  value,
}: {
  title: string;
  value: string | null | undefined;
}) => (
  <div className="item">
    <span className="title">{title}</span>
    <span className="value">{value}</span>
  </div>
);

const AsideAccountDetail = ({
  transaction,
  resetTransaction,
}: {
  transaction: Transaction | undefined;
  resetTransaction: () => void;
}) => {
  return transaction ? (
    <section className="transactionDetail">
      <h2>Transaction details</h2>
      <AccountDetailItemValue
        title="Date"
        value={dayjs(transaction.date).format("DD/MM/YYYY")}
      />
      <AccountDetailItemValue
        title="Name"
        value={transaction.name || transaction.merchant_name}
      />
      <AccountDetailItemValue
        title="Amount"
        value={`${formatAmount(transaction.amount)} ${
          transaction.iso_currency_code
        }`}
      />
      <AccountDetailItemValue
        title="Categories"
        value={`${transaction.category?.join(", ")}`}
      />
      <AccountDetailItemValue
        title="Payment channel"
        value={transaction.payment_channel}
      />
      <button onClick={resetTransaction} className="sm cancel">
        Cancel
      </button>
    </section>
  ) : (
    <></>
  );
};

export const AccountDetail = ({ account }: AccountDetailProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<
    Transaction | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    dayjs(new Date()).subtract(7, "day").toDate()
  );
  const [endDate, setEndDate] = useState(dayjs(new Date()).toDate());

  const startDateDebounced: Date = useDebounce(startDate);
  const endDateDebounced: Date = useDebounce(endDate);

  useMemo(() => {
    const getTransactions = async () => {
      const response = await fetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify({
          account_id: account.account_id,
          start: dayjs(startDateDebounced).format("YYYY-MM-DD"),
          end: dayjs(endDateDebounced).format("YYYY-MM-DD"),
        }),
      });
      setTransactions(await response.json());
      setLoading(false);
    };
    setLoading(true);
    if (startDateDebounced && endDateDebounced) {
      getTransactions();
    }
  }, [account.account_id, startDateDebounced, endDateDebounced]);

  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  return (
    <section>
      <div className="datepickers">
        <h3>Select a date range (format: dd/mm/yyyy)</h3>
        <div className="pickers">
          <div>
            <span className="title">From:</span>
            <DatePicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div>
            <span className="title">To:</span>
            <DatePicker
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
      </div>
      {loading && <p>Loading transactions...</p>}
      {!loading && (
        <>
          <TransactionsTable
            transactions={transactions}
            onClick={handleSelectTransaction}
          />
          <AsideAccountDetail
            transaction={selectedTransaction}
            resetTransaction={() => setSelectedTransaction(undefined)}
          />
        </>
      )}
    </section>
  );
};
