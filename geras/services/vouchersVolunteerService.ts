import { supabase } from '@/lib/supabase';
import {
  getDistanceInKm,
  getVoucherCoordinate,
  getUserCoordinate,
} from '@/services/locationHelperService';

export const syncVolunteerVouchers = async (volunteerId: number) => {
  try {
    // === LÓGICA DE ASSOCIAÇÃO BASEADA NA LOCALIZAÇÃO - Verificar se o voluntário já tem algum voucher associado
    const { data: existing, error: existError } = await supabase
      .from('vouchers_volunteer')
      .select('id_voucher')
      .eq('id_volunteer', volunteerId);

    if (existError) throw existError;

    if (!existing || existing.length === 0) {
      console.log(
        'Nenhum voucher associado. A iniciar associação por proximidade...',
      );

      // Obter o perfil do voluntário (para obter local/código postal se necessário)
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('local, zip_code')
        .eq('id', volunteerId)
        .single();

      if (!userError && user) {
        // Obter todos os vouchers disponíveis no sistema
        const { data: allVouchers, error: allVouchError } = await supabase
          .from('vouchers')
          .select('*');

        if (!allVouchError && allVouchers && allVouchers.length > 0) {
          // Resolver a coordenada do voluntário
          const volCoord = getUserCoordinate(volunteerId);

          // Mapear cada voucher e calcular a sua distância ao voluntário
          const mappedVouchers = allVouchers.map((v: any, index: number) => {
            const storeCoord = getVoucherCoordinate(undefined, v.id.toString());
            const dist = getDistanceInKm(
              volCoord.latitude,
              volCoord.longitude,
              storeCoord.latitude,
              storeCoord.longitude,
            );
            return { ...v, dist };
          });

          // Ordenar por proximidade (mais perto primeiro)
          mappedVouchers.sort((a: any, b: any) => a.dist - b.dist);

          // Escolher os 2 vouchers mais próximos
          const closestVouchers = mappedVouchers.slice(0, 2);
          console.log(
            `Vouchers mais próximos encontrados para associar:`,
            closestVouchers.map((v) => v.store_name),
          );

          // Inserir a associação na tabela vouchers_volunteer com status 'UNAVAILABLE' e 0 tarefas
          for (const v of closestVouchers) {
            const { error: insertError } = await supabase
              .from('vouchers_volunteer')
              .insert({
                id_volunteer: volunteerId,
                id_voucher: v.id,
                status: 'UNAVAILABLE',
                current_tasks: 0,
              });

            if (insertError) {
              console.error(
                `Erro ao associar voucher ${v.id} ao voluntário:`,
                insertError,
              );
            }
          }
        }
      }
    }
    // ===================================================

    // 2. Obter todos os pedidos concluídos por este voluntário
    const { data: requests, error: reqError } = await supabase
      .from('requests')
      .select('id, updated_at, evaluations(*)')
      .eq('id_volunteer', volunteerId)
      .eq('state', 'COMPLETED');

    if (reqError) throw reqError;

    // 3. Filtrar as tarefas verificadas com base nas regras de feedback e 4h de limite
    const now = new Date();
    const verifiedTasks = requests
      ? requests.filter((req: any) => {
          const evaluations = req.evaluations || [];

          // Se houver alguma avaliação DISSATISFIED (queixa negativa), não pontua
          const hasDissatisfied = evaluations.some(
            (ev: any) => ev.evaluation === 'DISSATISFIED',
          );
          if (hasDissatisfied) return false;

          // Se houver feedback positivo (SATISFIED) ou neutro (NEUTRAL), pontua imediatamente
          const hasPositiveFeedback = evaluations.some(
            (ev: any) =>
              ev.evaluation === 'SATISFIED' || ev.evaluation === 'NEUTRAL',
          );
          if (hasPositiveFeedback) return true;

          // Sem feedback: verifica se já passaram 4 horas desde a conclusão (updated_at)
          if (req.updated_at) {
            const completedAt = new Date(req.updated_at);
            const diffMs = now.getTime() - completedAt.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);
            return diffHours >= 4;
          }

          return false;
        })
      : [];

    let totalVerifiedTasks = verifiedTasks.length;

    // 4. Obter os vouchers atribuídos ao voluntário
    const { data: userVouchers, error: vouchError } = await supabase
      .from('vouchers_volunteer')
      .select('*, vouchers(id, needed_tasks)')
      .eq('id_volunteer', volunteerId);

    if (vouchError) throw vouchError;

    // Ordenar sequencialmente por id_voucher para garantir a ordem de acumulação
    const sortedVouchers = userVouchers
      ? [...userVouchers].sort((a: any, b: any) => a.id_voucher - b.id_voucher)
      : [];

    // 5. Distribuir os pontos sequencialmente
    for (const item of sortedVouchers) {
      const needed = item.vouchers?.needed_tasks || 5;

      if (item.status === 'USED') {
        // Se já foi usado, consome os respetivos pontos e passa ao próximo
        totalVerifiedTasks = Math.max(0, totalVerifiedTasks - needed);
      } else {
        // Se ainda não foi usado, acumula pontos até ao limite do voucher
        const current = Math.min(totalVerifiedTasks, needed);
        totalVerifiedTasks = Math.max(0, totalVerifiedTasks - needed);

        const newStatus = current >= needed ? 'AVAILABLE' : 'UNAVAILABLE';

        // Atualizar a BD apenas se os valores tiverem mudado
        if (item.current_tasks !== current || item.status !== newStatus) {
          const { error: updateError } = await supabase
            .from('vouchers_volunteer')
            .update({
              current_tasks: current,
              status: newStatus,
            })
            .eq('id_volunteer', volunteerId)
            .eq('id_voucher', item.id_voucher);

          if (updateError) throw updateError;
        }
      }
    }
  } catch (err) {
    console.error('Erro na sincronização de vouchers do voluntário:', err);
  }
};
