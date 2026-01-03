export interface MedicineDay {
  id: string;
  label: string;
  date: string;
  schedule: {
    time: string;
    medications: string[];
  }[];
}

export const MEDICINE_DATA: MedicineDay[] = [
  {
    id: '1',
    label: 'Hoje',
    date: '2023-10-24',
    schedule: [
      {
        time: '10:00',
        medications: ['Losartan 50 mg', 'Multivitamínico sénior 1x'],
      },
    ],
  },
  {
    id: '2',
    label: 'Amanhã',
    date: '2023-10-25',
    schedule: [
      {
        time: '08:00',
        medications: ['Losartan 50 mg'],
      },
      {
        time: '20:00',
        medications: ['Atorvastatina 20 mg'],
      },
    ],
  },
  {
    id: '3',
    label: 'Quarta-feira',
    date: '2023-10-26',
    schedule: [],
  },
];
