import { normalizeEmails } from '../../src/middlewares/normalizeEmails';
import { Request, Response, NextFunction } from 'express';

describe('normalizeEmails middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {}, query: {} };
    res = {};
    next = jest.fn();
  });

  it('should normalize a single email field in body', () => {
    req.body = { teacher: '  Teacher@Example.com ' };
    const middleware = normalizeEmails(['teacher']);

    middleware(req as Request, res as Response, next);

    expect(req.body.teacher).toBe('teacher@example.com');
    expect(next).toHaveBeenCalled();
  });

  it('should normalize an array of emails in body', () => {
    req.body = {
      students: ['  STUDENT1@Gmail.Com ', ' Student2@Yahoo.Com  '],
    };
    const middleware = normalizeEmails(['students']);

    middleware(req as Request, res as Response, next);

    expect(req.body.students).toEqual([
      'student1@gmail.com',
      'student2@yahoo.com',
    ]);
    expect(next).toHaveBeenCalled();
  });

  it('should normalize emails in query parameters', () => {
    req.query = { teacher: ' Teacher@Example.com ' };
    const middleware = normalizeEmails(['teacher']);

    middleware(req as Request, res as Response, next);

    expect(req.query.teacher).toBe('teacher@example.com');
    expect(next).toHaveBeenCalled();
  });

  it('should handle array in query parameters', () => {
    req.query = {
      teacher: ['One@Mail.com ', ' Two@Mail.com '],
    };
    const middleware = normalizeEmails(['teacher']);

    middleware(req as Request, res as Response, next);

    expect(req.query.teacher).toEqual(['one@mail.com', 'two@mail.com']);
    expect(next).toHaveBeenCalled();
  });

  it('should skip fields not present in body or query', () => {
    req.body = {};
    const middleware = normalizeEmails(['teacher']);

    middleware(req as Request, res as Response, next);

    expect(req.body).toEqual({});
    expect(next).toHaveBeenCalled();
  });

  it('should handle multiple fields in body and query', () => {
    req.body = { teacher: 'Teacher@Mail.Com ' };
    req.query = { students: [' S1@Mail.com ', ' S2@Mail.com '] };

    const middleware = normalizeEmails(['teacher', 'students']);
    middleware(req as Request, res as Response, next);

    expect(req.body.teacher).toBe('teacher@mail.com');
    expect(req.query.students).toEqual(['s1@mail.com', 's2@mail.com']);
    expect(next).toHaveBeenCalled();
  });
});
