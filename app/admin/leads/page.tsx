import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminLeadsTable } from "@/components/admin/admin-leads-table";

export default function AdminLeadsPage() {
  return (
    <AdminLayout>
      <AdminLeadsTable />
    </AdminLayout>
  );
}
