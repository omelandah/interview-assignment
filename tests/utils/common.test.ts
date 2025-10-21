import { getMentionedEmails } from '../../src/utils/common';

// Mock regex pattern for consistency (if not defined in test environment)
jest.mock('../../src/constants/base', () => ({
  EMAIL_EXTRACT_REGEX: /@([\w.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
}));

describe('getMentionedEmails', () => {
  it('should extract a single mentioned email', () => {
    const str = 'Hello @student1@gmail.com';
    const result = getMentionedEmails(str);
    expect(result).toEqual(['student1@gmail.com']);
  });

  it('should extract multiple mentioned emails', () => {
    const str =
      'Hi @student1@gmail.com and @student2@yahoo.com, check updates.';
    const result = getMentionedEmails(str);
    expect(result).toEqual(['student1@gmail.com', 'student2@yahoo.com']);
  });

  it('should return an empty array if no mentions', () => {
    const str = 'This message has no mentions.';
    const result = getMentionedEmails(str);
    expect(result).toEqual([]);
  });

  it('should handle repeated mentions correctly', () => {
    const str = '@student@gmail.com please tell @student@gmail.com to reply.';
    const result = getMentionedEmails(str);
    expect(result).toEqual(['student@gmail.com', 'student@gmail.com']);
  });

  it('should not extract invalid mentions', () => {
    const str = '@not-an-email @missingdomain@, @also@wrong.';
    const result = getMentionedEmails(str);
    expect(result).toEqual([]);
  });
});
