export interface SeniorProfile {
  id: string;
  name: string;
  age: number;
  image?: any;
  selected: boolean;
}

// Simulando dados vindos de uma "API"
export const profilesData: SeniorProfile[] = [
  {
    id: '1',
    name: 'António Silva',
    age: 74,
    // image: require('@/assets/images/senior-placeholder.png'),
    image: null,
    selected: true,
  },
  {
    id: '2',
    name: 'Maria Silva',
    age: 73,
    // image: require('@/assets/images/senior-placeholder.png'),
    image: null,
    selected: false,
  },
];
