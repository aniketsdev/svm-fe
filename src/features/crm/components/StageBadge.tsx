import type { Stage } from '../api/crm';

interface StageBadgeProps {
  stage: Stage;
}

const STAGE_LABEL: Record<Stage, string> = {
  NEW: 'New',
  IN_PROGRESS: 'In Progress',
  FOLLOW_UP: 'Follow-Up',
  WON: 'Won',
  LOST: 'Lost',
};

// Tone classes reuse the app's status tokens (positive/destructive/info/muted).
const STAGE_TONE: Record<Stage, string> = {
  NEW: 'bg-info/10 text-info',
  IN_PROGRESS: 'bg-primary/10 text-primary',
  FOLLOW_UP: 'bg-warning/10 text-warning',
  WON: 'bg-positive/10 text-positive',
  LOST: 'bg-muted text-muted-foreground',
};

/** Pipeline stage pill, consistent with the app's StatusPill styling. */
export function StageBadge({ stage }: StageBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${STAGE_TONE[stage]}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {STAGE_LABEL[stage]}
    </span>
  );
}
