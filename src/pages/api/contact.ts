import { uploadMultipleFilesToS3 } from '@/utils/s3';
import { createProspect } from '@/utils/sellsy';
import type { APIRoute } from 'astro';
import console from 'console';

export const prerender = false;

async function sendEmail(to: string, subject: string, content: string): Promise<void> {
  try {
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${content}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

const emailConfig = {
  project: {
    to: 'anthony@hexium.io',
    subject: '[PROJET]',
  },
  job: {
    to: 'contact@hexium.io',
    subject: '[EMPLOI]',
  },
  collaboration: {
    to: 'contact@hexium.io',
    subject: '[COLLAB]',
  },
  other: {
    to: 'contact@hexium.io ',
    subject: '[AUTRE]',
  },
};

function jsonResponse(success: boolean, message: string) {
  return new Response(JSON.stringify({ success, message }), {
    status: success ? 200 : 500,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const subject = formData.get('subject') as string;
    const firstname = formData.get('firstname') as string;
    const lastname = formData.get('lastname') as string;
    const email = formData.get('email') as string;
    const phone = (formData.get('phone') as string) || '';
    const company = (formData.get('company') as string) || '';
    const message = formData.get('message') as string;
    // const privacy = formData.get('privacy') as string; TODO: handle privacy document

    if (!subject || !firstname || !lastname || !email || !message) {
      throw new Error('Tous les champs obligatoires doivent être remplis.');
    }

    const files = formData.getAll('files') as File[];
    await uploadMultipleFilesToS3(files);

    if (subject === 'project') {
      try {
        await createProspect({
          firstname,
          lastname,
          email,
          phone,
          company,
          message,
        });
        console.log('Successfully created prospect in Sellsy');
      } catch (error) {
        console.error('Error creating prospect in Sellsy:', error);
      }
    }

    try {
      const emailCfg = emailConfig[subject as keyof typeof emailConfig] || emailConfig.other;
      await sendEmail(emailCfg.to, emailCfg.subject, '');
      console.log('Successfully sent email notification');
    } catch (error) {
      console.error('Error sending email:', error);
    }

    return jsonResponse(true, 'Votre message a été envoyé avec succès.');
  } catch (error) {
    console.error('Error processing form submission:', error);
    return jsonResponse(
      false,
      "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard."
    );
  }
};
