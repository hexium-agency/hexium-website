import { createClient } from '@supabase/supabase-js'
import type { APIRoute } from 'astro';

export const prerender = false;

export type Subject = 'project' | 'job' | 'collaboration' | 'other';

type ContactFormData = {
  subject: Subject;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  nda: string;
  fileUrls: string[];
};

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
    nda: formData.get('nda') as string,
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

function formatFileUrls(fileUrls: string[]): string {
  if (fileUrls.length === 0) return '';

  return fileUrls.map((url) => encodeURIComponent(url)).join('\n');
}

async function insertContactInSupabase(formData: ContactFormData): Promise<void> {
  const supabase = createClient('https://tkmxktdmzlbbjsdkjhqf.supabase.co', import.meta.env.SUPABASE_SERVICE_ROLE_KEY)

  const { data, error } = await supabase
    .from('contacts')
    .insert([
      {
        type: formData.subject,
        lastname: formData.lastname,
        firstname: formData.firstname,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        message: formData.message,
        path: '',
        wants_nda: formData.nda === 'on' ? true : false,
      }
    ])

  if (error) {
    console.log('Error inserting contact in supabase:', { error, data });
    throw error;
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const rawData = await request.formData();
    const parsedData = parseFormData(rawData);

    validateRequiredFields(parsedData);

    await insertContactInSupabase(parsedData);

    return jsonResponse(true, 'Votre message a été envoyé avec succès.');
  } catch (error) {
    console.error('Error on /api/contact :', error);
    return jsonResponse(
      false,
      "Une erreur est survenue lors de l'envoi du message."
    );
  }
};
