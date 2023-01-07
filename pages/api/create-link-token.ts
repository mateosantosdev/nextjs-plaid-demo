import { plaidClient } from "lib/plaid";
import type { NextApiRequest, NextApiResponse } from "next";
import { CountryCode, Products } from "plaid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const tokenResponse = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: process.env.PLAID_CLIENT_ID || "",
      },
      client_name: process.env.PLAID_CLIENT_NAME || "NextJS | Plaid Demo",
      language: "en",
      country_codes: [CountryCode.Es],
      redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
      products: [Products.Auth, Products.Transactions],
    });
    return res.status(200).json({ data: tokenResponse.data });
  } catch (err: any) {
    return res.status(err.response.status).json({ errors: err.response.data });
  }
}
