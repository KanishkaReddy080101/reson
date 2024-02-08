import '@/styles/globals.css'
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from "next-auth/react"
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return(
    <>
    <SessionProvider session={session}> 
        <ToastContainer limit={3} pauseOnFocusLoss={false} autoClose={2000} newestOnTop theme='colored'/>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  ) 
}
