const SELLSY_API_URL = 'https://api.sellsy.com/v2/';
const SELLSY_CLIENT_ID = import.meta.env.SELLSY_CLIENT_ID;
const SELLSY_CLIENT_SECRET = import.meta.env.SELLSY_CLIENT_SECRET;

interface TokenData {
  access_token: string;
  expires_at: number;
}

let tokenData: TokenData | null = null;

/**
 * Create a new prospect in Sellsy CRM
 *
 * This function creates either:
 * - A company prospect with an associated contact (if company name is provided)
 * - An individual prospect (if no company name is provided)
 *
 * @param data - The prospect data
 * @param data.firstname - First name of the contact
 * @param data.lastname - Last name of the contact
 * @param data.email - Email address of the contact
 * @param data.phone - Phone number of the contact (optional)
 * @param data.company - Company name (optional, if provided creates a company prospect)
 * @param data.message - Message or note to attach to the prospect
 * @throws {Error} If the API credentials are invalid or if the API request fails
 * @returns {Promise<void>} A promise that resolves when the prospect is created
 */
export async function createProspect(data: {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}): Promise<void> {
  try {
    if (!SELLSY_CLIENT_ID || !SELLSY_CLIENT_SECRET) {
      throw new Error('Missing Sellsy API credentials. Please check your environment variables.');
    }

    const contactData = {
      first_name: data.firstname,
      last_name: data.lastname,
      email: data.email,
      phone_number: data.phone || '',
    };

    if (data.company) {
      await createCompanyProspect(contactData, {
        name: data.company,
        email: data.email,
        phone_number: data.phone || '',
        note: data.message,
      });
    } else {
      await createIndividualProspect(contactData, data.message);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create prospect in Sellsy: ${errorMessage}`);
  }
}

/**
 * Create a company prospect with an associated contact
 * @param contactData - The contact data
 * @param companyData - The company data
 * @returns {Promise<void>}
 */
async function createCompanyProspect(
  contactData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  },
  companyData: {
    name: string;
    email: string;
    phone_number: string;
    note: string;
  }
): Promise<void> {
  try {
    const contact = await makeApiRequest('POST', 'contacts', contactData);

    const company = await makeApiRequest('POST', 'companies', {
      ...companyData,
      type: 'prospect',
    });

    await makeApiRequest('POST', `companies/${company.id}/contacts/${contact.id}`, {
      roles: ['main', 'invoicing', 'dunning'],
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Create an individual prospect
 * @param contactData - The contact data
 * @param note - The note to attach to the prospect
 * @returns {Promise<void>}
 */
async function createIndividualProspect(
  contactData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  },
  note: string
): Promise<void> {
  try {
    await makeApiRequest('POST', 'individuals', {
      ...contactData,
      type: 'prospect',
      note: note,
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Get an OAuth2 access token
 * @returns The access token
 * @throws {Error} If the token request fails
 */
async function getAccessToken(): Promise<string> {
  if (tokenData && tokenData.expires_at > Date.now()) {
    return tokenData.access_token;
  }

  try {
    const response = await fetch(`https://login.sellsy.com/oauth2/access-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: SELLSY_CLIENT_ID,
        client_secret: SELLSY_CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get access token: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    tokenData = {
      access_token: data.access_token,
      expires_at: Date.now() + (data.expires_in - 60) * 1000,
    };

    return tokenData.access_token;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Authentication failed: ${errorMessage}`);
  }
}

/**
 * Make an API request to Sellsy v2
 * @param method HTTP method
 * @param endpoint API endpoint
 * @param data Request data
 * @returns API response
 * @throws {Error} If the API request fails
 */
async function makeApiRequest(method: string, endpoint: string, data?: any): Promise<any> {
  try {
    const accessToken = await getAccessToken();

    const options: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${SELLSY_API_URL}${endpoint}`, options);
    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || responseData.error || response.statusText;
      throw new Error(`API error: ${JSON.stringify(errorMessage)}`);
    }

    return responseData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Request to ${endpoint} failed: ${errorMessage}`);
  }
}
