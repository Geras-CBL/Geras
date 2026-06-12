import {
  initialize,
  readRecords,
  getGrantedPermissions,
  requestPermission,
} from 'react-native-health-connect';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipagem para os registos de monitorização do Supabase
interface MonitoringRecord {
  id_senior: number;
  metric_type:
    | 'HEART RATE'
    | 'BLOOD OXYGEN'
    | 'BLOOD PRESSURE'
    | 'WEIGHT'
    | 'TEMPERATURE'
    | 'BLOOD GLUCOSE';
  value_primary: number;
  value_secondary: number | null;
  measured_at: string;
  source: string;
}

// /**
//  * Gera dados de saúde simulados para fins de teste/bypass.
//  */
// function generateMockHealthData(userId: number): MonitoringRecord[] {
//   const now = new Date();

//   // Valores realistas para idosos
//   const heartRate = Math.floor(Math.random() * (90 - 65 + 1)) + 65; // 65-90 bpm
//   const systolic = Math.floor(Math.random() * (135 - 115 + 1)) + 115; // 115-135 mmHg (Sistólica)
//   const diastolic = Math.floor(Math.random() * (85 - 70 + 1)) + 70; // 70-85 mmHg (Diastólica)
//   const glucose = Math.floor(Math.random() * (140 - 80 + 1)) + 80; // 80-140 mg/dL
//   const oxygen = Math.floor(Math.random() * (99 - 95 + 1)) + 95; // 95-99 %
//   const temperature = parseFloat((Math.random() * (37.2 - 36.1) + 36.1).toFixed(1)); // 36.1-37.2 ºC
//   const weight = parseFloat((Math.random() * (85 - 68) + 68).toFixed(1)); // 68-85 kg

//   const measuredAt = now.toISOString();

//   return [
//     {
//       id_senior: userId,
//       metric_type: 'HEART RATE',
//       value_primary: heartRate,
//       value_secondary: null,
//       measured_at: measuredAt,
//       source: 'mock',
//     },
//     {
//       id_senior: userId,
//       metric_type: 'BLOOD PRESSURE',
//       value_primary: systolic,
//       value_secondary: diastolic,
//       measured_at: measuredAt,
//       source: 'mock',
//     },
//     {
//       id_senior: userId,
//       metric_type: 'TEMPERATURE',
//       value_primary: temperature,
//       value_secondary: null,
//       measured_at: measuredAt,
//       source: 'mock',
//     },
//     {
//       id_senior: userId,
//       metric_type: 'BLOOD GLUCOSE',
//       value_primary: glucose,
//       value_secondary: null,
//       measured_at: measuredAt,
//       source: 'mock',
//     },
//     {
//       id_senior: userId,
//       metric_type: 'BLOOD OXYGEN',
//       value_primary: oxygen,
//       value_secondary: null,
//       measured_at: measuredAt,
//       source: 'mock',
//     },
//     {
//       id_senior: userId,
//       metric_type: 'WEIGHT',
//       value_primary: weight,
//       value_secondary: null,
//       measured_at: measuredAt,
//       source: 'mock',
//     },
//   ];
// }

/**
 * Lê os dados reais do Health Connect a partir dos últimos 30 dias.
 */
