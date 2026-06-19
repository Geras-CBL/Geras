import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';

import Header from '@/components/shared/Header';
import { ThemedText } from '@/components/ThemedText';

export default function TermosCondicoes() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <Header
        leftIconName="arrow-back"
        onLeftPress={() => router.back()}
        showLeftIcon={true}
        showProfileOnRight={false}
        showNotificationsOnLeft={false}
        showRightIcon={false}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-20 gap-4"
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" className="mb-4 mt-4 text-primary">
          Termos e Condições
        </ThemedText>

        <ThemedText type="body">
          Bem-vindo ao Geras!{'\n\n'}
          Este documento explica as regras de utilização da nossa plataforma. O
          nosso objetivo é garantir que todos — Seniores, Cuidadores e
          Voluntários — tenham uma experiência segura, clara e positiva.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          1. Identificação
        </ThemedText>
        <ThemedText type="body">
          Esta aplicação é gerida pela equipa Geras, sediada em Aveiro,
          Portugal.{'\n\n'}• Entidade Gestora: Geras App{'\n'}• Sede: Campus
          Universitário de Santiago, Universidade de Aveiro, 3810-193, Aveiro
          {'\n'}• Contacto: gerasapp25@gmail.com
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          2. Objeto e Serviços
        </ThemedText>
        <ThemedText type="body">
          O Geras ajuda os seniores a viverem com mais autonomia, ligando-os a
          sensores em casa, a familiares e a voluntários que podem ajudar em
          tarefas do dia-a-dia.{'\n\n'}O ecossistema Geras oferece as seguintes
          funcionalidades principais:{'\n\n'}
          Monitorização Inteligente (IoT): Ligação a sensores domésticos para
          detetar situações de risco, como quedas ou inatividade prolongada.
          {'\n'}
          Gestão de Saúde: Registo de medicação e acompanhamento de dados de
          bem-estar (como batimentos cardíacos e temperatura).{'\n'}
          Rede de Apoio: Sistema de pedidos de ajuda para compras, companhia ou
          tarefas domésticas.{'\n'}
          Alertas em Tempo Real: Notificações automáticas para cuidadores em
          caso de anomalias detetadas pelos sensores.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          3. Registo e Perfis
        </ThemedText>
        <ThemedText type="body">
          Existem três formas de usar o Geras. Cada uma tem regras específicas
          para garantir a segurança de todos.{'\n\n'}
          Perfil Sénior: Pessoas com 65 ou mais anos. Requisitos: Consentimento
          expresso para partilha de dados de saúde com o cuidador e de dados
          associados a pedidos com a restante comunidade.{'\n'}
          Perfil Cuidador: Familiares ou responsáveis indicados pelo sénior.
          Requisitos: Registo verificado e ligação autorizada ao perfil do
          sénior.{'\n'}
          Perfil Voluntário: Pessoas que querem ajudar a comunidade. Requisitos:
          Verificação de identidade via Chave Móvel Digital e apresentação de
          Registo Criminal.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          4. Condições de Compra e Serviço
        </ThemedText>
        <ThemedText type="body">
          O uso básico da aplicação é gratuito, mas podem existir serviços pagos
          ou subscrições para funcionalidades avançadas.{'\n\n'}• Subscrição:
          Detalhes sobre planos mensais (se aplicáveis) serão apresentados de
          forma clara antes de qualquer pagamento.{'\n'}• Vouchers: Os
          voluntários podem receber recompensas (vouchers) para usar no comércio
          local parceiro. Estes vouchers não podem ser trocados por dinheiro.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          5. Política de Utilização Aceitável
        </ThemedText>
        <ThemedText type="body">
          Queremos uma comunidade baseada no respeito. Não toleramos
          comportamentos agressivos ou uso indevido da plataforma.{'\n\n'}
          Como utilizador, compromete-se a:{'\n'}• Tratar todos os membros da
          rede com cortesia e respeito.{'\n'}• Não utilizar o sistema de pedidos
          de ajuda para fins ilegais ou abusivos.{'\n'}• Manter os seus dados de
          acesso (palavra-passe) em segurança.{'\n'}• Não partilhar informações
          de saúde de terceiros fora do ambiente da aplicação.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          6. Propriedade Intelectual
        </ThemedText>
        <ThemedText type="body">
          O nome "Geras", o logótipo e o código da aplicação pertencem à nossa
          equipa. Não podem ser copiados sem autorização.{'\n\n'}
          Todos os conteúdos, marcas, designs e tecnologias associados ao
          ecossistema Geras são propriedade exclusiva da entidade gestora ou dos
          seus licenciadores. O utilizador recebe apenas uma licença limitada
          para usar a aplicação conforme previsto nestes termos.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          7. Limitação de Responsabilidade
        </ThemedText>
        <ThemedText type="body">
          O Geras é uma ajuda tecnológica, mas não substitui médicos ou serviços
          de emergência (como o 112). Em caso de perigo de vida, contacte sempre
          as autoridades.{'\n\n'}• Intermediação: O Geras facilita a ligação
          entre pessoas, mas não é responsável pela conduta individual de
          voluntários ou cuidadores fora da plataforma.{'\n'}• Natureza Técnica:
          Embora utilizemos sensores e IA para prever riscos, não garantimos a
          deteção de 100% dos incidentes.{'\n'}• Dados de Saúde: As informações
          apresentadas na aplicação são indicativas e não devem ser usadas para
          diagnósticos médicos sem consulta profissional.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          8. Proteção de Dados (RGPD)
        </ThemedText>
        <ThemedText type="body">
          Respeitamos a sua privacidade. Recolhemos apenas o que é estritamente
          necessário para a sua segurança e nunca vendemos os seus dados.
          {'\n\n'}
          Para saber mais sobre como tratamos os seus dados, consulte a nossa
          Política de Privacidade. Garantimos o seu direito de acesso,
          retificação e eliminação dos dados a qualquer momento.{'\n\n'}
          Data da última atualização: 13 de maio de 2026.
        </ThemedText>
      </ScrollView>
    </View>
  );
}
