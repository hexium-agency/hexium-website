/**
 * Create a JSON response
 * @param success boolean
 * @param data any
 * @param message string
 * @returns Response
 */
export function jsonResponse(success: boolean, data?: any, message?: string) {
  return new Response(JSON.stringify({ success, data, message }), {
    status: success ? 200 : 400,
    headers: { 'Content-Type': 'application/json' },
  });
}
