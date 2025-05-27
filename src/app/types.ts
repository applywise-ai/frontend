import { Option } from "./components/ui/multi-select";

export const LOCATION_TYPE_OPTIONS: readonly Option[] = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" }
];

export const ROLE_LEVEL_OPTIONS: readonly Option[] = [
  { value: "internship", label: "Internship" },
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
  { value: "vp", label: "VP" },
  { value: "c_level", label: "C-Level" }
];

export const SPECIALIZATION_OPTIONS: readonly Option[] = [
  { value: "software_engineering", label: "Software Engineering" },
  { value: "data_science", label: "Data Science" },
  { value: "product_management", label: "Product Management" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
  { value: "human_resources", label: "Human Resources" },
  { value: "customer_success", label: "Customer Success" },
]; 