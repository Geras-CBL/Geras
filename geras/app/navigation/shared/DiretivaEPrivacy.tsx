import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/shared/Header';
import { ThemedText } from '@/components/ThemedText';

export default function DiretivaEPrivacy() {
  const router = useRouter();
  const { from } = useLocalSearchParams();
  const isFromRegister = from === 'register';

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      {isFromRegister ? (
        <SafeAreaView edges={['top']}>
          <TouchableOpacity
            className="p-6 pb-0"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
        </SafeAreaView>
      ) : (
        <Header
          leftIconName="arrow-back"
          onLeftPress={() => router.back()}
          showLeftIcon={true}
          showProfileOnRight={false}
          showNotificationsOnLeft={false}
          showRightIcon={false}
        />
      )}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-20 gap-4"
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" className="mb-4 mt-4 text-primary">
          Diretiva ePrivacy
        </ThemedText>

        <ThemedText type="body">
          Documento complementar à Política de Privacidade, dedicado
          especificamente aos identificadores eletrónicos, SDKs e tecnologias de
          rastreio utilizados na aplicação móvel e no website Geras, em
          cumprimento da Diretiva 2002/58/CE (Diretiva ePrivacy), alterada pela
          Diretiva 2009/136/CE, e da Lei n.º 58/2019, de 8 de agosto.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          1. O que é esta política e porque existe
        </ThemedText>
        <ThemedText type="body">
          Quando falamos de &quot;cookies&quot;, a maioria das pessoas pensa
          logo num site na internet. Mas a Geras é também uma aplicação móvel, e
          por isso esta política explica de forma simples que tipo de
          identificadores e tecnologias semelhantes a cookies usamos no
          telemóvel, e como pode escolher o que aceita.{'\n\n'}
          Aplicamos sempre a mesma regra: só usamos o que é estritamente
          necessário para a app funcionar, e tudo o resto pede sempre a sua
          autorização primeiro.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          2. O que conta como &quot;cookie&quot; numa aplicação móvel?
        </ThemedText>
        <ThemedText type="body">
          No nosso site informativo, usamos cookies tradicionais de navegador.
          Na aplicação móvel, o equivalente chama-se identificadores e
          tecnologias de rastreio do dispositivo, e podem incluir:{'\n\n'}•
          Identificadores de publicidade do telemóvel (no iPhone chama-se IDFA,
          no Android chama-se GAID);{'\n'}• Um número único atribuído pelas
          ferramentas que usamos para perceber se a app teve algum erro técnico;
          {'\n'}• Informação sobre falhas técnicas (crash reports), para
          sabermos quando algo corre mal;{'\n'}• O código que permite o
          telemóvel receber notificações (por exemplo, um lembrete de
          medicação);{'\n'}• Dados sobre como navega dentro da app (que ecrãs
          visita, por exemplo), só quando isso é usado para melhorar a
          aplicação.{'\n\n'}
          Todos estes identificadores são tratados com o mesmo cuidado e as
          mesmas regras de consentimento que se aplicam aos cookies de um site.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          3. As ferramentas que usamos (e porquê)
        </ThemedText>
        <ThemedText type="body">
          Para a Geras funcionar bem e em segurança, recorremos a um número
          reduzido de ferramentas externas, escolhidas com critério. Nenhuma
          delas foi adicionada &quot;porque sim&quot; — cada uma tem uma função
          concreta:
          {'\n\n'}
          Ferramenta: Async Storage{'\n'}
          Para que serve: Guarda a sua sessão no telemóvel, para não ter de
          fazer login todas as vezes.{'\n'}
          Precisa da sua autorização? Não — é indispensável para usar a app.
          {'\n\n'}
          Ferramenta: Supabase Auth{'\n'}
          Para que serve: Garante que o seu login é seguro e que só você acede
          aos seus próprios dados de saúde.{'\n'}
          Precisa da sua autorização? Não — é indispensável para usar a app.
          {'\n\n'}
          Ferramenta: Expo Notifications{'\n'}
          Para que serve: Envia-lhe alertas importantes, como lembretes de
          medicação ou pedidos de ajuda urgentes.{'\n'}
          Precisa da sua autorização? Não — é indispensável para a sua
          segurança.{'\n\n'}
          Ferramenta: Firebase Analytics{'\n'}
          Para que serve: Ajuda-nos a perceber se a app está a funcionar bem e
          onde existem erros técnicos.{'\n'}
          Precisa da sua autorização? Sim — só é ativado se autorizar.{'\n\n'}
          No caso do Firebase Analytics, sempre que ele é usado, configurámo-lo
          para não recolher o seu identificador de publicidade e para esconder o
          seu endereço de IP exato (anonimização). Ou seja, mesmo quando
          autorizado, não é usado para lhe mostrar anúncios nem para o
          identificar pessoalmente.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          4. Como funciona o seu consentimento
        </ThemedText>
        <ThemedText type="body">
          Na primeira vez que abre a aplicação, ou quando visita o nosso
          website, vai aparecer um aviso simples a perguntar se aceita ou não as
          ferramentas que não são estritamente necessárias.{'\n\n'}• Nada vem
          pré-selecionado. Tem sempre de clicar de forma ativa para aceitar.
          {'\n'}• Pode recusar sem perder funcionalidades essenciais. Recusar
          não impede o uso da app — apenas desliga as ferramentas estatísticas.
          {'\n'}• Pode mudar de ideias quando quiser, indo a Perfil → Definições
          de Acessibilidade → Privacidade e Cookies (na app) ou ao ícone de
          cookies no rodapé do website.{'\n'}• Guardamos um registo da sua
          escolha, com a data e a versão dos termos que aceitou, para garantir
          transparência caso precise de confirmar o que autorizou.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          5. O que NÃO fazemos
        </ThemedText>
        <ThemedText type="body">
          Para sua tranquilidade, deixamos claro o que a Geras nunca faz com
          estes identificadores:{'\n\n'}• Não vendemos nem partilhamos os seus
          dados de navegação com empresas de publicidade;{'\n'}• Não criamos
          perfis publicitários nem lhe mostramos anúncios direcionados;{'\n'}•
          Não recolhemos o identificador de publicidade do seu telemóvel
          (IDFA/GAID);{'\n'}• Não ativamos nenhuma ferramenta estatística sem a
          sua autorização prévia e explícita.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          6. Os seus direitos
        </ThemedText>
        <ThemedText type="body">
          Em qualquer altura, pode:{'\n\n'}• Saber exatamente que ferramentas
          estão ativas na sua conta;{'\n'}• Retirar o seu consentimento às
          ferramentas opcionais, sem qualquer penalização;{'\n'}• Pedir mais
          informação sobre como tratamos estes dados técnicos.
        </ThemedText>

        <ThemedText type="bodyBold" className="mt-4">
          7. Dúvidas ou pedidos
        </ThemedText>
        <ThemedText type="body">
          Se tiver alguma questão sobre esta política ou quiser exercer algum
          dos seus direitos, contacte-nos:{'\n\n'}
          E-mail: gerasapp25@gmail.com{'\n'}
          Telefone: 911 199 644{'\n'}
          Tempo de resposta: entre 5 a 6 dias úteis{'\n\n'}
          Pode também apresentar reclamação junto da Comissão Nacional de
          Proteção de Dados (CNPD), em www.cnpd.pt.{'\n\n'}
          Última atualização: 19 de junho de 2026.
        </ThemedText>
      </ScrollView>
    </View>
  );
}
