export interface Pedido {
  id: string;
  title: string;
  subtitle: string;
}

export const pedidosData: Pedido[] = [
  {
    id: '1',
    title: 'PRECISA DE COMPRAS',
    subtitle: 'António Silva',
  },
  {
    id: '2',
    title: 'PRECISA DE AJUDA MÉDICA',
    subtitle: 'Maria Fernandes',
  },
  {
    id: '3',
    title: 'PRECISA DE COMPANHIA',
    subtitle: 'João Pereira',
  },
];
