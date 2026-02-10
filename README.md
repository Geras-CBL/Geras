# Geras 
<img src="https://github.com/user-attachments/assets/ce068f7b-a61c-43aa-99f0-d52e1d053c39" height="100">

## Sobre o Projeto

O Geras é um ecossistema digital desenvolvido em [**React Native** (Expo)](https://docs.expo.dev/), desenhado para devolver a autonomia aos seniores e garantir a tranquilidade das suas famílias. A missão é combater o isolamento e promover a segurança através de uma comunidade unida e tecnologia acessível.

Este projeto foi desenvolvido no âmbito do **Mestrado em Comunicação e Tecnologias Web (MCTW)**, seguindo a metodologia **CBL (Challenge Based Learning)** com a pareceria da **Altice Labs**. O desenvolvimento desta aplicação serviu como ponto de convergência para aplicar os conhecimentos adquiridos em todas as disciplinas do mestrado, resultando numa solução prática e integrada.

## Nota Final

18 valores

## Vídeo Promocional

Disponível [aqui](https://www.youtube.com/watch?v=1fBb_aUl9JE).

---

### Funcionalidades Principais

* **Casa Inteligente e Segura:** Integração com sensores (IoT) para monitorização de rotinas (toma de medicação, gestão de despensa) e deteção de quedas.
* **Pedidos de Ajuda:** Interface simplificada para seniores solicitarem apoio (compras, companhia) a voluntários verificados.
* **Gestão para Cuidadores:** Monitorização de saúde e alertas de segurança em tempo real para familiares.
* **Voluntariado:** Sistema de recompensas (vouchers) para quem presta auxílio, fomentando a economia local.

---

## Estrutura do Projeto

A aplicação encontra-se organizada dentro da pasta `geras`. A estrutura de ficheiros segue uma lógica modular para facilitar a manutenção e escalabilidade:

* **app/**: Contém a lógica de navegação e as páginas principais da aplicação. O projeto utiliza *file-based routing* (rotas baseadas em ficheiros) do Expo Router.
* **assets/**: Armazena recursos estáticos como imagens, ícones e tipos de letra.
* **components/**: Componentes de UI reutilizáveis em toda a aplicação (ex: botões personalizados, cartões de pedidos, cabeçalhos).
* **constants/**: Ficheiros de configuração global, como paletas de cores, definições de layout e strings constantes.
* **context/**: Gestão de estado global da aplicação (ex: `ProfileContext` para gerir o tipo de utilizador - Sénior, Cuidador ou Voluntário).
* **data/**: Dados estáticos ou *mock data* utilizados para preencher a aplicação durante o desenvolvimento e testes.
* **scripts/**: Scripts utilitários para automação ou configuração do ambiente de desenvolvimento.

---

## Como Correr o Projeto

Esta aplicação é construída com Expo e suporta iOS e Android.

### Pré-requisitos

Certifique-se de que tem o Node.js instalado.

### Instalação

1. Clone o repositório.
2. Aceda à pasta do projeto (passo fundamental, pois a raiz do repositório contém outras pastas):

```bash
cd geras

```

3. Instale as dependências:

```bash
npm install

```

4. Inicie a aplicação:

```bash
npx expo start

```

No terminal, serão apresentadas opções para abrir a aplicação:

* Pressionando `a` para o emulador Android.
* Pressionando `i` para o simulador iOS.
* Digitalizando o código QR com a app **Expo Go** no seu telemóvel físico.

### Builds e Distribuição

As builds de desenvolvimento e produção, bem como o estado atual do projeto na cloud, podem ser consultados no painel do Expo (requer permissão de acesso):

[Ver Projeto no Expo.dev](https://expo.dev/accounts/geras-cbl/projects/geras)

---

## Tecnologias

* **Framework:** React Native (via Expo)
* **Linguagem:** JavaScript / TypeScript
* **Routing:** Expo Router
* **Estilo:** StyleSheet (React Native)

---

> *"Se antecipamos um mundo digital, não podemos deixar ninguém para trás."*
