import { ThirdwebProvider } from "@thirdweb-dev/react";
import { AvalancheFuji } from "@thirdweb-dev/chains";

export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProvider activeChain={AvalancheFuji}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}