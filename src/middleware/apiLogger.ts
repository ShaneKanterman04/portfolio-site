import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '../utils/logger';

type NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

export function withLogging(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const start = Date.now();
    const { method, url, headers, body, query } = req;
    
    // Log request
    logger.info(`API Request: ${method} ${url}`, {
      query,
      body: method !== 'GET' ? body : undefined,
      userAgent: headers['user-agent'],
      ip: headers['x-forwarded-for'] || req.socket.remoteAddress,
    });
    
    // Create a response interceptor
    const originalJson = res.json;
    const originalStatus = res.status;
    let statusCode: number;
    
    res.status = (code) => {
      statusCode = code;
      return originalStatus.call(res, code);
    };
    
    res.json = (body) => {
      const duration = Date.now() - start;
      logger.info(`API Response: ${method} ${url} - ${statusCode} - ${duration}ms`, {
        responseBody: process.env.NODE_ENV === 'development' ? body : undefined,
      });
      return originalJson.call(res, body);
    };
    
    try {
      await handler(req, res);
    } catch (error) {
      logger.error(`API Error: ${method} ${url}`, {
        error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
      });
      
      // If response hasn't been sent yet, send a 500
      if (!res.writableEnded) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
}
