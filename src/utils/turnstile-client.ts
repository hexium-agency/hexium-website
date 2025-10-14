// Client-side invisible Turnstile implementation
export class InvisibleTurnstile {
  private siteKey: string;
  private widgetId: string | null = null;

  constructor(siteKey: string) {
    this.siteKey = siteKey;
  }

  async waitForTurnstile(): Promise<void> {
    if (typeof window === 'undefined') return;
    if ((window as any).turnstile) return;

    await new Promise<void>((resolve) => {
      const check = setInterval(() => {
        if ((window as any).turnstile) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
  }

  async init(): Promise<void> {
    // If already initialized, return immediately
    if (this.widgetId !== null) {
      return;
    }

    await this.waitForTurnstile();

    const turnstile = (window as any).turnstile;
    const el = document.getElementById('turnstile-widget');
    if (!el) throw new Error('Turnstile element not found');

    // Keep it hidden - we'll execute it programmatically
    // el.classList.remove('hidden');

    this.widgetId = turnstile.render(el, {
      sitekey: this.siteKey,
      size: 'normal',
    });
  }

  async getToken(): Promise<string> {
    await this.waitForTurnstile();

    const turnstile = (window as any).turnstile;
    return new Promise((resolve, reject) => {
      if (!this.widgetId) return reject('Turnstile not initialized');

      // Reset before executing to get a fresh token
      turnstile.reset(this.widgetId);

      turnstile.execute(this.widgetId, { callback: resolve, 'error-callback': reject });
    });
  }

  reset(): void {
    const turnstile = (window as any).turnstile;
    if (this.widgetId && turnstile) {
      turnstile.reset(this.widgetId);
    }
  }
}
