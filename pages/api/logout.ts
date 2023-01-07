import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/plaid";
import { NextApiRequest, NextApiResponse } from "next";

function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  res.json({ access_token: undefined });
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions);
