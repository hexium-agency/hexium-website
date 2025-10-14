import { randomUUID } from 'crypto';
type TurnstileResponse = {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
  metadata?: {
    ephemeral_id?: string;
  };
};
const turnstilePrivateKey = import.meta.env.TURNSTILE_SECRET_KEY;

export async function validate(
  token: string,
  remoteip: string,
  maxRetries = 3
): Promise<TurnstileResponse> {
  const idempotencyKey = randomUUID();

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const formData = new FormData();
      formData.append('secret', turnstilePrivateKey);
      formData.append('response', token);
      formData.append('remoteip', remoteip);
      formData.append('idempotency_key', idempotencyKey);

      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        return result;
      }

      // If this is the last attempt, return the error
      if (attempt === maxRetries) {
        return result;
      }

      // Retry
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    } catch (error) {
      if (attempt === maxRetries) {
        return { success: false, 'error-codes': ['internal-error'] };
      }
    }
  }

  return { success: false, 'error-codes': ['internal-error'] };
}
