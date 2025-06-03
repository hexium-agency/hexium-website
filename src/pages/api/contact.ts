import { sendEmail } from '@/utils/brevo';
import { uploadMultipleFilesToS3 } from '@/utils/s3';
import { createProspect } from '@/utils/sellsy';
import type { APIRoute } from 'astro';

export const prerender = false;
export type Subject = 'project' | 'job' | 'collaboration' | 'other';

const emails: Record<Subject, { to: string; subject: string; templateId: number }> = {
  project: {
    to: 'anthony@hexium.io',
    subject: '[PROJET]',
    templateId: 3,
  },
  job: {
    to: 'contact@hexium.io',
    subject: '[EMPLOI]',
    templateId: 4,
  },
  collaboration: {
    to: 'contact@hexium.io',
    subject: '[COLLAB]',
    templateId: 5,
  },
  other: {
    to: 'contact@hexium.io ',
    subject: '[AUTRE]',
    templateId: 6,
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

    const subject = (formData.get('subject') || 'other') as Subject;
    const firstname = formData.get('firstname') as string;
    const lastname = formData.get('lastname') as string;
    const email = formData.get('email') as string;
    const phone = (formData.get('phone') as string) || '';
    const company = (formData.get('company') as string) || '';
    const message = formData.get('message') as string;
    const privacy = formData.get('privacy') as string;

    if (!subject || !firstname || !lastname || !email || !message) {
      throw new Error('Tous les champs obligatoires doivent être remplis.');
    }

    const files = formData.getAll('files') as File[];

    const fileUrls = await uploadMultipleFilesToS3(
      files.filter((file) => file.name !== 'undefined' && file.name !== '')
    );

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
        files: fileUrls.map((url) => `${url}`).join('\n'),
      },
      subject: emailConfig.subject,
      replyTo: { email: emailConfig.to },
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
