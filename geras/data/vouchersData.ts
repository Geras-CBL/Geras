export interface VoucherData {
  id: string;
  name_store: string;
  address: string;
  value: string;
  currentTasks: number;
  totalTasks: number;
  status: string;
  distance?: string;
  distanceVal?: number;
  latitude?: number;
  longitude?: number;
}
