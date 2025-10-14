import { sendEmail } from '@/utils/brevo';
import { validate } from '@/utils/turnstile-validator';
import type { APIRoute } from 'astro';

export const prerender = false;

// Types
export type Subject = 'project' | 'job' | 'collaboration' | 'other';

type ContactFormData = {
  subject: Subject;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  privacy: string;
  fileUrls: string[];
};

type EmailConfig = {
  to: string;
  subject: string;
  templateId: number;
};

// Configuration
const EMAIL_CONFIGS: Record<Subject, EmailConfig> = {
  project: {
    to: 'contact@hexium.io',
    subject: '[PROJET]',
    templateId: 7,
  },
  job: {
    to: 'contact@hexium.io',
    subject: '[EMPLOI]',
    templateId: 9,
  },
  collaboration: {
    to: 'contact@hexium.io',
    subject: '[COLLAB]',
    templateId: 10,
  },
  other: {
    to: 'contact@hexium.io ',
    subject: '[AUTRE]',
    templateId: 11,
  },
};

// Helper Functions
function jsonResponse(success: boolean, message: string) {
  return new Response(JSON.stringify({ success, message }), {
    status: success ? 200 : 500,
    headers: { 'Content-Type': 'application/json' },
  });
}

function parseFormData(formData: FormData): ContactFormData {
  return {
    subject: (formData.get('subject') || 'other') as Subject,
    firstname: formData.get('firstname') as string,
    lastname: formData.get('lastname') as string,
    email: formData.get('email') as string,
    phone: (formData.get('phone') as string) || '',
    company: (formData.get('company') as string) || '',
    message: formData.get('message') as string,
    privacy: formData.get('privacy') as string,
    fileUrls: parseFileUrls(formData.get('fileUrls') as string),
  };
}

function parseFileUrls(fileUrlsJson: string): string[] {
  if (!fileUrlsJson) return [];

  try {
    return JSON.parse(fileUrlsJson);
  } catch (error) {
    console.error('Error parsing file URLs:', error);
    return [];
  }
}

function validateRequiredFields(data: ContactFormData): void {
  const { subject, firstname, lastname, email, message } = data;

  if (!subject || !firstname || !lastname || !email || !message) {
    throw new Error('Tous les champs obligatoires doivent être remplis.');
  }
}

async function validateTurnstile(token: string, clientIp: string): Promise<void> {
  const result = await validate(token, clientIp, 3);

  if (!result.success) {
    console.error('Turnstile validation failed:', result);
    throw new Error('Échec de la vérification. Veuillez réessayer.');
  }
}

function formatFileUrls(fileUrls: string[]): string {
  if (fileUrls.length === 0) return '';

  return fileUrls.map((url) => encodeURIComponent(url)).join('\n');
}

async function sendContactEmail(data: ContactFormData): Promise<void> {
  const config = EMAIL_CONFIGS[data.subject];
  const { firstname, lastname, email, phone, company, message, privacy, fileUrls } = data;

  await sendEmail({
    to: [{ email: config.to }],
    templateId: config.templateId,
    subject: config.subject,
    replyTo: { email },
    params: {
      name: `${firstname} ${lastname}`,
      company,
      email,
      phone,
      message,
      privacy: privacy === 'on' ? 'Accepté' : 'Refusé',
      files: formatFileUrls(fileUrls),
    },
  });
}

// Main Handler
export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Parse form data
    const formData = await request.formData();
    const data = parseFormData(formData);

    // 2. Validate required fields
    validateRequiredFields(data);

    // 3. Validate Turnstile captcha
    const turnstileToken = formData.get('turnstileToken') as string;
    const clientIp = request.headers.get('x-forwarded-for') || '';
    await validateTurnstile(turnstileToken, clientIp);

    // 4. Send email
    await sendContactEmail(data);

    // 5. Return success
    return jsonResponse(true, 'Votre message a été envoyé avec succès.');
  } catch (error) {
    console.error('Error processing form submission:', error);
    return jsonResponse(
      false,
      "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard."
    );
  }
};
