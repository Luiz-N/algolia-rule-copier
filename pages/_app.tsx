import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import { AlgoliaProvider } from "@/contexts/AlgoliaContext";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <NextUIProvider>
      <SessionProvider session={session}>
        <AlgoliaProvider>
          <Component {...pageProps} />
        </AlgoliaProvider>
      </SessionProvider>
    </NextUIProvider>
  );
}
