import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppContext, AppProps } from "next/app";
import buildClient from "../api/build-client";
import { CurrentUserResponse } from "../typings/dto";
import AppHeader from "../components/app-header";

export default function MyApp({
  Component,
  pageProps,
  currentUser,
}: AppProps & CurrentUserResponse) {
  return (
    <div>
      <AppHeader currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser} />
    </div>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get<CurrentUserResponse>(
    "/api/users/currentuser"
  );
  return data;
};
