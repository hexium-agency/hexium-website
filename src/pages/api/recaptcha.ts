import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();

  const recaptchaURL = 'https://www.google.com/recaptcha/api/siteverify';
  const requestHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  const requestBody = new URLSearchParams({
    secret: "6LcTsY4rAAAAAO5XdQeaJL1Y_xyuWDbAHyZsRIyt",
    response: data.recaptcha
  });

  const response = await fetch(recaptchaURL, {
    method: "POST",
    headers: requestHeaders,
    body: requestBody.toString()
  });

  const responseData = await response.json();

  console.log(responseData);

  return new Response(JSON.stringify(responseData), { status: 200 });
};
