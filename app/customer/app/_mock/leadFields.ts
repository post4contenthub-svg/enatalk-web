export type LeadField = {
  key: string;
  label: string;
  showInTable: boolean;
  isRequired: boolean;
};

export const leadFields: LeadField[] = [
  { key: "name", label: "Name", showInTable: true, isRequired: false },
  { key: "phone", label: "Phone", showInTable: true, isRequired: true },
  { key: "city", label: "City", showInTable: true, isRequired: false },
  { key: "order_id", label: "Order ID", showInTable: false, isRequired: false },
];
