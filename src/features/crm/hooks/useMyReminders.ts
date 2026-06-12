import { useQuery } from '@tanstack/react-query';
import { myRemindersQueryOptions, type Envelope, type ReminderList, type MyRemindersQueryArgs } from '../api/crm';

/** The current user's due/overdue follow-up reminders. */
export function useMyReminders(args: MyRemindersQueryArgs) {
  const query = useQuery(myRemindersQueryOptions(args));
  const envelope = query.data as Envelope<ReminderList> | undefined;
  return {
    reminders: envelope?.data.items ?? [],
    total: envelope?.data.total ?? 0,
    isLoading: query.isPending || query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}