async function readRealHealthData(userId: number): Promise<MonitoringRecord[]> {
  const records: MonitoringRecord[] = [];
  const endTime = new Date().toISOString();
  const startTime = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000,
  ).toISOString(); // últimos 30 dias

  const timeRangeFilter = {
    operator: 'between',
    startTime,
    endTime,
  } as const;

  console.log(
    `[HealthConnect] A pesquisar dados entre ${startTime} e ${endTime}...`,
  );

  try {
    // 1. Ritmo Cardíaco (HeartRate)
    const { records: heartRates } = await readRecords('HeartRate', {
      timeRangeFilter,
    });
    console.log(
      `[HealthConnect] Lidos ${heartRates.length} registos de Ritmo Cardíaco (HeartRate).`,
    );
    if (heartRates.length > 0) {
      const lastHR = heartRates[heartRates.length - 1];
      const samples = (lastHR as any).samples || [];
      if (samples.length > 0) {
        records.push({
          id_senior: userId,
          metric_type: 'HEART RATE',
          value_primary: samples[samples.length - 1].beatsPerMinute,
          value_secondary: null,
          measured_at:
            lastHR.metadata?.lastModifiedTime || new Date().toISOString(),
          source: 'health_connect',
        });
      }
    }

    // 2. Pressão Arterial (BloodPressure)
    const { records: bloodPressures } = await readRecords('BloodPressure', {
      timeRangeFilter,
    });
    console.log(
      `[HealthConnect] Lidos ${bloodPressures.length} registos de Pressão Arterial (BloodPressure).`,
    );
    if (bloodPressures.length > 0) {
      const lastBP = bloodPressures[bloodPressures.length - 1];
      const systolic = (lastBP as any).systolic?.inMillimetersOfMercury || null;
      const diastolic =
        (lastBP as any).diastolic?.inMillimetersOfMercury || null;
      if (systolic !== null) {
        records.push({
          id_senior: userId,
          metric_type: 'BLOOD PRESSURE',
          value_primary: systolic,
          value_secondary: diastolic,
          measured_at:
            lastBP.metadata?.lastModifiedTime || new Date().toISOString(),
          source: 'health_connect',
        });
      }
    }

    // 3. Temperatura Corporal (BodyTemperature)
    const { records: temperatures } = await readRecords('BodyTemperature', {
      timeRangeFilter,
    });
    console.log(
      `[HealthConnect] Lidos ${temperatures.length} registos de Temperatura Corporal (BodyTemperature).`,
    );
    if (temperatures.length > 0) {
      const lastTemp = temperatures[temperatures.length - 1];
      const tempVal = (lastTemp as any).temperature?.inCelsius || null;
      if (tempVal !== null) {
        records.push({
          id_senior: userId,
          metric_type: 'TEMPERATURE',
          value_primary: tempVal,
          value_secondary: null,
          measured_at:
            lastTemp.metadata?.lastModifiedTime || new Date().toISOString(),
          source: 'health_connect',
        });
      }
    }

    // 4. Glicémia (BloodGlucose)
    const { records: glucoses } = await readRecords('BloodGlucose', {
      timeRangeFilter,
    });
    console.log(
      `[HealthConnect] Lidos ${glucoses.length} registos de Glicémia (BloodGlucose).`,
    );
    if (glucoses.length > 0) {
      const lastGluc = glucoses[glucoses.length - 1];
      const glucoseVal =
        (lastGluc as any).level?.inMilligramsPerDeciliter || null;
      if (glucoseVal !== null) {
        records.push({
          id_senior: userId,
          metric_type: 'BLOOD GLUCOSE',
          value_primary: glucoseVal,
          value_secondary: null,
          measured_at:
            lastGluc.metadata?.lastModifiedTime || new Date().toISOString(),
          source: 'health_connect',
        });
      }
    }

    // 5. Saturação de Oxigénio (OxygenSaturation)
    const { records: oxygens } = await readRecords('OxygenSaturation', {
      timeRangeFilter,
    });
    console.log(
      `[HealthConnect] Lidos ${oxygens.length} registos de Saturação (OxygenSaturation).`,
    );
    if (oxygens.length > 0) {
      const lastOxy = oxygens[oxygens.length - 1];
      const oxygenVal = (lastOxy as any).percentage || null;
      if (oxygenVal !== null) {
        records.push({
          id_senior: userId,
          metric_type: 'BLOOD OXYGEN',
          value_primary: oxygenVal,
          value_secondary: null,
          measured_at:
            lastOxy.metadata?.lastModifiedTime || new Date().toISOString(),
          source: 'health_connect',
        });
      }
    }

    // 6. Peso (Weight)
    const { records: weights } = await readRecords('Weight', {
      timeRangeFilter,
    });
    console.log(
      `[HealthConnect] Lidos ${weights.length} registos de Peso (Weight).`,
    );
    if (weights.length > 0) {
      const lastWeight = weights[weights.length - 1];
      const weightVal = (lastWeight as any).weight?.inKilograms || null;
      if (weightVal !== null) {
        records.push({
          id_senior: userId,
          metric_type: 'WEIGHT',
          value_primary: weightVal,
          value_secondary: null,
          measured_at:
            lastWeight.metadata?.lastModifiedTime || new Date().toISOString(),
          source: 'health_connect',
        });
      }
    }
  } catch (error) {
    console.error('Erro ao ler registos reais do Health Connect:', error);
  }

  return records;
}

