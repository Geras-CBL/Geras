// sensorsData.ts
export interface Sensor {
  id: string;
  name: string;
  icon: keyof typeof import('@expo/vector-icons').MaterialIcons.glyphMap;
  active: boolean;
}

export const sensorsData: Sensor[] = [
  { id: '2', name: 'Câmara Entrada', icon: 'videocam', active: false },
  { id: '3', name: 'Medicação', icon: 'medical-services', active: false },
  { id: '5', name: 'Câmara Sala', icon: 'home', active: false },
];
