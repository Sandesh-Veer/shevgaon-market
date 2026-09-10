import React from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalCard from '../ui/UniversalCard';

export interface OfferData {
  id: string;
  name: string;
  shopName?: string;
  offerBanner?: string;
  title?: string;
  offerDiscount?: string;
  discount?: string;
  offerDesc?: string;
  description?: string;
  logo?: string;
  imageUrl?: string;
  photos?: string[];
  phone?: string;
  category?: string;
  [key: string]: any;
}

interface OfferCardProps {
  offer: OfferData;
  onCardClick?: () => void;
  className?: string;
}

/**
 * OfferCard Component
 * Displays special promotional offers without any visual countdown timer.
 * Validity is handled strictly in the background via 24-hour expiration logic.
 */
export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onCardClick,
  className
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick();
    } else {
      navigate(`/business/offers/${offer.id}`);
    }
  };

  const bannerTitle = offer.offerBanner || offer.title || 'मोठी सूट!';
  const shopTitle = offer.shopName || offer.name || 'दुकानदार';
  const discountVal = offer.offerDiscount || offer.discount || '१०';
  const descriptionText = offer.offerDesc || offer.description || '';
  const cardImage =
    offer.imageUrl ||
    offer.logo ||
    (offer.photos && offer.photos[0]) ||
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=400&q=80';

  return (
    <UniversalCard
      id={offer.id}
      title={bannerTitle}
      subtitle={shopTitle}
      categoryBadge="ऑफर"
      statusBadge={`${discountVal}% सूट`}
      statusBadgeColor="bg-rose-500 text-white font-bold"
      image={cardImage}
      phone={offer.phone}
      metaItems={[
        {
          label: 'माहिती',
          value: descriptionText.slice(0, 40) || 'विशेष मर्यादित ऑफर'
        }
      ]}
      detailsPath={`/business/offers/${offer.id}`}
      onCardClick={handleCardClick}
      className={className}
      // Note: No countdown timer (hours : minutes : seconds) is rendered
    />
  );
};

export default OfferCard;