/**
 * Função principal para sincronizar os dados de saúde com o Supabase.
 * Pode ser chamada no arranque da aplicação.
 */
export async function syncHealthData(userId: number): Promise<void> {
  try {
    // Verificar se a sincronização está ativa no AsyncStorage
    const storedSync = await AsyncStorage.getItem('@health_sync_enabled');
    const isEnabled = storedSync === null || storedSync === 'true'; // Ativo por defeito

    if (!isEnabled) {
      console.log('Sincronização de saúde desativada pelo utilizador.');
      return;
    }

    let recordsToSave: MonitoringRecord[] = [];
    let isSdkInitialized = false;

    try {
      // Tentar inicializar o SDK nativo
      isSdkInitialized = await initialize();
    } catch (err) {
      console.log(
        'SDK Health Connect indisponível ou não compilado. A usar bypass de testes.',
      );
    }

    if (isSdkInitialized) {
      // Se inicializado, validar se temos pelo menos uma permissão de leitura
      const granted = await getGrantedPermissions();
      const hasPermissions = granted.length > 0;

      if (hasPermissions) {
        console.log('A ler dados reais do Health Connect...');
        recordsToSave = await readRealHealthData(userId);
      } else {
        console.log(
          'Permissões de saúde não concedidas. A solicitar permissões nativas...',
        );
        try {
          const permissionsToRequest = [
            { accessType: 'read' as const, recordType: 'HeartRate' },
            { accessType: 'read' as const, recordType: 'BloodPressure' },
            { accessType: 'read' as const, recordType: 'BodyTemperature' },
            { accessType: 'read' as const, recordType: 'BloodGlucose' },
            { accessType: 'read' as const, recordType: 'OxygenSaturation' },
            { accessType: 'read' as const, recordType: 'Weight' },
          ];
          const newlyGranted = await requestPermission(
            permissionsToRequest as any,
          );
          if (newlyGranted.length > 0) {
            console.log('Permissões concedidas. A ler dados reais...');
            recordsToSave = await readRealHealthData(userId);
          } else {
            console.log('Permissões não concedidas pelo utilizador.');
          }
        } catch (requestErr) {
          console.error('Erro ao solicitar permissões nativas:', requestErr);
        }
      }
    } else {
      // Bypass ativo (dados simulados para testes rápidos)
      console.log('A gerar dados simulados (Bypass ativo)...');
      //recordsToSave = generateMockHealthData(userId);
    }

    // Se temos registos para gravar, enviar para o Supabase
    if (recordsToSave.length > 0) {
      // 1. Obter o timestamp da última leitura no Supabase para este id_senior
      const { data: lastRecord, error: fetchError } = await supabase
        .from('monitoring')
        .select('measured_at')
        .eq('id_senior', userId)
        .order('measured_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error('Erro ao buscar última leitura do Supabase:', fetchError);
      }

      const lastSyncTime = lastRecord?.measured_at
        ? new Date(lastRecord.measured_at).getTime()
        : 0;

      // 2. Filtrar registos: manter apenas os que são mais recentes do que o último sync
      const newRecords = recordsToSave.filter((r) => {
        const recordTime = new Date(r.measured_at).getTime();
        return recordTime > lastSyncTime;
      });

      if (newRecords.length > 0) {
        const { error } = await supabase.from('monitoring').insert(newRecords);
        if (error) {
          console.error('Erro ao enviar métricas para o Supabase:', error);
        } else {
          console.log(
            `Sincronização de saúde concluída: ${newRecords.length} novas métricas enviadas.`,
          );
        }
      } else {
        console.log('Sem novas métricas para sincronizar (tudo atualizado).');
      }
    }
  } catch (error) {
    console.error('Erro geral no processo de sincronização de saúde:', error);
  }
}
