Markdown

# 📝 Briefing de Projeto Front-End: Plataforma Interativa "Teachy"

**Olá!**

Este documento detalha os requisitos para a construção da interface do usuário (UI) da nossa plataforma "Teachy". O objetivo é criar uma experiência de usuário completa e funcional, simulando a comunicação em tempo real sem a necessidade de um backend funcional por enquanto.

---

## 🎯 Objetivo Principal

Construir a experiência front-end completa para uma plataforma de perguntas interativas em tempo real. A aplicação terá duas personas principais: o **Professor**, que cria e gerencia as perguntas, e o **Aluno**, que participa e responde.

O foco total é na **qualidade da interface, fluidez da experiência do usuário e na simulação convincente das interações em tempo real.**

---

## 🌊 Fluxos de Usuário Essenciais

Você deve implementar os dois fluxos a seguir:

**1. Fluxo do Professor:**
* **Dashboard (`/` ou `/dashboard`):** O professor vê uma lista de suas "Apresentações" (conjuntos de perguntas) existentes e um botão para "Criar Nova Apresentação".
* **Editor de Apresentação (`/presentation/edit/:id`):** Uma tela onde o professor pode dar um título à sua apresentação e adicionar/editar/remover perguntas.
* **Início da Sessão ao Vivo:** A partir do dashboard, o professor pode "Iniciar Sessão" em uma apresentação. Isso o leva para a tela de apresentação ao vivo e gera um código de sala único (ex: `XYZ123`).
* **Tela de Apresentação ao Vivo (`/live/:roomCode`):**
    * Mostra o código da sala de forma proeminente para os alunos entrarem.
    * Exibe a pergunta atual em tela cheia.
    * Mostra os resultados (gráficos, nuvem de palavras, etc.) sendo atualizados em tempo real à medida que as "respostas chegam".
    * Possui controles para navegar para a pergunta anterior/seguinte.

**2. Fluxo do Aluno:**
* **Tela de Entrada (`/join`):** Uma tela simples com um único campo para inserir o código da sala.
* **Sala de Espera/Tela de Resposta (`/room/:roomCode`):**
    * Após entrar, o aluno vê a pergunta que o professor está exibindo no momento.
    * Ele interage com a UI para submeter sua resposta.
    * Após responder, ele vê uma tela de confirmação/espera pela próxima pergunta.

---

## 🛠️ Requisitos Técnicos

* **Framework:** **Next.js** (com App Router).
* **Linguagem:** **TypeScript**.
* **Estilização:** **Tailwind CSS**. Recomendo usar **shadcn/ui** para acelerar a construção de componentes de UI de alta qualidade (modais, botões, inputs, etc.).
* **Gerenciamento de Estado:** **Zustand** (preferencial) ou **Redux Toolkit**. A escolha é sua, mas o estado global será crucial para a simulação real-time.

---

## 💡 Estratégia Crucial: Como Trabalhar Sem Backend

Para desenvolver a aplicação de forma independente, vamos simular toda a comunicação com o backend no lado do cliente.

**1. Mock de Dados (Simulando o Banco de Dados):**
* Crie uma pasta `/src/mock-data` ou similar.
* Dentro dela, crie um arquivo (ex: `db.ts`) que exporta arrays de objetos simulando os dados que viriam do banco. Por exemplo:

```typescript
// /src/mock-data/db.ts
export const mockPresentations = [
  {
    id: 'pres-1',
    title: 'Quiz de Conhecimentos Gerais',
    questions: [
      { id: 'q-1', type: 'MULTIPLE_CHOICE', content: { /*...*/ } },
      { id: 'q-2', type: 'WORD_CLOUD', content: { /*...*/ } },
    ]
  },
  // ...outras apresentações
];
2. Mock da API (Simulando as Chamadas HTTP):

Crie uma camada de serviço (ex: /src/services/api.ts).

As funções neste arquivo irão imitar chamadas de API, mas em vez de usar fetch, elas lerão os dados do seu arquivo de mock. Use setTimeout para simular a latência da rede.

TypeScript

// /src/services/api.ts
import { mockPresentations } from '../mock-data/db';

export const getPresentationById = async (id: string) => {
  console.log(`[API MOCK] Buscando apresentação com id: ${id}`);
  return new Promise(resolve => {
    setTimeout(() => {
      const presentation = mockPresentations.find(p => p.id === id);
      resolve(presentation);
    }, 500); // Simula 500ms de latência
  });
};
3. Simulação dos Eventos Real-Time (A Parte Mais Importante):

Usaremos o seu gerenciador de estado global (Zustand/Redux) para simular o WebSocket.

Fluxo de Simulação:

Crie um store global que contenha o estado da sala ao vivo, incluindo a pergunta atual e a lista de respostas.

Quando a UI do Aluno submete uma resposta, em vez de chamar uma API, ela irá disparar uma ação no store global para adicionar a nova resposta.

A UI do Professor (o componente que mostra os resultados) estará "ouvindo" as mudanças nesse store.

Quando o store for atualizado com a nova resposta, o componente do professor irá re-renderizar automaticamente, criando o efeito de "tempo real".

🧩 Tipos de Pergunta a Implementar (Mínimo de 3)
Implemente pelo menos três dos seguintes tipos, com seus respectivos formulários para o aluno e visualizações de resultado para o professor:

Múltipla Escolha:

Aluno: Vê botões com as opções.

Professor: Vê um gráfico de barras com a contagem de votos para cada opção.

Estrutura de Dados: { "title": "Qual seu framework?", "options": ["React", "Vue", "Angular"] }

Nuvem de Palavras (Word Cloud):

Aluno: Vê um campo de texto para digitar uma ou mais palavras.

Professor: Vê uma nuvem de palavras se formando com as respostas, onde as palavras mais enviadas aparecem maiores.

Estrutura de Dados: { "title": "Descreva o evento em uma palavra." }

Ranking:

Aluno: Vê uma lista de itens que ele pode arrastar e soltar para ordenar por preferência.

Professor: Vê os resultados consolidados, mostrando a pontuação média de ranking para cada item.

Estrutura de Dados: { "title": "Ordene estas tecnologias por preferência.", "items": ["Next.js", "Prisma", "Tailwind"] }