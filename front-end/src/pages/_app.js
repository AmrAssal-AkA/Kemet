import Head from "next/head";


import "@/styles/globals.css";
import Header from "@/components/Header&Footer/header";
import Footer from "@/components/Header&Footer/footer";
import { AuthProvider } from "@/context/AuthContext";



export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Kemet</title>
        <meta
          name="description"
          content="Discover the hidden gems of Egypt with Kemet, your ultimate travel companion. Explore off-the-beaten-path destinations, local culture, and unique experiences that will make your trip unforgettable."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </AuthProvider>
    </>
  );
}
