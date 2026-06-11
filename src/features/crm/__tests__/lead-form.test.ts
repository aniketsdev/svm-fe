import { describe, expect, it } from 'vitest';
import { leadSchema, toLeadBody, emptyLead } from '../hooks/useCreateLeadForm';

describe('lead form schema', () => {
  it('requires contact, clinic, phone, source', () => {
    const r = leadSchema.safeParse(emptyLead);
    expect(r.success).toBe(false);
    if (!r.success) {
      const fields = r.error.issues.map((i) => i.path[0]);
      expect(fields).toEqual(expect.arrayContaining(['contact_name', 'clinic_name', 'phone', 'source_uuid']));
    }
  });

  it('rejects a malformed phone and email', () => {
    const r = leadSchema.safeParse({ ...emptyLead, contact_name: 'A', clinic_name: 'B', source_uuid: 'x', phone: '!!!', email: 'nope' });
    expect(r.success).toBe(false);
  });

  it('accepts a valid lead and maps empty optionals to null', () => {
    const values = { ...emptyLead, contact_name: 'Dr. A', clinic_name: 'A Clinic', phone: '9876543210', source_uuid: 'src-uuid' };
    const r = leadSchema.safeParse(values);
    expect(r.success).toBe(true);
    const body = toLeadBody(values);
    expect(body.email).toBeNull();
    expect(body.estimated_annual_value).toBeNull();
    expect(body.messaging_opt_in).toBe(false);
    expect(body.contact_name).toBe('Dr. A');
  });
});
