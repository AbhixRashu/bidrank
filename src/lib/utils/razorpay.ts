declare global {
  interface Window {
    Razorpay: any;
  }
}

let scriptPromise: Promise<boolean> | null = null;

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window !== "undefined" && window.Razorpay) {
    return Promise.resolve(true);
  }

  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<boolean>((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => {
        scriptPromise = null;
        resolve(false);
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      scriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export function isRazorpayLoaded(): boolean {
  return typeof window !== "undefined" && !!window.Razorpay;
}
