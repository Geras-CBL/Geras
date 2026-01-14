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
    subtitle: 'António Silva',
    type: 'food',
  },
  {
    id: '2',
    title: 'LIMPEZA DE CASA',
    subtitle: 'António Silva',
    type: 'cleaning',
  },
  {
    id: '3',
    title: 'MEDICAMENTOS',
    subtitle: 'António Silva',
    type: 'pharmacy',
  },
];
