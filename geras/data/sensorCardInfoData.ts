export type SensorCardStatus = 'motion' | 'noMotion' | 'warning';

export const sensorCardInfoData: Record<
  SensorCardStatus,
  { title: string; subtitle: (count?: number) => string }
> = {
  motion: {
    title: 'EXISTE MOVIMENTO NA SALA',
    subtitle: (count?: number) => `E há ${count ?? 0} sensor(es) ligado(s)`,
  },
  noMotion: {
    title: 'SEM MOVIMENTO NA SALA',
    subtitle: () => 'Sem sensores ativos',
  },
  warning: {
    title: 'AVISO NA SALA',
    subtitle: () => '1 aviso',
  },
};
