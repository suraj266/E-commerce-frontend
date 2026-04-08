"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import {
    ApolloNextAppProvider,
    ApolloClient,
    InMemoryCache,
    SSRMultipartLink,
} from "@apollo/client-integration-nextjs";

function makeClient() {
    const httpLink = new HttpLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
        fetchOptions: { cache: "no-store" },
    });

    return new ApolloClient({
        cache: new InMemoryCache(),
        link:
            typeof window === "undefined"
                ? ApolloLink.from([
                    new SSRMultipartLink({
                        stripDefer: true,
                    }),
                    httpLink,
                ])
                : httpLink,
    });
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ApolloNextAppProvider makeClient={makeClient}>
            {children}
        </ApolloNextAppProvider>
    );
}
