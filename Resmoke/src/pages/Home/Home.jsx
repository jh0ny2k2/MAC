import { useEffect } from 'react';
import SEO from '../../components/SEO/SEO';
import { generateWebPageStructuredData, generateWebSiteStructuredData, generateOrganizationStructuredData } from '../../utils/structuredData';
import Banner from './components/Banner/Banner';
import Categories from './components/Categories/Categories';
import Products from './components/Products/Products';
import { categories } from '../../data/mockData'; // Solo importar categories
import { AdBannerHorizontal, AdRectangle, AdMobile } from '../../components/Ads';
import LazyAdBanner from '../../components/Ads/LazyAdBanner';
import { initializeAdSense, adsenseConfig } from '../../config/googleAdsense';
import GiveawayToast from '../../components/UI/GiveawayToast';

const Home = () => {
  useEffect(() => {
    // Inicializar AdSense cuando se carga la página principal
    initializeAdSense();
  }, []);

  return (
    <div>
      <SEO
        title="Resmoke - Marketplace de Cachimbas, Shishas y Hookahs"
        description="Compra y vende cachimbas, shishas, hookahs, vapers y accesorios en Resmoke. Marketplace de confianza con envío rápido y comunidad activa."
        keywords="resmoke, cachimbas, shisha, hookah, narguile, vapers, accesorios shisha, comprar cachimba, vender hookah, marketplace"
        url="/"
        type="website"
        structuredData={[
          generateWebSiteStructuredData(),
          generateOrganizationStructuredData(),
          generateWebPageStructuredData({
            title: 'Resmoke - Marketplace de Cachimbas y Hookahs',
            description: 'Marketplace especializado en cachimbas, shishas, hookahs, vapers y accesorios de segunda mano.',
            url: '/',
            about: 'Cachimbas y Hookahs'
          })
        ]}
      />
      {/* Popup de sorteo en Instagram */}
      <GiveawayToast />
      
  <Banner />
  
  {/* Anuncio horizontal después del banner (solo escritorio) */}
  <div className="hidden lg:block container mx-auto px-4 py-4">
    <AdBannerHorizontal className="w-full max-w-5xl mx-auto" />
  </div>
      
      <Categories categories={categories} />
      
  {/* Anuncio móvil después de categorías */}
  <div className="block lg:hidden container mx-auto px-4 py-4">
    <AdMobile className="mx-auto w-full max-w-[320px]" />
  </div>
      
      <Products />
      
  {/* Anuncio horizontal al final (lazy, escritorio) */}
  <div className="hidden lg:block container mx-auto px-4 py-6">
    <LazyAdBanner
      adSlot={adsenseConfig.adUnits.banner.slot}
      adFormat="auto"
      className="w-full"
      style={{ height: '90px' }}
      threshold={0.5}
    />
  </div>
    </div>
  );
};

export default Home;