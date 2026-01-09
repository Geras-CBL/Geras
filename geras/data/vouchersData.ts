export interface VoucherData {
  id: string;
  name_store: string;
  address: string;
  value: string;
  currentTasks: number;
  totalTasks: number;
}

export const VOUCHERS_DATA: VoucherData[] = [
  {
    id: '1',
    name_store: 'Supermercado Lili & Co',
    address: 'Rua da Glória, 123',
    value: '2%',
    currentTasks: 3,
    totalTasks: 5,
  },
  {
    id: '2',
    name_store: 'Livraria Central',
    address: 'Rua da Glória, 3',
    value: '5%',
    currentTasks: 3,
    totalTasks: 5,
  },
  {
    id: '3',
    name_store: 'Padaria do Bairro',
    address: 'Rua da Glória, 13',
    value: '2%',
    currentTasks: 2,
    totalTasks: 5,
  },
  {
    id: '4',
    name_store: 'Supermercados Eduardo',
    address: 'Rua da Glória, 12',
    value: '10%',
    currentTasks: 1,
    totalTasks: 5,
  },
  {
    id: '5',
    name_store: 'Ferraria Mateus',
    address: 'Rua da Glória, 1',
    value: '5%',
    currentTasks: 0,
    totalTasks: 5,
  },
];
