/**
 * Razorpay Payment Gateway Integration Utility
 * Shevgaon Market - Test Mode
 */

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const RAZORPAY_TEST_KEY =
  (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'ABjsfSyGTSTzW3jfCPoZev4n';

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface PaymentPrefill {
  name?: string;
  contact?: string;
  email?: string;
}

export interface RazorpayPaymentConfig {
  amount: number; // in INR (e.g. 199 or 49)
  name: string; // Merchant or Store or App Name
  description: string; // Purpose of payment
  prefill?: PaymentPrefill;
  notes?: Record<string, string>;
  onSuccess?: (response: RazorpaySuccessResponse) => void;
  onDismiss?: () => void;
  onError?: (error: any) => void;
}

/**
 * Dynamically loads the Razorpay checkout script (https://checkout.razorpay.com/v1/checkout.js)
 * Returns a Promise that resolves to true once successfully loaded.
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // If already loaded on window, resolve immediately
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    // Check if script tag is already in DOM
    const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);

    if (existingScript) {
      if (existingScript.getAttribute('data-loaded') === 'true' || window.Razorpay) {
        resolve(true);
      } else {
        existingScript.addEventListener('load', () => resolve(true), { once: true });
        existingScript.addEventListener('error', () => resolve(false), { once: true });
      }
      return;
    }

    // Create and inject script tag
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      script.setAttribute('data-loaded', 'true');
      resolve(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay checkout script from CDN.');
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

/**
 * Initiates Razorpay Checkout modal for a given amount, name, and description.
 * Accepts either:
 *  1. An options object: handlePayment({ amount, name, description, prefill, onSuccess, onDismiss })
 *  2. Positional parameters: handlePayment(amount, name, description, onSuccess, prefill)
 */
export function handlePayment(config: RazorpayPaymentConfig): Promise<RazorpaySuccessResponse>;
export function handlePayment(
  amount: number,
  name: string,
  description: string,
  onSuccess?: (response: RazorpaySuccessResponse) => void,
  prefill?: PaymentPrefill
): Promise<RazorpaySuccessResponse>;
export function handlePayment(
  configOrAmount: RazorpayPaymentConfig | number,
  nameArg?: string,
  descriptionArg?: string,
  onSuccessArg?: (response: RazorpaySuccessResponse) => void,
  prefillArg?: PaymentPrefill
): Promise<RazorpaySuccessResponse> {
  let config: RazorpayPaymentConfig;

  if (typeof configOrAmount === 'number') {
    config = {
      amount: configOrAmount,
      name: nameArg || 'Shevgaon Market',
      description: descriptionArg || 'Payment',
      onSuccess: onSuccessArg,
      prefill: prefillArg,
    };
  } else {
    config = configOrAmount;
  }

  return new Promise(async (resolve, reject) => {
    try {
      const isLoaded = await loadRazorpayScript();

      if (!isLoaded || !window.Razorpay) {
        const error = new Error('Razorpay SDK failed to load. Please check your internet connection.');
        if (config.onError) config.onError(error);
        reject(error);
        return;
      }

      // Convert rupees to paise (e.g., 199 -> 19900)
      const amountInPaise = Math.round(config.amount * 100);

      const options = {
        key: RAZORPAY_TEST_KEY,
        amount: amountInPaise,
        currency: 'INR',
        name: config.name || 'Shevgaon Market',
        description: config.description || 'सुरक्षित पेमेंट (Secure Payment)',
        image: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
        handler: function (response: RazorpaySuccessResponse) {
          if (config.onSuccess) {
            config.onSuccess(response);
          }
          resolve(response);
        },
        prefill: {
          name: config.prefill?.name || '',
          contact: config.prefill?.contact || '',
          email: config.prefill?.email || '',
        },
        notes: config.notes || {
          merchant: config.name,
          service: config.description,
        },
        theme: {
          color: '#7c3aed', // Shevgaon Market brand purple
        },
        modal: {
          ondismiss: function () {
            if (config.onDismiss) {
              config.onDismiss();
            }
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on('payment.failed', function (resp: any) {
        console.error('Razorpay payment failed:', resp.error);
        if (config.onError) {
          config.onError(resp.error);
        }
      });

      razorpayInstance.open();
    } catch (err) {
      console.error('Error opening Razorpay payment:', err);
      if (config.onError) {
        config.onError(err);
      }
      reject(err);
    }
  });
}
