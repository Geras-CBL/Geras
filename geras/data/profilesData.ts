export interface SeniorProfile {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  birthDate: string;
  country: string;
  image?: any;
  selected: boolean;
  alt?: string;
}

export const profilesData: SeniorProfile[] = [
  {
    id: '1',
    name: 'António Silva',
    age: 74,
    email: 'antonio.silva@gmail.com',
    password: '********',
    birthDate: '12/04/1949',
    country: 'Portugal',
    image: null,
    selected: true,
    alt: 'Foto do perfil de António Silva',
  },
  {
    id: '2',
    name: 'Maria Silva',
    age: 73,
    email: 'maria.silva@gmail.com',
    password: '********',
    birthDate: '23/05/1950',
    country: 'Portugal',
    image: null,
    selected: false,
    alt: 'Foto do perfil de Maria Silva',
  },
];
