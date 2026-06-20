# Geras - Front-End
<img src="https://github.com/user-attachments/assets/ce068f7b-a61c-43aa-99f0-d52e1d053c39" height="100">

## Sobre o Projeto

O Geras é um ecossistema digital desenvolvido em [**React Native** (Expo)](https://docs.expo.dev/), desenhado para devolver a autonomia aos seniores e garantir a tranquilidade das suas famílias. A missão é combater o isolamento e promover a segurança através de uma comunidade unida e tecnologia acessível.

Este projeto foi desenvolvido no âmbito do **Mestrado em Comunicação e Tecnologias Web (MCTW)**, seguindo a metodologia **CBL (Challenge Based Learning)** com a pareceria da **Altice Labs**. O desenvolvimento desta aplicação serviu como ponto de convergência para aplicar os conhecimentos adquiridos em todas as disciplinas do mestrado, resultando numa solução prática e integrada.

> [!NOTE]
> A infraestrutura e código fonte deste projeto estão divididos em dois repositórios:
> - **Frontend (App Mobile)**: Este repositório atual.
> - **Backend (Supabase & Base de Dados)**: Disponível em [Geras-CBL/Geras-Supabase](https://github.com/Geras-CBL/Geras-Supabase).

## Vídeo Promocional (MVP)

Disponível [aqui](https://www.youtube.com/watch?v=1fBb_aUl9JE).

---

### Funcionalidades Principais

* **Casa Inteligente e Segura:** Integração com sensores (IoT) para monitorização de rotinas (toma de medicação, gestão de despensa) e deteção de quedas.
* **Pedidos de Ajuda:** Interface simplificada para seniores solicitarem apoio (compras, companhia) a voluntários verificados.
* **Gestão para Cuidadores:** Monitorização de saúde e alertas de segurança em tempo real para familiares.
* **Voluntariado:** Sistema de recompensas (vouchers) para quem presta auxílio, fomentando a economia local.

---

## Estrutura do Projeto

A aplicação encontra-se organizada dentro da pasta `geras`. A estrutura de ficheiros segue uma lógica modular, adaptada agora a uma arquitetura dinâmica com ligação ao backend, para facilitar a manutenção e escalabilidade:

* **app/**: Contém a lógica de navegação e as páginas principais da aplicação (Expo Router).
* **assets/**: Armazena recursos estáticos como imagens, ícones e tipos de letra.
* **components/**: Componentes de interface (UI) reutilizáveis, organizados por perfil e partilhados (ex: botões, cartões, cabeçalhos).
* **constants/**: Ficheiros de configuração global, como paletas de cores e definições de layout.
* **context/**: Gestão de estado global da aplicação (ex: `AuthContext` para sessões, `ProfileContext` para perfis, `NotificationsContext`).
* **lib/**: Inicialização e configuração base de bibliotecas externas, como o cliente principal do Supabase.
* **services/**: Serviços que agrupam a comunicação com a API, chamadas à base de dados, e processamento de serviços externos (ex: saúde, localização).
* **types/**: Definições de tipagem e interfaces TypeScript para garantir coerência de dados em toda a aplicação.

---

## Como Correr o Projeto Localmente

Esta aplicação é construída com [Expo](https://expo.dev/) e suporta iOS e Android. Para correr a aplicação no seu ambiente local, siga as instruções abaixo:

### Pré-requisitos

1. **Node.js**: Certifique-se de que tem o Node.js instalado (recomendada a versão 18 ou superior).
2. **Ambiente Expo**: Instale a app **Expo Go** no seu dispositivo móvel (iOS ou Android) ou configure um emulador/simulador no seu computador (Android Studio ou Xcode).

### Instalação e Execução

1. Clone o repositório para a sua máquina local:
   ```bash
   git clone <url-do-repositorio>
   ```

2. Aceda à pasta principal da aplicação (passo fundamental, pois a raiz contém outras pastas):
   ```bash
   cd geras
   ```

3. Instale as dependências do projeto:
   ```bash
   npm install
   ```

4. **Configuração de Variáveis de Ambiente**:
   Crie um ficheiro `.env` na raiz da pasta `geras` e adicione as seguintes variáveis com as credenciais do seu projeto Supabase (local ou remoto):
   ```env
   EXPO_PUBLIC_SUPABASE_URL=a_sua_url_do_supabase
   EXPO_PUBLIC_SUPABASE_ANON_KEY=a_sua_anon_key_do_supabase
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run start
   ```

No terminal, será gerado um QR Code e apresentadas várias opções:
* Pressione `a` para abrir no emulador Android.
* Pressione `i` para abrir no simulador iOS (apenas macOS).
* Digitalize o código QR com a aplicação **Expo Go** (no Android) ou com a câmara do telemóvel (no iOS) para correr diretamente no seu dispositivo físico.

---

## Tecnologias Utilizadas

* **Framework:** React Native (via Expo)
* **Linguagem:** JavaScript / TypeScript
* **Routing:** Expo Router (File-based routing)
* **Estilo:** NativeWind (Tailwind CSS para React Native)
* **Backend as a Service:** Supabase (Autenticação, Base de Dados, Edge Functions)

---

> *"Se antecipamos um mundo digital, não podemos deixar ninguém para trás."*
