export type ItemDTO = {
  id: string;
  name: string;
};

export async function fetchItems(): Promise<ItemDTO[]> {
  return [
    { id: '1', name: 'Item lista 1' },
    { id: '2', name: 'Item lista 2' },
    { id: '3', name: 'Item lista 3' },
  ];
}
