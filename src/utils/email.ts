import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: import.meta.env.EMAIL_HOST,
  port: parseInt(import.meta.env.EMAIL_PORT),
  secure: parseInt(import.meta.env.EMAIL_PORT) === 465,
  auth: {
    user: import.meta.env.EMAIL_USER,
    pass: import.meta.env.EMAIL_PASS,
  },
});

// Email recipients and subjects based on form type
export const emailConfig = {
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
    to: 'contact@hexium.io',
    subject: '[AUTRE]',
  },
};

/**
 * Send an email
 * @param to Email recipient
 * @param subject Email subject
 * @param html Email content in HTML format
 * @returns Promise that resolves when the email is sent
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  await transporter.sendMail({
    from: import.meta.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

/**
 * Generate HTML content for the email
 * @param formData Form data
 * @param fileUrls URLs of uploaded files
 * @returns HTML content for the email
 */
export function generateEmailContent(
  formData: Record<string, string>,
  fileUrls: string[] = []
): string {
  // Create HTML content for the email
  let html = `
    <h1>Nouveau message de contact</h1>
    <table style="border-collapse: collapse; width: 100%;">
      <tbody>
  `;

  // Add form data to the email
  for (const [key, value] of Object.entries(formData)) {
    if (key !== 'files' && key !== 'privacy') {
      html += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${formatFieldName(key)}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${value}</td>
        </tr>
      `;
    }
  }

  html += `
      </tbody>
    </table>
  `;

  // Add file links to the email if any
  if (fileUrls.length > 0) {
    html += `
      <h2>Fichiers joints</h2>
      <ul>
    `;

    for (const url of fileUrls) {
      const fileName = url.split('/').pop();
      html += `
        <li><a href="${url}" target="_blank">${fileName}</a></li>
      `;
    }

    html += `
      </ul>
    `;
  }

  return html;
}

/**
 * Format field name for display in the email
 * @param fieldName Field name
 * @returns Formatted field name
 */
function formatFieldName(fieldName: string): string {
  const fieldNameMap: Record<string, string> = {
    subject: 'Sujet',
    firstname: 'Prénom',
    lastname: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    company: 'Entreprise',
    message: 'Message',
  };

  return fieldNameMap[fieldName] || fieldName;
}
