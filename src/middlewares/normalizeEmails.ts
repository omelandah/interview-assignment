import { Request, Response, NextFunction } from 'express';

export const normalizeEmails = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fields.forEach((field) => {
      const value = req.query[field] ?? req.body[field];
      if (value) {
        const normalized = Array.isArray(value)
          ? value.map((v) => v.toLowerCase().trim())
          : value.toLowerCase().trim();

        if (req.query?.[field]) req.query[field] = normalized;
        if (req.body?.[field]) req.body[field] = normalized;
      }
    });
    next();
  };
};
