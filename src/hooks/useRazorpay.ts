import { useState, useEffect } from 'react';
import { 
  loadRazorpayScript, 
  handlePayment, 
  type RazorpaySuccessResponse, 
  type RazorpayPaymentConfig,
  type PaymentPrefill 
} from '../utils/razorpay';

export type { RazorpaySuccessResponse, RazorpayPaymentConfig, PaymentPrefill };

export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    loadRazorpayScript()
      .then((loaded) => {
        if (isMounted) {
          setIsLoaded(loaded);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    isLoaded,
    isLoading,
    error,
    handlePayment,
  };
}

export default useRazorpay;
