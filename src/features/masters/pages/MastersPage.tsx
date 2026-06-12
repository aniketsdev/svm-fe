/**
 * Masters hub (feature 027, US4): the 11 sections grouped by business area —
 * Procurement / Production / Customers / Logistics — with live record counts
 * on the masters-owned cards. All pre-027 options are retained.
 */
import {
  Boxes,
  ClipboardList,
  Contact,
  Factory,
  IndianRupee,
  Leaf,
  Package,
  Stethoscope,
  Tags,
  Truck,
  Warehouse,
} from 'lucide-react';
import { MasterCard, type MasterSection } from '../components/MasterCard';
import { useMastersCounts, type CountableSectionKey } from '../hooks/use-masters-counts';

interface HubSection extends MasterSection {
  /** Key into the live-counts map; sections without it show no count badge. */
  countKey?: CountableSectionKey;
}

interface HubGroup {
  title: string;
  sections: HubSection[];
}

const GROUPS: HubGroup[] = [
  {
    title: 'Procurement',
    sections: [
      {
        key: 'vendors',
        label: 'Vendors',
        description: 'Raw-material suppliers (GSTIN, state)',
        icon: Factory,
        to: '/masters/vendors',
        ready: true,
        countKey: 'vendors',
      },
      {
        key: 'rm-categories',
        label: 'RM Categories',
        description: 'Raw-material classification',
        icon: Tags,
        to: '/masters/rm-categories',
        ready: true,
        countKey: 'rm-categories',
      },
      {
        key: 'raw-materials',
        label: 'Raw Materials',
        description: 'Herbs, fruits & processed items',
        icon: Leaf,
        to: '/masters/raw-materials',
        ready: true,
        countKey: 'raw-materials',
      },
    ],
  },
  {
    title: 'Production',
    sections: [
      {
        key: 'products',
        label: 'Products',
        description: 'Finished goods — HSN, MRP, GST',
        icon: Package,
        to: '/masters/products',
        ready: true,
        countKey: 'products',
      },
      {
        key: 'boms',
        label: 'BOMs',
        description: 'Bill-of-materials recipes',
        icon: ClipboardList,
        to: '/masters/boms',
        ready: true,
        countKey: 'boms',
      },
      {
        key: 'materials',
        label: 'Materials',
        description: 'Inventory catalogue — RM & FG with UOM',
        icon: Boxes,
        to: '/masters/materials',
        ready: true,
      },
      {
        key: 'stores',
        label: 'Stores',
        description: 'Inventory storage locations (FG & RM)',
        icon: Warehouse,
        to: '/masters/stores',
        ready: true,
      },
    ],
  },
  {
    title: 'Customers',
    sections: [
      {
        key: 'doctors',
        label: 'Doctors',
        description: 'Customer master',
        icon: Stethoscope,
        to: '/masters/doctors',
        ready: true,
        countKey: 'doctors',
      },
      {
        key: 'doctor-pricing',
        label: 'Doctor Pricing',
        description: 'Negotiated rates & validity',
        icon: IndianRupee,
        to: '/masters/doctor-pricing',
        ready: true,
        countKey: 'doctor-pricing',
      },
      {
        key: 'doctor-aliases',
        label: 'Doctor Aliases',
        description: 'Alternate names for doctors',
        icon: Contact,
        to: '/masters/doctor-aliases',
        ready: true,
        countKey: 'doctor-aliases',
      },
    ],
  },
  {
    title: 'Logistics',
    sections: [
      {
        key: 'couriers',
        label: 'Courier Partners',
        description: 'Delivery & logistics partners',
        icon: Truck,
        to: '/masters/courier-partners',
        ready: true,
        countKey: 'couriers',
      },
    ],
  },
];

export function MastersPage() {
  const counts = useMastersCounts();

  return (
    <div className="w-full px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Masters</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reference data. Pick a section to manage entries and their documents.
        </p>
      </div>

      {GROUPS.map((group) => (
        <section key={group.title} className="mt-8 first-of-type:mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {group.title}
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.sections.map(({ key, countKey, ...section }) => (
              <MasterCard
                key={key}
                {...section}
                count={countKey ? counts[countKey] : undefined}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default MastersPage;
