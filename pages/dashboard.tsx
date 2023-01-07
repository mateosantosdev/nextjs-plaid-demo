import { AccountList } from "components/AccountList/AccountList";
import { Layout } from "components/Layouts/Layout";
import { withIronSessionSsr } from "iron-session/next";
import { plaidClient, sessionOptions } from "lib/plaid";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { AccountsGetResponse } from "plaid";
import { FormEvent } from "react";
import Router from "next/router";

interface DashboardProps {
  balance: AccountsGetResponse;
}

const Dashboard: NextPage<AppProps & DashboardProps> = ({
  balance,
}: DashboardProps) => {
  const onSubmitLogout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      Router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="dashboardHeader">
        <h1>Your connected bank accounts</h1>
        <form id="logout-form" onSubmit={onSubmitLogout}>
          <button className="xs" type="submit">
            Logout
          </button>
        </form>
      </div>

      <AccountList accounts={balance.accounts} />
    </Layout>
  );
};

export default Dashboard;

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const access_token = req.session.access_token;

  if (!access_token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const response = await plaidClient.accountsBalanceGet({ access_token });
  return {
    props: {
      balance: response.data,
    },
  };
},
sessionOptions);
