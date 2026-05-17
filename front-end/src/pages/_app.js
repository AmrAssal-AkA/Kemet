import Head from "next/head";
import { useRouter } from "next/router";
import {Toaster} from "react-hot-toast";

import "@/styles/globals.css";
import Header from "@/components/Header&Footer/header";
import Footer from "@/components/Header&Footer/footer";
import { AuthProvider } from "@/context/AuthContext";



export default function App({ Component, pageProps }) {
  const router = useRouter();
  const dashboardLayout =
    router.pathname.startsWith("/admin") || router.pathname === "/guide/dashboard";

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
        {!dashboardLayout && <Header />}
        <Toaster position="top-right" size="2xl" reverseOrder={false} />
        <Component {...pageProps} />
        {!dashboardLayout && <Footer />}
      </AuthProvider>
    </>
  );
}
