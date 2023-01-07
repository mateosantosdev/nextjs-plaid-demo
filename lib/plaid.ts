import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

export type PlaidCreateLinkResponse = {
  data?: {
    link_token: string;
  };
  errors?: {
    display_message: null;
    documentation_url: string;
    error_code: string;
    error_message: string;
    error_type: string;
    request_id: string;
    suggested_action: string;
  };
};

const plaidClient = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || ""],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
        "PLAID-SECRET": process.env.PLAID_SECRET,
        "Plaid-Version": "2020-09-14",
      },
    },
  })
);

const sessionOptions = {
  cookieName: "myapp_cookiename",
  password: "complex_password_at_least_32_characters_long",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

declare module "iron-session" {
  interface IronSessionData {
    access_token?: string;
  }
}

export { plaidClient, sessionOptions };
