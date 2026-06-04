import { CustomDialog } from '../../../common/custom-dialog';
import type { BomRow } from '../api/boms';

interface BomDetailDialogProps {
  bom: BomRow | null;
  onClose: () => void;
}

/** Row-click detail: BOM header + its line items. */
export function BomDetailDialog({ bom, onClose }: BomDetailDialogProps) {
  return (
    <CustomDialog
      title={bom ? `${bom.code} — ${bom.name}` : 'BOM'}
      open={bom !== null}
      onClose={onClose}
      width="40rem"
    >
      {bom && (
        <div className="flex flex-col gap-4 text-sm">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-xs text-muted-foreground">Product</dt>
              <dd className="text-foreground">{bom.product_name ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Output qty</dt>
              <dd className="text-foreground">{bom.output_qty ?? '—'}</dd>
            </div>
          </dl>

          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Line items ({bom.line_count})
            </p>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2 font-medium">#</th>
                    <th className="px-3 py-2 font-medium">Raw material</th>
                    <th className="px-3 py-2 font-medium">Qty</th>
                    <th className="px-3 py-2 font-medium">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {bom.lines.map((line, i) => (
                    <tr key={line.id} className="border-t border-border">
                      <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                      <td className="px-3 py-2 text-foreground">{line.raw_material_name ?? '—'}</td>
                      <td className="px-3 py-2 tabular-nums text-foreground">{line.quantity}</td>
                      <td className="px-3 py-2 text-muted-foreground">{line.unit ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </CustomDialog>
  );
}
