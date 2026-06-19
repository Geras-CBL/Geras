import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';

import Header from '@/components/shared/Header';
import { ThemedText } from '@/components/ThemedText';

export default function PoliticaPrivacidade() {
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
          Política de Privacidade
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          1. Quem somos
        </ThemedText>
        <ThemedText type="body">
          O Geras é uma plataforma digital concebida para apoiar o
          acompanhamento e a assistência a adultos seniores em ambiente
          doméstico, recorrendo a tecnologias de monitorização e comunicação que
          promovem a segurança, autonomia e bem-estar dos seus utilizadores.
          {'\n\n'}A presente Política de Privacidade descreve como recolhemos,
          utilizamos, armazenamos e protegemos os dados pessoais dos
          utilizadores da plataforma, em conformidade com o Regulamento Geral
          sobre a Proteção de Dados (RGPD) e demais legislação aplicável.
          {'\n\n'}O responsável pelo tratamento dos dados pessoais recolhidos
          através da plataforma Geras é a Universidade de Aveiro, pessoa
          coletiva de direito público com o NIF 501 461 108, com sede no Campus
          Universitário de Santiago, 3810-193 Aveiro, Portugal.{'\n\n'}
          Para questões relacionadas com o tratamento de dados pessoais ou para
          o exercício dos direitos previstos na legislação aplicável, os
          utilizadores podem contactar a Universidade de Aveiro através dos
          canais institucionais disponibilizados para esse efeito.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          2. Que dados recolhemos
        </ThemedText>
        <ThemedText type="body">
          Para disponibilizar os serviços da plataforma, poderemos recolher e
          tratar as seguintes categorias de dados pessoais:{'\n\n'}
          Dados de identificação e contacto:{'\n'}• Nome;{'\n'}• Endereço de
          correio eletrónico (e-mail);{'\n'}• Data de nascimento;{'\n'}• Morada;
          {'\n'}• Código Postal;{'\n'}• Cidade;{'\n\n'}
          Dados de autenticação:{'\n'}
          Dados associados à autenticação através de serviços de terceiros,
          nomeadamente Google ou Facebook, quando utilizados pelo utilizador
          para iniciar sessão.{'\n\n'}
          Dados técnicos:{'\n'}
          Para garantir a segurança e o correto funcionamento da aplicação,
          poderão ser recolhidos determinados dados técnicos, incluindo:{'\n'}•
          Endereço IP;{'\n'}• Identificadores de dispositivo;{'\n'}• Registos de
          acesso e utilização da plataforma;{'\n'}• Informações técnicas
          relacionadas com o dispositivo e sistema operativo utilizado.{'\n\n'}
          Dados de saúde:{'\n'}
          Mediante consentimento explícito do titular dos dados ou do seu
          representante legal, quando aplicável, poderão ser recolhidos dados
          relativos à saúde, incluindo:{'\n'}• Batimentos cardíacos;{'\n'}•
          Temperatura corporal;{'\n'}• Pressão arterial;{'\n'}• Registos de
          medicação;{'\n'}• Outras métricas de saúde configuradas pelo
          utilizador.{'\n\n'}
          Os dados de saúde serão tratados exclusivamente para as finalidades de
          monitorização, assistência e promoção do bem-estar disponibilizadas
          pela plataforma.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          3. Finalidade do tratamento
        </ThemedText>
        <ThemedText type="body">
          Os dados pessoais recolhidos são utilizados para:{'\n'}• Criar e gerir
          contas de utilizador;{'\n'}• Permitir a utilização das funcionalidades
          disponibilizadas pela plataforma;{'\n'}• Monitorizar indicadores
          relacionados com o bem-estar e segurança dos seniores;{'\n'}• Gerar
          notificações e alertas destinados a cuidadores autorizados;{'\n'}•
          Assegurar a autenticação e controlo de acessos;{'\n'}• Garantir a
          segurança, manutenção e melhoria contínua da aplicação;{'\n'}•
          Responder a pedidos de suporte e assistência técnica;{'\n'}• Cumprir
          obrigações legais e regulamentares aplicáveis.{'\n\n'}O Geras não
          utiliza os dados pessoais dos utilizadores para fins de marketing
          direto nem procede à sua venda a terceiros.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          4. Base legal do tratamento
        </ThemedText>
        <ThemedText type="body">
          O tratamento dos dados pessoais realizado pelo Geras baseia-se nas
          seguintes bases legais:{'\n'}• Execução do contrato ou prestação do
          serviço solicitado pelo utilizador;{'\n'}• Consentimento explícito do
          titular dos dados, sempre que legalmente exigido;{'\n'}• Cumprimento
          de obrigações legais aplicáveis;{'\n'}• Interesse legítimo relacionado
          com a segurança, proteção e funcionamento adequado da plataforma.
          {'\n\n'}O tratamento de dados relativos à saúde baseia-se
          exclusivamente no consentimento explícito do titular dos dados ou do
          seu representante legal, nos termos previstos pelo RGPD.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          5. Partilha de dados
        </ThemedText>
        <ThemedText type="body">
          Os dados pessoais apenas são partilhados quando necessário para a
          prestação dos serviços disponibilizados pela plataforma ou quando tal
          seja exigido por lei.{'\n\n'}
          Os dados poderão ser partilhados com:{'\n'}• Cuidadores expressamente
          autorizados pelo sénior;{'\n'}• Prestadores de serviços tecnológicos
          necessários ao funcionamento da plataforma;{'\n'}• Autoridades
          administrativas, judiciais ou outras entidades competentes, quando
          legalmente exigido.{'\n\n'}O Geras utiliza a infraestrutura
          tecnológica do Supabase para alojamento de dados, autenticação e
          suporte ao funcionamento da aplicação.{'\n\n'}
          Os dados pessoais não são vendidos, cedidos para fins comerciais nem
          utilizados para publicidade direcionada.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          5.1 Integração com plataformas de saúde do dispositivo
        </ThemedText>
        <ThemedText type="body">
          A plataforma Geras integra as APIs Google Health Connect (Android) e
          Apple HealthKit (iOS) para acesso a dados de saúde armazenados no
          dispositivo do utilizador, mediante autorização expressa do mesmo.
          {'\n\n'}
          Os dados acedidos através destas integrações são utilizados
          exclusivamente para:{'\n'}• Monitorização do bem-estar e segurança do
          sénior{'\n'}• Geração de alertas e notificações para cuidadores
          autorizados{'\n'}• Prestação das funcionalidades de saúde
          disponibilizadas pela plataforma{'\n\n'}
          Em conformidade com as políticas da Apple e da Google, e com o RGPD,
          os dados obtidos via HealthKit ou Health Connect:{'\n'}• Não são
          utilizados para fins publicitários ou de marketing, sob qualquer forma
          {'\n'}• Não são vendidos a terceiros{'\n'}• Não são partilhados com
          terceiros para finalidades não diretamente relacionadas com a
          prestação do serviço Geras{'\n'}• Não são utilizados para criar perfis
          de utilizador para fins comerciais
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          5.2 SDKs e bibliotecas de terceiros
        </ThemedText>
        <ThemedText type="body">
          A aplicação móvel Geras integra um conjunto restrito de SDKs (Software
          Development Kits) de terceiros, selecionados de acordo com uma
          política rigorosa de auditoria que garante a conformidade com o RGPD e
          a minimização da recolha de dados.{'\n\n'}
          Princípios de auditoria de SDKs{'\n'}A seleção e integração de
          qualquer SDK obedece aos seguintes critérios fundamentais:{'\n'}•
          Necessidade: apenas são integrados SDKs que contribuam diretamente
          para as funcionalidades essenciais da plataforma (autenticação,
          notificações e monitorização de bem-estar).{'\n'}• Conformidade
          documentada: cada SDK deve possuir documentação pública comprovando a
          conformidade com o RGPD e o alinhamento com as diretrizes das
          plataformas móveis (App Store Review Guidelines da Apple e Google Play
          Console Policies).{'\n'}• Controlo de consentimento: a inicialização
          de SDKs além do limiar "Estritamente Necessário" é condicionada ao
          consentimento explícito e prévio do utilizador, obtido através de um
          ecrã de consentimento no primeiro lançamento da aplicação (Consent
          Management Platform — CMP mobile).{'\n'}• Minimização de dados
          analíticos: os SDKs de cariz estatístico são configurados em modo de
          privacidade (privacy mode), desativando a recolha de identificadores
          de publicidade (IDFA/AAID) e limitando a granularidade dos dados
          comportamentais.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          SDKs utilizados
        </ThemedText>
        <ThemedText type="body">
          • Async Storage: Armazenamento local no dispositivo dos tokens de
          sessão ativos. (Estritamente Necessário){'\n'}• Supabase Auth: Gestão
          de sessões seguras, autenticação de utilizadores e encriptação de
          dados. (Estritamente Necessário){'\n'}• Firebase Analytics:
          Monitorização de erros técnicos em tempo real (crash reports) e
          análise agregada dos ecrãs visualizados. (Desempenho / Estatística -
          Requer consentimento){'\n'}• Expo Notifications: Receção de alertas
          críticos de medicação e notificações de emergência na rede de
          cuidadores/voluntários. (Estritamente Necessário){'\n\n'}
          Nota: O Async Storage e o Supabase Auth encontram-se totalmente
          integrados e operacionais. O Firebase Analytics e o Expo Notifications
          constituem implementações planeadas para as próximas iterações do
          projeto.{'\n\n'}A integração com as APIs Health Connect da Google e
          HealthKit da Apple para registo e leitura de métricas de bem-estar não
          exige SDKs adicionais de terceiros na aplicação. A comunicação é
          realizada diretamente entre o Supabase e as APIs, mantendo o fluxo de
          informação clínica sob o controlo estrito das políticas de encriptação
          da plataforma.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          6. Transferências internacionais de dados
        </ThemedText>
        <ThemedText type="body">
          Os dados pessoais recolhidos através da plataforma Geras são
          armazenados em infraestruturas do Supabase localizadas em Paris,
          França, no Espaço Económico Europeu (EEE).{'\n\n'}O Geras adota
          medidas técnicas e organizativas adequadas para garantir a segurança,
          confidencialidade e integridade dos dados pessoais tratados através da
          plataforma.{'\n\n'}
          Caso, no futuro, seja necessário recorrer a prestadores de serviços
          que impliquem transferências de dados para países fora do EEE, essas
          transferências serão realizadas em conformidade com o RGPD e mediante
          a implementação das garantias legalmente exigidas.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          7. Conservação dos dados
        </ThemedText>
        <ThemedText type="body">
          Os dados pessoais serão conservados apenas durante o período
          necessário para as finalidades para as quais foram recolhidos.{'\n\n'}
          Regra geral:{'\n'}• Os dados da conta serão mantidos enquanto a conta
          permanecer ativa;{'\n'}• Os dados associados à utilização do serviço
          serão conservados durante o período necessário para a prestação do
          mesmo;{'\n'}• Após a eliminação da conta, os dados serão eliminados ou
          anonimizados, salvo quando exista obrigação legal que imponha a sua
          conservação por período superior.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          8. Direitos dos utilizadores
        </ThemedText>
        <ThemedText type="body">
          Nos termos do RGPD, os utilizadores dispõem dos seguintes direitos
          relativamente aos seus dados pessoais:{'\n'}• Direito de acesso aos
          seus dados;{'\n'}• Direito de retificação de dados incorretos ou
          incompletos;{'\n'}• Direito ao apagamento dos dados ("direito a ser
          esquecido");{'\n'}• Direito à limitação do tratamento;{'\n'}• Direito
          de oposição ao tratamento, nos casos legalmente previstos;{'\n'}•
          Direito à portabilidade dos dados;{'\n'}• Direito de retirar, a
          qualquer momento, os consentimentos concedidos;{'\n'}• Direito de
          apresentar reclamação junto da autoridade de controlo competente.
          {'\n\n'}O exercício destes direitos pode ser solicitado através dos
          contactos disponibilizados pela plataforma.{'\n\n'}A retirada do
          consentimento não compromete a licitude dos tratamentos efetuados
          antes dessa retirada.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          9. Segurança
        </ThemedText>
        <ThemedText type="body">
          O Geras adota medidas técnicas e organizativas adequadas para proteger
          os dados pessoais contra acesso não autorizado, perda, alteração,
          divulgação ou destruição.{'\n\n'}
          Entre estas medidas incluem-se:{'\n'}• Autenticação segura dos
          utilizadores;{'\n'}• Controlo de acessos baseado em permissões;{'\n'}•
          Proteção das comunicações através de protocolos seguros;{'\n'}•
          Monitorização e registo de acessos relevantes;{'\n'}• Adoção de boas
          práticas de segurança na infraestrutura tecnológica utilizada.{'\n\n'}
          Apesar dos esforços implementados, nenhum sistema de transmissão ou
          armazenamento eletrónico pode garantir segurança absoluta.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          10. Alterações à Política de Privacidade
        </ThemedText>
        <ThemedText type="body">
          A presente Política de Privacidade poderá ser atualizada
          periodicamente para refletir alterações legais, técnicas ou
          operacionais.{'\n\n'}
          Sempre que forem efetuadas alterações relevantes, os utilizadores
          serão informados através dos meios considerados adequados.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          11. Contactos
        </ThemedText>
        <ThemedText type="body">
          Para qualquer questão relacionada com esta Política de Privacidade ou
          com o tratamento dos seus dados pessoais, os utilizadores poderão
          contactar a equipa responsável através dos canais disponibilizados na
          plataforma.{'\n\n'}
          Contacto: gerasapp25@gmail.com{'\n\n'}
          Os utilizadores têm ainda o direito de apresentar reclamação junto da
          Comissão Nacional de Proteção de Dados (CNPD), através do respetivo
          website: https://www.cnpd.pt.{'\n\n'}
          Última atualização: 04/06/2026
        </ThemedText>
      </ScrollView>
    </View>
  );
}
