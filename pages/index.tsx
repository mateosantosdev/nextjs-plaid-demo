import Head from "next/head";
import styles from "styles/Home.module.css";
import { usePlaidLink } from "react-plaid-link";
import { useCallback, useEffect, useState } from "react";
import Router from "next/router";
import { PlaidCreateLinkResponse } from "lib/plaid";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [createLinkTokenErrors, setCreateLinkTokenErrors] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const createLinkToken = async () => {
      setCreateLinkTokenErrors(undefined);
      const response = await fetch("/api/create-link-token", {
        method: "POST",
      });
      const { data, errors }: PlaidCreateLinkResponse = await response.json();
      if (response.ok) {
        setToken(data!.link_token);
      } else {
        setCreateLinkTokenErrors(errors?.error_message);
      }
    };
    createLinkToken();
  }, []);

  const onSuccess = useCallback(async (publicToken: string) => {
    await fetch("/api/exchange-public-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_token: publicToken }),
    });
    Router.push("/dashboard");
  }, []);

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>NextJS + Plaid Demo</title>
        <meta name="description" content="Tus transacciones bancarias" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>NextJS + Plaid Demo</h1>

        <p className={styles.description}>
          <button className="lg" onClick={() => open()} disabled={!ready}>
            Link bank account
          </button>
        </p>
        <>{createLinkTokenErrors}</>
      </main>
    </div>
  );
}
