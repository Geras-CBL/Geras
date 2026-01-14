export interface RequestData {
  id: string;
  name: string;
  category?: string;
  task: string;
  type: string | number | (string | number)[] | null | undefined;
  state: boolean;
  isNew: boolean;
  date: string;
  time: string;
  age?: string;
  distance?: string;
  location?: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
}

export const REQUESTS_DATA: RequestData[] = [
  {
    id: '1',
    name: 'António Silva',
    category: 'Tarefa doméstica',
    type: 'cleaning',
    task: 'Limpeza de casa',
    state: false,
    isNew: false,
    date: '2025-10-15',
    time: '14:30',
    age: '73 anos',
    distance: '2.3 Km',
    location: 'Rua João Pereira Almeida 76, Safira',
    latitude: 40.6412,
    longitude: -8.635,
  },
  {
    id: '2',
    name: 'Maria Santos',
    category: 'Compras',
    type: 'food',
    task: 'Compras de supermercado',
    state: false,
    isNew: true,
    date: '2025-10-16',
    time: '10:00',
    age: '68 anos',
    distance: '1.5 Km',
    location: 'Av. da Liberdade, 10',
    latitude: 40.6434,
    longitude: -8.653,
  },
  {
    id: '3',
    name: 'José Costa',
    category: 'Saúde',
    type: 'other',
    task: 'Acompanhamento médico',
    state: false,
    isNew: false,
    date: '2025-10-17',
    time: '09:15',
    age: '80 anos',
    distance: '5.0 Km',
    location: 'Rua do Centro de Saúde',
    latitude: 40.6336,
    longitude: -8.655,
  },
  {
    id: '4',
    name: 'Ana Pereira',
    category: 'Companhia',
    type: 'other',
    task: 'Passear o cão',
    state: false,
    isNew: false,
    date: '2025-10-18',
    time: '17:45',
    age: '55 anos',
    distance: '0.5 Km',
    location: 'Parque da Cidade',
    latitude: 40.6364,
    longitude: -8.6531,
  },
];
