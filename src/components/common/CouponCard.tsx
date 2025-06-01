import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface CouponCardProps {
  coupon: {
    id: string;
    code: string;
    description: string;
    discount_type: 'percentage' | 'fixed_amount';
    discount_value: number;
    minimum_purchase: number;
    expires_at: string;
    brand_link?: string;
    brand: {
      id: string;
      name: string;
      logo_url: string;
      category: string;
      slug: string;
      website?: string;
    };
  };
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast.success('Coupon code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
      toast.error('Failed to copy code');
    }
  };

  // Determine the shop now link - prioritize coupon's brand_link, then brand's website, then internal brand page
  const getShopNowLink = () => {
    if (coupon.brand_link) {
      return coupon.brand_link;
    } else if (coupon.brand?.website) {
      return coupon.brand.website.startsWith('http') 
        ? coupon.brand.website 
        : `https://${coupon.brand.website}`;
    }
    return `/${coupon.brand.category}/${coupon.brand.slug}`;
  };

  const shopNowLink = getShopNowLink();
  const isExternalLink = shopNowLink.startsWith('http');

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
      <div className="p-6">
        <div className="flex items-center mb-4">
          {coupon.brand?.logo_url && (
            <img
              src={coupon.brand.logo_url}
              alt={coupon.brand.name}
              className="w-12 h-12 object-contain rounded"
              loading="lazy"
            />
          )}
          <div className="ml-3">
            <h3 className="font-medium dark:text-white">{coupon.brand?.name}</h3>
            <p className="text-sm text-gray-500 capitalize dark:text-gray-400">
              {coupon.brand?.category.replace('-', ' ')}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-2xl font-bold text-primary-600 mb-2 dark:text-primary-400">
            {coupon.discount_type === 'percentage'
              ? `${coupon.discount_value}% OFF`
              : `$${coupon.discount_value} OFF`}
          </div>
          <p className="text-gray-600 dark:text-gray-300">{coupon.description}</p>
        </div>

        <div className="space-y-2 text-sm text-gray-500 mb-4 dark:text-gray-400">
          {coupon.minimum_purchase > 0 && (
            <p>Min. Purchase: ${coupon.minimum_purchase}</p>
          )}
          <p>Expires: {new Date(coupon.expires_at).toLocaleDateString()}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleCopyCode}
            className="flex-1 flex items-center justify-center gap-2 btn-primary"
          >
            {copied ? (
              <>
                <Check size={18} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={18} />
                {coupon.code}
              </>
            )}
          </button>
          
          {isExternalLink ? (
            <a 
              href={shopNowLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 btn-outline dark:border-gray-600 dark:text-gray-300"
            >
              <ExternalLink size={18} />
              Shop Now
            </a>
          ) : (
            <Link 
              to={shopNowLink}
              className="flex items-center justify-center gap-1 btn-outline dark:border-gray-600 dark:text-gray-300"
            >
              <ExternalLink size={18} />
              Shop Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponCard;