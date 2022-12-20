import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import AppLayout from "../layouts/AppLayout";
import Wrapper from "../layouts/Wrapper";
import { wrapper } from "../redux/store";
import "../styles/globals.css";
import { apollo } from "../utils/apollo";
import { ThemeProvider } from "../utils/theme";

export default function App({ Component, ...others }: AppProps) {
  const router = useRouter();
  const { store, props } = wrapper.useWrappedStore(others);
  const { pageProps } = props;
  const client = apollo((pageProps as any)?.initialApolloState);
  return (
    <>
      <Head>
        <link rel="icon" href="/logo.png" />
      </Head>
      <ThemeProvider
        enableSystem={true}
        attribute="class"
        storageKey="aza-bank-theme"
        defaultTheme="light"
      >
        <Provider store={store}>
          <ApolloProvider client={client}>
            <Wrapper>
              <Toaster />
              {router.pathname === "/" ? (
                <Component {...pageProps} />
              ) : (
                <AppLayout>
                  <Component {...pageProps} />
                </AppLayout>
              )}
            </Wrapper>
          </ApolloProvider>
        </Provider>
      </ThemeProvider>
    </>
  );
}
