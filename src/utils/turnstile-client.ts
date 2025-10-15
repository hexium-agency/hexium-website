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
    if (this.widgetId !== null) {
      return;
    }

    await this.waitForTurnstile();

    const turnstile = (window as any).turnstile;
    const el = document.getElementById('turnstile-widget');
    if (!el) throw new Error('Turnstile element not found');

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

      // Remove the existing widget and create a new one to avoid "already executing" error
      turnstile.remove(this.widgetId);
      const el = document.getElementById('turnstile-widget');
      if (!el) return reject('Turnstile element not found');

      // Create a new widget instance
      this.widgetId = turnstile.render(el, {
        sitekey: this.siteKey,
        size: 'normal',
        callback: resolve,
        'error-callback': reject,
      });
    });
  }
}
