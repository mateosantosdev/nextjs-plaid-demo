import { withIronSessionApiRoute } from "iron-session/next";
import { plaidClient, sessionOptions } from "lib/plaid";
import type { NextApiRequest, NextApiResponse } from "next";

export default withIronSessionApiRoute(exchangePublicToken, sessionOptions);

async function exchangePublicToken(req: NextApiRequest, res: NextApiResponse) {
  const exchangeResponse = await plaidClient.itemPublicTokenExchange({
    public_token: req.body.public_token,
  });
  req.session.access_token = exchangeResponse.data.access_token;
  await req.session.save();
  res.send({ ok: true });
}
