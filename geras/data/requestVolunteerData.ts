export interface RequestData {
  id: string;
  name: string;
  category?: string;
  task: string;
  state: boolean;
  isNew: boolean;
  date: string;
  time: string;
  age?: string;
  distance?: string;
  location?: string;
  imageUrl?: string;
}

export const REQUESTS_DATA: RequestData[] = [
  {
    id: '1',
    name: 'António Silva',
    category: 'Tarefa doméstica',
    task: 'Limpeza de casa',
    state: false,
    isNew: false,
    date: '2025-10-15',
    time: '14:30',
    age: '73 anos',
    distance: '2.3 Km',
    location: 'Rua João Pereira Almeida 76, Safira',
  },
  {
    id: '2',
    name: 'Maria Santos',
    category: 'Compras',
    task: 'Compras de supermercado',
    state: false,
    isNew: true,
    date: '2025-10-16',
    time: '10:00',
    age: '68 anos',
    distance: '1.5 Km',
    location: 'Av. da Liberdade, 10',
  },
  {
    id: '3',
    name: 'José Costa',
    category: 'Saúde',
    task: 'Acompanhamento médico',
    state: false,
    isNew: false,
    date: '2025-10-17',
    time: '09:15',
    age: '80 anos',
    distance: '5.0 Km',
    location: 'Rua do Centro de Saúde',
  },
  {
    id: '4',
    name: 'Ana Pereira',
    category: 'Companhia',
    task: 'Passear o cão',
    state: false,
    isNew: false,
    date: '2025-10-18',
    time: '17:45',
    age: '55 anos',
    distance: '0.5 Km',
    location: 'Parque da Cidade',
  },
];
