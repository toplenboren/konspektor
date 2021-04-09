import '../styles/globals.css'
import 'inter-ui/inter.css'
import { GeistProvider, CssBaseline } from '@geist-ui/react'

function MyApp({ Component, pageProps }) {
  return <>
    <GeistProvider themeType="dark">
      <CssBaseline/>
      <Component {...pageProps} />
    </GeistProvider>
    </>
}

export default MyApp
