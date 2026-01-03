// sensorsData.ts
export interface Sensor {
  id: string;
  name: string;
  icon: keyof typeof import('@expo/vector-icons').MaterialIcons.glyphMap;
  active: boolean;
}

export const sensorsData: Sensor[] = [
  { id: '1', name: 'Luz Sala', icon: 'lightbulb', active: false },
  { id: '2', name: 'Câmara', icon: 'videocam', active: false },
  { id: '3', name: 'Medicação', icon: 'medical-services', active: false },
  { id: '4', name: 'Sala', icon: 'home', active: false },
  { id: '5', name: 'Home', icon: 'home', active: false },
];
