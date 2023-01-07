import { withIronSessionApiRoute } from "iron-session/next";
import { plaidClient, sessionOptions } from "lib/plaid";
import type { NextApiRequest, NextApiResponse } from "next";
import { TransactionsGetRequest } from "plaid";

export default withIronSessionApiRoute(transactions, sessionOptions);

async function transactions(req: NextApiRequest, res: NextApiResponse) {
  const body = JSON.parse(req.body);
  const request: TransactionsGetRequest = {
    access_token: req.session.access_token || "",
    start_date: body.start,
    end_date: body.end,
    options: {
      account_ids: [body.account_id],
    },
  };
  const response = await plaidClient.transactionsGet(request);
  const transactions = response.data.transactions;

  res.status(200).json(transactions);
}
