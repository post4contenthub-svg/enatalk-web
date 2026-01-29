import CustomerLayout from "@/components/customer/CustomerLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CustomerLayout>{children}</CustomerLayout>;
}