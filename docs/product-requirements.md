## Documento de Requisitos do Produto (PRD): Gestor Financeiro Pessoal

**1. Introdução**

- **Produto:** Uma aplicação web moderna para gerenciamento de finanças pessoais.
- **Objetivo:** Capacitar usuários a registrar e monitorar suas receitas, despesas e contas parceladas de forma simples e eficaz, oferecendo um painel de controle (dashboard) com uma visão clara da saúde financeira mensal.
- **Visão:** Ser uma ferramenta intuitiva e acessível para que qualquer pessoa possa ter controle sobre suas finanças pessoais.

**2. Público-Alvo**

- Indivíduos que buscam uma solução digital para organizar suas finanças.
- Usuários que desejam acompanhar seus gastos, receitas e parcelamentos de forma centralizada.
- Pessoas que valorizam uma interface limpa, moderna e de fácil utilização.

**3. Metas**

- Fornecer um sistema seguro e confiável para registro de dados financeiros.
- Oferecer uma visão clara e consolidada das finanças mensais através de um dashboard interativo.
- Simplificar o acompanhamento de pagamentos parcelados.
- Permitir fácil adição, visualização e edição de transações financeiras.

**4. Requisitos Funcionais (Features)**

- **4.1. Autenticação de Usuário:**
  - Cadastro de novos usuários (nome, email, senha).
  - Login seguro para usuários existentes.
  - (Opcional) Funcionalidade de recuperação de senha.
- **4.2. Gerenciamento de Receitas:**
  - Registrar novas receitas (descrição, valor, data, categoria - ex: Salário, Freelance, Venda).
  - Listar todas as receitas, com filtros por período (mês/ano).
  - Editar ou excluir registros de receitas existentes.
- **4.3. Gerenciamento de Despesas:**
  - Registrar novas despesas (descrição, valor, data, categoria - ex: Alimentação, Transporte, Moradia, Lazer).
  - Listar todas as despesas, com filtros por período (mês/ano) e categoria.
  - Editar ou excluir registros de despesas existentes.
- **4.4. Gerenciamento de Parcelamentos:**
  - Registrar novas contas parceladas (descrição, valor total, número de parcelas, data de início, categoria).
  - O sistema deve calcular o valor da parcela mensal.
  - Listar todos os parcelamentos ativos e concluídos.
  - Permitir marcar parcelas individuais como pagas.
  - (Opcional) Integrar automaticamente o valor da parcela mensal às despesas do mês correspondente.
- **4.5. Dashboard Mensal:**
  - Exibição do resumo financeiro do mês atual (ou selecionado):
    - Total de Receitas.
    - Total de Despesas.
    - Saldo (Receitas - Despesas).
  - Visualizações Gráficas:
    - Gráfico de pizza mostrando a distribuição de despesas por categoria.
    - Gráfico de barras ou linhas comparando receitas e despesas ao longo do mês/últimos meses.
  - Visão rápida das próximas parcelas a vencer.
- **4.6. Categorias:**
  - Permitir ao usuário criar, editar e excluir categorias personalizadas para receitas e despesas.
  - Fornecer um conjunto de categorias padrão iniciais.

**5. Requisitos Técnicos**

- **Frontend:**
  - Framework: Next.js 15 (utilizando App Router)
  - Linguagem: TypeScript
  - Estilização: Tailwind CSS 4
  - Componentes UI: Shadcn/UI
- **Backend:**
  - API Routes do Next.js.
- **Banco de Dados:**
  - MongoDB
  - ODM (Object Document Mapper): Mongoose.
- **Autenticação:** Implementação com NextAuth.js.

**6. Design e Experiência do Usuário (UX)**

- Interface limpa, intuitiva e responsiva (adaptável a desktops e dispositivos móveis).
- Fluxos de usuário otimizados para adição rápida de transações.
- Feedback visual claro para ações do usuário (sucesso, erro, carregamento).
- Consistência visual garantida pelo uso de Tailwind CSS e Shadcn/UI.

**7. Modelo de Dados (Sugestão MongoDB)**

- **Coleção `users`:**
  - `_id`: ObjectId
  - `name`: String
  - `email`: String (unique)
  - `passwordHash`: String
  - `createdAt`: Date
  - `updatedAt`: Date
- **Coleção `transactions`:** (Unificando Receitas e Despesas)
  - `_id`: ObjectId
  - `userId`: ObjectId (ref: 'users')
  - `type`: String ('income', 'expense')
  - `description`: String
  - `amount`: Number
  - `date`: Date
  - `category`: String
  - `installmentId`: ObjectId (ref: 'installments', opcional, apenas para despesas de parcelas)
  - `createdAt`: Date
  - `updatedAt`: Date
- **Coleção `installments`:**
  - `_id`: ObjectId
  - `userId`: ObjectId (ref: 'users')
  - `description`: String
  - `totalAmount`: Number
  - `numberOfInstallments`: Number
  - `installmentAmount`: Number
  - `startDate`: Date
  - `category`: String
  - `payments`: Array [ { `dueDate`: Date, `status`: String ('pending', 'paid'), `paidDate`: Date (opcional) } ]
  - `createdAt`: Date
  - `updatedAt`: Date

**8. Requisitos Não-Funcionais**

- **Segurança:** Hash de senhas, validação de entradas, proteção contra vulnerabilidades comuns (XSS, CSRF), autorização adequada (usuário só acessa seus próprios dados).
- **Desempenho:** Resposta rápida da interface, otimização de queries no banco de dados, carregamento eficiente do dashboard.
- **Escalabilidade:** Arquitetura que permita crescimento futuro (mais usuários, mais funcionalidades).
- **Manutenibilidade:** Código bem estruturado, comentado e seguindo boas práticas (TypeScript, ESLint, Prettier).

**9. Considerações Futuras (Roadmap Potencial)**

- Criação de orçamentos mensais por categoria.
- Definição e acompanhamento de metas financeiras.
- Relatórios financeiros avançados (anual, por período customizado).
- Importação de extratos bancários (CSV/OFX).
- Notificações/Lembretes de contas a pagar/receber.
- Suporte a múltiplas moedas.

**10. Questões Abertas**

- Qual provedor de hospedagem será utilizado (Vercel, Netlify, AWS, etc.)?
- Será utilizada alguma biblioteca específica para gráficos (Recharts, Chart.js)?
- Detalhes específicos da implementação de autenticação (NextAuth.js é uma boa opção com Next.js).
