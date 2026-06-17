export type LabelType = "MANUAL" | "AUTO";

export interface Label {
  id: string;
  key: string;
  name: string;
  color: string;
  textColor?: string | null;
  icon?: string | null;
  type: LabelType;
  /** JSON-encoded RuleSet string for AUTO labels; null for MANUAL. */
  rule?: string | null;
  priority: number;
  isEnabled: boolean;
  isSystem: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetLabelsData {
  labels: Label[];
}
export interface GetAdminLabelsData {
  adminLabels: Label[];
}
export interface GetLabelData {
  label: Label;
}
export interface CreateLabelData {
  createLabel: Label;
}
export interface UpdateLabelData {
  updateLabel: Label;
}
