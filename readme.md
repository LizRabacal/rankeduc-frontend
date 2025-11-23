# 🎨 RankEduc.AI - Frontend (Interface de Apoio à Decisão)

Este repositório contém a interface de usuário do **RankEduc.AI**, um Sistema de Apoio à Decisão (SAD) focado na escolha de cursos e Instituições de Ensino Superior (IES).

O projeto é um **MVP** desenvolvido para a disciplina de Sistemas de Apoio à Decisão (SAD).

## 🚀 Stack de Desenvolvimento

* **Framework:** **Next.js** (React)
* **Estilização:** **Tailwind CSS** e **Heroui** (componentes UI)
* **Comunicação:** Faz requisições diretas para a API do `rankeduc-backend`.

## 💡 Funcionalidades

A interface é responsável por transformar dados brutos e modelos estatísticos em informações acionáveis para o usuário:

1.  **Busca Interativa:** Filtros por Estado, Município e Curso.
2.  **Visualização do Ranking:** Exibe o Top 15 de IES ranqueadas.
3.  **Cartões de Detalhe (`CardSpotlight`):** Apresenta o **Score de Qualidade** e as métricas de desempenho (IGC, IDD, Taxas de Conclusão/Evasão) de forma clara.

## 🔗 Como Usar (Localmente)

1.  Clone este repositório.
2.  Certifique-se de que o **Backend (FastAPI)** esteja rodando em `http://localhost:8000`.
3.  Instale as dependências: `npm install` (ou `yarn install`).
4.  Inicie o servidor de desenvolvimento: `npm run dev`.