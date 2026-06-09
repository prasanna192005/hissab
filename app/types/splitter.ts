export type Step = "UPLOAD" | "PARSING" | "REVIEW" | "PEOPLE" | "ASSIGN" | "SETTLEMENT";

export interface Item {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  lowConfidence?: boolean;
}
