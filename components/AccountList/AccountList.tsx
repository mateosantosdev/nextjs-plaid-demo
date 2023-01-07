import { AccountDetail } from "components/AccountDetail/AccountDetail";
import { AccountBase } from "plaid";
import React, { useState } from "react";

interface AccountListProps {
  accounts: AccountBase[];
}

export const AccountList = ({ accounts }: AccountListProps) => {
  const [selectedAccount, setSelectedAccount] = useState<
    AccountBase | undefined
  >(undefined);
  return (
    <>
      <div className="accountList">
        {accounts && accounts.length > 0
          ? accounts.map((account: AccountBase, index: number) => (
              <div
                key={index}
                className={`card${
                  account.account_id === selectedAccount?.account_id
                    ? " active"
                    : ""
                }`}
                onClick={() => setSelectedAccount(account)}
              >
                <div className="inner">
                  <h3>{account.name}</h3>
                  <p>{account.type}</p>
                  <p>
                    Available:{" "}
                    {account.balances.iso_currency_code ||
                      account.balances.unofficial_currency_code}
                    {account.balances.available}
                  </p>
                </div>
              </div>
            ))
          : "Sorry, we couldn't found any accounts"}
      </div>
      {selectedAccount ? <AccountDetail account={selectedAccount} /> : ""}
    </>
  );
};
