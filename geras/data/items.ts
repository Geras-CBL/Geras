export type ItemDTO = {
  id: string;
  name: string;
};

export async function fetchItems(): Promise<ItemDTO[]> {
  return [
    { id: '1', name: 'Atum em lata (em água) - 4 unidades' },
    { id: '2', name: 'Ovos - 12 unidades' },
    { id: '3', name: 'Peito de frango - 500 g' },
  ];
}
