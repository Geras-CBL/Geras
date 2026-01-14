export type RequestType = 'food' | 'cleaning' | 'pharmacy' | 'other';

export interface Pedido {
  id: string;
  title: string;
  subtitle: string;
  type: RequestType;
}

export const pedidosData: Pedido[] = [
  {
    id: '1',
    title: 'COMPRAS',
    subtitle: '12:23',
    type: 'food',
  },
  {
    id: '2',
    title: 'LIMPEZA DE CASA',
    subtitle: '14:53',
    type: 'cleaning',
  },
  {
    id: '3',
    title: 'MEDICAMENTOS',
    subtitle: '18:01',
    type: 'pharmacy',
  },
];
