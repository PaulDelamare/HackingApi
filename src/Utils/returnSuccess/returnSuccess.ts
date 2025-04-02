import { CookieOptions, Response } from 'express';

/**
 * Sends an HTTP success response with a status, a message and optional data.
 * 
 * @param res - The response object to send the response to the client.
 * @param status - The HTTP status code (e.g. 200, 201, etc.).
 * @param message - The message to include in the response.
 * @param data - Optional additional data to include in the response.
 */
export const sendSuccess = <T>(res: Response, status: number, message: string, data?: T, cookie?: { name: string; value: string; options?: CookieOptions }) => {

    // Create the response object
    const response: { status: number, message: string, data?: T } = {
        status,
        message,
    };

    // Add the data if it exists
    if (data !== undefined) {
        response.data = data;
    }


    // Send the response
    !cookie ?
        res.status(status).json(response) :
        res.cookie(cookie.name, cookie.value, cookie.options || {}).status(status).json(response);
};