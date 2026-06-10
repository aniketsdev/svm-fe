// Data access for the CRM feature. Points at the admin CRM API (backend
// feature 024): GET /admin/crm/leads returns { items, total, limit, offset } of
// LeadListItem. Search, stage/source/assignee filtering, sorting and pagination
// are all handled server-side. Mirrors features/users/api/users.ts.
import {
  getAdminListLeadsQueryOptions,
  getAdminGetLeadQueryOptions,
  getAdminLeadSummaryQueryOptions,
  getAdminLeadDuplicatesQueryOptions,
  getAdminListLeadSourcesQueryOptions,
  getAdminListClosureReasonsQueryOptions,
  getAdminListLeadRemindersQueryOptions,
  getAdminListDueRemindersQueryOptions,
  getAdminListLeadNotesQueryOptions,
} from '../../../sdk/crm';
import type {
  LeadList,
  LeadListItem,
  LeadDetail,
  SourceOut,
  ClosureReasonOut,
  ReminderOut,
  ReminderList,
  NoteOut,
  PipelineSummary,
} from '../../../sdk/schemas';

export type {
  LeadList,
  LeadListItem,
  LeadDetail,
  SourceOut,
  ClosureReasonOut,
  ReminderOut,
  ReminderList,
  NoteOut,
  PipelineSummary,
};

/** Pipeline stages (matches the backend CHECK + generated enums). */
export type Stage = 'NEW' | 'IN_PROGRESS' | 'FOLLOW_UP' | 'WON' | 'LOST';
export type Outcome = 'WON' | 'LOST';

/** The SDK mutator wraps every response as { data, status, headers }. */
export interface Envelope<T> {
  data: T;
  status: number;
}

export interface LeadsQueryArgs {
  /** 0-based page index. */
  page: number;
  /** Rows per page (maps to `limit`). */
  pageSize: number;
  /** Free-text search across contact/clinic/phone. */
  q?: string;
  stage?: Stage;
  sourceUuid?: string;
  assigneeUuid?: string;
  city?: string;
  state?: string;
  outcome?: Outcome;
  closureReasonUuid?: string;
  /** Server-sortable columns only. */
  sort?: 'created_at' | 'updated_at' | 'estimated_annual_value' | 'clinic_name';
  order?: 'asc' | 'desc';
}

/** Build the backend `sort` string (`-field` for descending). */
function sortParam(sort?: LeadsQueryArgs['sort'], order?: LeadsQueryArgs['order']): string | undefined {
  if (!sort) return undefined;
  return order === 'desc' ? `-${sort}` : sort;
}

/** TanStack Query options for `GET /api/v1/admin/crm/leads`. */
export function leadsQueryOptions({
  page,
  pageSize,
  q,
  stage,
  sourceUuid,
  assigneeUuid,
  city,
  state,
  outcome,
  closureReasonUuid,
  sort,
  order,
}: LeadsQueryArgs) {
  const trimmed = q?.trim();
  return getAdminListLeadsQueryOptions({
    q: trimmed ? trimmed : undefined,
    stage: stage ?? undefined,
    source_uuid: sourceUuid ?? undefined,
    assignee_uuid: assigneeUuid ?? undefined,
    city: city?.trim() ? city.trim() : undefined,
    state: state?.trim() ? state.trim() : undefined,
    outcome: outcome ?? undefined,
    closure_reason_uuid: closureReasonUuid ?? undefined,
    sort: sortParam(sort, order),
    limit: pageSize,
    offset: page * pageSize,
  });
}

export const leadDetailQueryOptions = (leadUuid: string) => getAdminGetLeadQueryOptions(leadUuid);
export const leadSummaryQueryOptions = () => getAdminLeadSummaryQueryOptions();
export const leadDuplicatesQueryOptions = (params: { phone?: string; clinic_name?: string }) =>
  getAdminLeadDuplicatesQueryOptions(params);
export const leadNotesQueryOptions = (leadUuid: string) => getAdminListLeadNotesQueryOptions(leadUuid);
export const leadRemindersQueryOptions = (leadUuid: string) =>
  getAdminListLeadRemindersQueryOptions(leadUuid);
export const sourcesQueryOptions = (includeInactive = false) =>
  getAdminListLeadSourcesQueryOptions({ include_inactive: includeInactive });
export const closureReasonsQueryOptions = (outcome?: Outcome, includeInactive = false) =>
  getAdminListClosureReasonsQueryOptions({ outcome: outcome ?? undefined, include_inactive: includeInactive });

export interface MyRemindersQueryArgs {
  page: number;
  pageSize: number;
  due?: boolean;
  overdueOnly?: boolean;
  owner?: string; // 'me' (default) or an owner uuid
}

export function myRemindersQueryOptions({
  page,
  pageSize,
  due = true,
  overdueOnly,
  owner = 'me',
}: MyRemindersQueryArgs) {
  return getAdminListDueRemindersQueryOptions({
    due,
    overdue_only: overdueOnly ?? undefined,
    owner,
    limit: pageSize,
    offset: page * pageSize,
  });
}

/** Display helper: assignee/owner/author full label. */
export function personLabel(p: { email: string; first_name?: string | null; last_name?: string | null } | null): string {
  if (!p) return '—';
  const name = [p.first_name, p.last_name].filter(Boolean).join(' ').trim();
  return name || p.email;
}

/** Display helper: format the serialized decimal value (INR assumed). */
export function formatValue(v: string | null): string {
  if (v == null || v === '') return '—';
  const n = Number(v);
  if (Number.isNaN(n)) return v;
  return `₹${n.toLocaleString('en-IN')}`;
}
