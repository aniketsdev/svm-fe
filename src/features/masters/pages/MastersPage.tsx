import {
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

const SECTIONS: MasterSection[] = [
  {
    key: 'stores',
    label: 'Stores',
    description: 'Warehouses, factory & retail locations',
    icon: Warehouse,
    to: '/masters/stores',
    ready: true,
  },
  {
    key: 'vendors',
    label: 'Vendors',
    description: 'Raw-material suppliers (GSTIN, state)',
    icon: Factory,
    to: '/masters/vendors',
    ready: true,
  },
  {
    key: 'couriers',
    label: 'Courier Partners',
    description: 'Delivery & logistics partners',
    icon: Truck,
    to: '/masters/courier-partners',
    ready: true,
  },
  {
    key: 'rm-categories',
    label: 'RM Categories',
    description: 'Raw-material classification',
    icon: Tags,
    to: '/masters/rm-categories',
    ready: true,
  },
  {
    key: 'products',
    label: 'Products',
    description: 'Finished goods — HSN, MRP, GST',
    icon: Package,
    to: '/masters/products',
    ready: true,
  },
  {
    key: 'raw-materials',
    label: 'Raw Materials',
    description: 'Herbs, fruits & processed items',
    icon: Leaf,
    to: '/masters/raw-materials',
    ready: true,
  },
  {
    key: 'boms',
    label: 'BOMs',
    description: 'Bill-of-materials recipes',
    icon: ClipboardList,
    to: '/masters/boms',
    ready: true,
  },
  {
    key: 'doctors',
    label: 'Doctors',
    description: 'Customer master',
    icon: Stethoscope,
    to: '/masters/doctors',
    ready: true,
  },
  {
    key: 'doctor-pricing',
    label: 'Doctor Pricing',
    description: 'Negotiated rates & validity',
    icon: IndianRupee,
    to: '/masters/doctor-pricing',
    ready: true,
  },
  {
    key: 'doctor-aliases',
    label: 'Doctor Aliases',
    description: 'Alternate names for doctors',
    icon: Contact,
    to: '/masters/doctor-aliases',
    ready: true,
  },
];

export function MastersPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Masters</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reference data. Pick a section to manage entries.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map(({ key, ...section }) => (
          <MasterCard key={key} {...section} />
        ))}
      </div>
    </div>
  );
}

export default MastersPage;
