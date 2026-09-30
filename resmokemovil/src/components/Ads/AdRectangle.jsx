import AdBanner from './AdBanner';
import { adsenseConfig } from '../../config/googleAdsense';
import { useSubscription } from '../../hooks/useSubscription';

const AdRectangle = ({ className = '', style = {} }) => {
  const { isPremium } = useSubscription();

  // No mostrar anuncios a usuarios premium
  if (isPremium) {
    return null;
  }

  return (
    <AdBanner
      adSlot={adsenseConfig.adUnits.rectangle.slot}
      adFormat="rectangle"
      className={`ad-rectangle ${className}`}
      style={{
        width: '300px',
        height: '250px',
        margin: '0 auto',
        ...style
      }}
      responsive={true}
    />
  );
};

export default AdRectangle;