export interface GroceryItem {
  id: string;
  name: string;
  checked: boolean;
}

export const INITIAL_GROCERIES: GroceryItem[] = [
  { id: '1', name: 'Leite Meio Gordo', checked: true },
  { id: '2', name: 'Pão de Forma', checked: true },
  { id: '3', name: 'Ovos (Dúzia)', checked: true },
  { id: '4', name: 'Arroz Agulha', checked: true },
  { id: '5', name: 'Massa Esparguete', checked: true },
];
