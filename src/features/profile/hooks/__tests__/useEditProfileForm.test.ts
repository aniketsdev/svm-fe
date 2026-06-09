import { describe, expect, it } from 'vitest';
import { editProfileSchema } from '../useEditProfileForm';

describe('editProfileSchema', () => {
  it('accepts valid name and phone values', () => {
    const r = editProfileSchema.safeParse({
      first_name: 'Jyoti',
      last_name: 'Varade',
      phone: '+91 98765 43210',
    });
    expect(r.success).toBe(true);
  });

  it('allows empty / omitted optional fields (clears to "not set")', () => {
    expect(editProfileSchema.safeParse({}).success).toBe(true);
    expect(editProfileSchema.safeParse({ first_name: '', last_name: '', phone: '' }).success).toBe(true);
  });

  it('rejects an over-length first name (>100)', () => {
    const r = editProfileSchema.safeParse({ first_name: 'a'.repeat(101) });
    expect(r.success).toBe(false);
  });

  it('rejects an over-length phone (>32)', () => {
    const r = editProfileSchema.safeParse({ phone: '9'.repeat(33) });
    expect(r.success).toBe(false);
  });

  it('rejects a phone with invalid characters', () => {
    const r = editProfileSchema.safeParse({ phone: '123-abc' });
    expect(r.success).toBe(false);
  });
});
