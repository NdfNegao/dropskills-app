import { LikedProductsProvider } from '@/context/LikedProductsContext';
import { SavedProductsProvider } from '@/context/SavedProductsContext';

function MyApp({ Component, pageProps }) {
  return (
    <LikedProductsProvider>
      <SavedProductsProvider>
        <Component {...pageProps} />
      </SavedProductsProvider>
    </LikedProductsProvider>
  );
}

export default MyApp; 