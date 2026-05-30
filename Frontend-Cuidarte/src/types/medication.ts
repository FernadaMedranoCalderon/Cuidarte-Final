export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: 'before' | 'during' | 'after';
  times: string[];
  stock: number;
  minStock: number;
}
