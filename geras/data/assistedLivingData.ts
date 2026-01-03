export interface AssistedLivingData {
  id: string;
  title: string;
  description: string;
  status: 'Adequado' | 'Moderado' | 'Excessivo';
  value: number;
  unit: string;
}

export const ASSISTED_LIVING_DATA: AssistedLivingData[] = [
  {
    id: '1',
    title: 'Batimento Cardíaco',
    description: 'Monitorização do batimento cardíaco ao longo do dia.',
    status: 'Moderado',
    value: 89,
    unit: 'bpm',
  },
  {
    id: '2',
    title: 'Pressão Arterial',
    description: 'Monitorização da pressão arterial ao longo do dia.',
    status: 'Adequado',
    value: 120,
    unit: 'mmHg',
  },
  {
    id: '3',
    title: 'Temperatura',
    description: 'Monitorização da temperatura corporal ao longo do dia.',
    status: 'Adequado',
    value: 36.5,
    unit: '°C',
  },
];
