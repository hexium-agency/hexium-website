import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';
import { sendEmail } from '../../utils/brevo';

export const prerender = false;

type Subject = 'project' | 'job' | 'collaboration' | 'other';

function jsonResponse(success: boolean, message: string) {
  return new Response(JSON.stringify({ success, message }), {
    status: success ? 200 : 500,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getTemplateIdByType(subject: Subject): number {
  const templateMap: Record<Subject, number> = {
    project: 7,
    job: 9,
    collaboration: 10,
    other: 11,
  };

  return templateMap[subject];
}

function formatFileUrls(fileUrls: string[]): string {
  if (!fileUrls || fileUrls.length === 0) return '';

  return fileUrls.map((url) => encodeURIComponent(url)).join('\n');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const contactId = body.contactId;

    if (!contactId) {
      throw new Error('The attribute "contactId" is required.');
    }

    const supabase = createClient('https://tkmxktdmzlbbjsdkjhqf.supabase.co', import.meta.env.SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();

    if (error) {
      throw new Error('An error occurred while fetching the contact  with id "' + contactId + '" from Supabase.');
    }

    const { type, firstname, lastname, email, phone, company, message, wants_nda, fileUrls } = data;

    // Only send email for project submissions
    if (type != 'project') {
      return jsonResponse(true, 'The email has not been sent because the subject type is not a project.');
    }

    const formattedMessage = message.replace(/(?:\r\n|\r|\n)/g, '<br>');

    await sendEmail({
      to: [{ email: 'anthony@hexium.io' }],
      templateId: getTemplateIdByType(type),
      replyTo: { email },
      params: {
        name: `${firstname} ${lastname}`,
        company,
        email,
        phone,
        message: formattedMessage,
        nda: wants_nda ? '✅' : '❌',
        files: formatFileUrls(fileUrls),
      },
    });

    return jsonResponse(true, 'The email has been sent successfully.');
  } catch (error) {
    console.error('Error on /api/email :', error);
    return jsonResponse(
      false,
      "An error occurred while sending the email."
    );
  }
};
