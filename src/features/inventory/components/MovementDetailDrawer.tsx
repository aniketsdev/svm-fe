import { CustomDrawer } from '../../../common/custom-drawer';
import { formatDateTime } from '../../../utils/format';
import {
  formatSignedInventoryQuantity,
  inventoryTypeLabel,
  movementDirectionLabel,
  movementKindLabel,
} from '../../../utils/inventory';
import type { MovementRow } from '../api/inventory';

interface MovementDetailDrawerProps {
  movement: MovementRow | null;
  onClose: () => void;
}

function DetailItem({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{value || '-'}</dd>
    </div>
  );
}

export function MovementDetailDrawer({ movement, onClose }: MovementDetailDrawerProps) {
  const transferPath =
    movement?.related_store_name &&
    `${movement.direction === 'out' ? movement.store_name : movement.related_store_name} -> ${
      movement.direction === 'out' ? movement.related_store_name : movement.store_name
    }`;

  return (
    <CustomDrawer
      anchor="right"
      title="Movement detail"
      open={movement !== null}
      onClose={onClose}
      drawerWidth="34rem"
    >
      {movement && (
        <div className="flex flex-col gap-5">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Ledger #{movement.id}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">
                  {movement.item_name}
                </h2>
                <p className="text-sm text-muted-foreground">{movement.item_code}</p>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {movementKindLabel(movement.kind)}
              </span>
            </div>
            <p className="mt-4 text-2xl font-semibold tabular-nums text-foreground">
              {formatSignedInventoryQuantity(
                movement.direction,
                movement.quantity,
                movement.unit,
              )}
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailItem label="Direction" value={movementDirectionLabel(movement.direction)} />
            <DetailItem label="Item type" value={inventoryTypeLabel(movement.item_type)} />
            <DetailItem label="Store" value={movement.store_name} />
            <DetailItem label="Transfer path" value={transferPath || null} />
            <DetailItem label="Reference" value={movement.reference} />
            <DetailItem label="Counterparty" value={movement.counterparty} />
            <DetailItem label="Recorded by" value={movement.created_by_email} />
            <DetailItem label="Recorded at" value={formatDateTime(movement.created_at)} />
          </dl>

          {movement.note && (
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-xs font-medium text-muted-foreground">Note</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{movement.note}</p>
            </div>
          )}

          <div className="rounded-lg border border-border bg-accent-05 p-4 text-sm text-accent-foreground">
            This entry is append-only. Corrections should be recorded as a new adjustment movement.
          </div>
        </div>
      )}
    </CustomDrawer>
  );
}
