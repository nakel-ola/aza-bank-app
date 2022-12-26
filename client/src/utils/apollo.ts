/* eslint-disable react-hooks/rules-of-hooks */
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { useMemo } from "react";
import clean from "./clean";
import { getStorage } from "./localStorage";
import merge from "./merge";

let apolloClient: any;

const httpLink = createUploadLink({
  uri: "http://localhost:3333/",
});
const authLink = setContext((_, { headers }) => {
  const token = getStorage<{ access_token: string } | null>(
    "access_token",
    null
  );

  const authorization = token ? `Bearer ${token}` : null;

  return {
    headers: clean({
      ...headers,
      authorization,
    }),
  };
});

const cache = new InMemoryCache();

export function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: authLink.concat(httpLink),
    cache,
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function apollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
