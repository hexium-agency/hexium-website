import { sendEmail } from '@/utils/brevo';
import { createProspect } from '@/utils/sellsy';
import type { APIRoute } from 'astro';

export const prerender = false;
export type Subject = 'project' | 'job' | 'collaboration' | 'other';

const emails: Record<Subject, { to: string; subject: string; templateId: number }> = {
  project: {
    to: 'anthony@hexium.io',
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

const RECAPTCHA_SECRET_KEY = import.meta.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_MINIMUM_SCORE = import.meta.env.RECAPTCHA_MINIMUM_SCORE;

async function verifyRecaptcha(recaptchaToken: string): Promise<boolean> {
  const recaptchaURL = 'https://www.google.com/recaptcha/api/siteverify';
  const requestHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const requestBody = new URLSearchParams({
    secret: RECAPTCHA_SECRET_KEY,
    response: recaptchaToken,
  });

  const response = await fetch(recaptchaURL, {
    method: 'POST',
    headers: requestHeaders,
    body: requestBody.toString(),
  });

  const responseData = await response.json();

  console.log(responseData);

  return responseData.success === true && responseData.score >= Number(RECAPTCHA_MINIMUM_SCORE);
}

function jsonResponse(success: boolean, message: string) {
  return new Response(JSON.stringify({ success, message }), {
    status: success ? 200 : 500,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const subject = (formData.get('subject') || 'other') as Subject;
    const firstname = formData.get('firstname') as string;
    const lastname = formData.get('lastname') as string;
    const email = formData.get('email') as string;
    const phone = (formData.get('phone') as string) || '';
    const company = (formData.get('company') as string) || '';
    const message = formData.get('message') as string;
    const privacy = formData.get('privacy') as string;
    const fileUrls = formData.get('fileUrls') as string;
    const recaptchaToken = formData.get('recaptchaToken') as string;

    if (!subject || !firstname || !lastname || !email || !message) {
      throw new Error('Tous les champs obligatoires doivent être remplis.');
    }

    // Verify reCAPTCHA
    if (!recaptchaToken) {
      throw new Error('Vérification reCAPTCHA requise.');
    }

    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      throw new Error('Échec de la vérification reCAPTCHA. Veuillez réessayer.');
    }

    // Parse file URLs from JSON string
    let parsedFileUrls: string[] = [];
    if (fileUrls) {
      try {
        parsedFileUrls = JSON.parse(fileUrls);
      } catch (error) {
        console.error('Error parsing file URLs:', error);
      }
    }

    if (subject === 'project') {
      await createProspect({
        firstname,
        lastname,
        email,
        company,
        message,
      });
    }

    const emailConfig = emails[subject];

    await sendEmail({
      to: [{ email: emailConfig.to }],
      templateId: emailConfig.templateId,
      params: {
        name: `${firstname} ${lastname}`,
        company,
        email,
        phone,
        message,
        privacy: privacy === 'on' ? 'Accepté' : 'Refusé',
        files:
          parsedFileUrls.length > 0
            ? parsedFileUrls.map((url) => `${encodeURIComponent(url)}`).join('\n')
            : '',
      },
      subject: emailConfig.subject,
      replyTo: { email },
    });

    return jsonResponse(true, 'Votre message a été envoyé avec succès.');
  } catch (error) {
    console.error('Error processing form submission:', error);
    return jsonResponse(
      false,
      "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard."
    );
  }
};
