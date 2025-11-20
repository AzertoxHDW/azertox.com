import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
  const code = parseInt(params.code);

  // Validate that it's a valid error code
  if (isNaN(code) || code < 400 || code > 599) {
    throw error(400, 'Invalid error code. Please use a code between 400-599.');
  }

  // Map error codes to custom messages for testing
  const errorMessages: { [key: number]: string } = {
    400: 'Bad Request - The request syntax is invalid',
    401: 'Unauthorized - Authentication required',
    403: 'Forbidden - Access denied',
    404: 'Not Found - The resource does not exist',
    405: 'Method Not Allowed - This method is not supported',
    408: 'Request Timeout - The request took too long',
    429: 'Too Many Requests - Rate limit exceeded',
    500: 'Internal Server Error - Something went wrong on the server',
    501: 'Not Implemented - This feature is not implemented',
    502: 'Bad Gateway - Invalid response from upstream server',
    503: 'Service Unavailable - The service is temporarily down',
    504: 'Gateway Timeout - Upstream server timeout'
  };

  const message = errorMessages[code] || `HTTP Error ${code}`;

  // Throw the error with the specified status code
  throw error(code, message);
};
