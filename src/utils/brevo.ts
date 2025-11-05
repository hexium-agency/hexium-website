const BREVO_API_KEY = import.meta.env.BREVO_API_KEY;
const BREVO_API_URL = import.meta.env.BREVO_API_URL;

interface EmailRecipient {
  email: string;
  name?: string;
}

interface BrevoEmailOptions {
  to: EmailRecipient[];
  templateId: number;
  params?: Record<string, any>;
  replyTo: EmailRecipient;
}

/**
 * Sends an email using the Brevo API
 * @param options Email options including recipients, template, and parameters
 * @returns Promise with the API response
 */
export async function sendEmail(options: BrevoEmailOptions): Promise<any> {
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(`Brevo API error: ${response.status} - ${JSON.stringify(errorData)}`);
    throw new Error(`Brevo API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}
