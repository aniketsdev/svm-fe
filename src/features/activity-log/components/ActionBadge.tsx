import { cn } from '../../../lib/cn';

/** Pick a colour tone for an action string like "auth.login.success". */
function tone(action: string): string {
  const a = action.toLowerCase();
  if (a.includes('fail') || a.includes('delete') || a.includes('revoke'))
    return 'bg-destructive/10 text-destructive';
  if (a.includes('create') || a.includes('invitation')) return 'bg-info/10 text-info';
  if (a.includes('update')) return 'bg-warning/10 text-warning';
  if (a.includes('success') || a.includes('complete')) return 'bg-positive/10 text-positive';
  return 'bg-secondary text-secondary-foreground';
}

export function ActionBadge({ action }: { action: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        tone(action),
      )}
    >
      {action}
    </span>
  );
}
