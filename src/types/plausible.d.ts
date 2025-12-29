interface Plausible {
  (eventName: string, options?: Record<string, unknown>): void;
  q?: unknown[];
}

interface Window {
  plausible: Plausible;
  dataLayer: any[];
  _hsq: [string, ...unknown[]][];
}
