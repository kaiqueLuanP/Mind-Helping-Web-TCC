# Arquitetura e Documentação do Projeto Mind Helping Web

## Índice
1. [Visão Geral](#visão-geral)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Componentes](#componentes)
5. [Hooks (Customizados)](#hooks-customizados)
6. [Services](#services)
7. [Utilitários](#utilitários)
8. [Fluxo de Dados](#fluxo-de-dados)
9. [Autenticação](#autenticação)
10. [APIs Integradas](#apis-integradas)

---

## Visão Geral

O **Mind Helping Web** é uma plataforma de dashboard para profissionais de saúde mental gerenciarem pacientes, agendamentos e acompanhamento emocional. A aplicação permite que psicólogos visualizem:
- Dados de sentimentos/humor dos pacientes
- Histórico de chamadas CVV (Centro de Valorização da Vida)
- Agendamentos e consultas
- Relatórios comportamentais

---

## Stack Tecnológico

### Frontend
- **React 18** - Biblioteca UI com hooks
- **TypeScript** - Tipagem estática
- **Vite** - Bundler e dev server
- **TanStack React Router** - Roteamento
- **Shadcn/ui** - Componentes estilizados
- **Tailwind CSS** - Estilização
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **Recharts** - Gráficos interativos

### Backend
- API em `https://mind-helping-api.fly.dev`
- Endpoints REST
- Autenticação via Bearer Token

---

## Estrutura de Pastas

```
src/
├── api/                          # Chamadas de API simples
│   ├── api.ts                   # Configuração base
│   └── createSchudele.ts        # API de agendamentos
│
├── components/                   # Componentes React reutilizáveis
│   ├── ui/                      # Componentes base (Card, Button, Input, etc)
│   ├── Layout.tsx               # Layout principal
│   ├── Navbar.tsx               # Barra de navegação
│   ├── Hero.tsx                 # Página inicial
│   ├── RegisterForm.tsx         # Formulário de registro
│   ├── login-form.tsx           # Formulário de login
│   └── [outros componentes]
│
├── contexts/                     # Contextos React
│   └── authContext.ts           # Contexto de autenticação
│
├── hooks/                        # Hooks customizados
│   ├── useAuth.ts               # Hook de autenticação
│   ├── useDadosDashboard.ts     # Hook de dados do dashboard
│   ├── useFeelingsData.ts       # Hook de dados de sentimentos
│   ├── useAppointmentConfirmation.ts
│   └── use-mobile.ts
│
├── lib/                          # Utilitários e configurações
│   ├── axios.ts                 # Instância Axios configurada
│   ├── utils.ts                 # Funções utilitárias
│   └── report-utils.ts          # Funções de cálculo de relatórios
│
├── services/                     # Serviços (lógica de negócio)
│   ├── feelingsService.ts       # Gerenciamento de sentimentos
│   ├── patientsService.ts       # Gerenciamento de pacientes
│   ├── professionalService.ts   # Gerenciamento de profissionais
│   └── scheduleService.ts       # Gerenciamento de agendamentos
│
├── routes/                       # Páginas e roteamento
│   ├── __root.tsx               # Layout raiz
│   ├── index.tsx                # Página inicial
│   ├── login.tsx                # Página de login
│   ├── register.tsx             # Página de registro
│   ├── app.tsx                  # Layout da app autenticada
│   └── _app/                    # Rotas protegidas
│       ├── principal.tsx        # Dashboard principal
│       ├── patients.tsx         # Gerenciamento de pacientes
│       ├── calendar.tsx         # Agendamentos/Calendário
│       ├── profile.tsx          # Perfil do profissional
│       ├── reports.tsx          # Relatórios do paciente
│       └── -components/         # Componentes de rotas específicas
│           └── reports/
│               ├── appointment-list.tsx      # Lista de chamadas CVV
│               ├── mood-donut-chart.tsx      # Gráfico de humor (30 dias)
│               ├── mood-variation-chart.tsx  # Gráfico de variação diária
│               └── [outros componentes]
│
└── assets/                       # Imagens e mídia

docs/
└── [Documentações]
```

---

## Componentes

### O que é um Componente?
Um **componente** é um bloco de código React que retorna JSX (HTML + lógica JavaScript). São reutilizáveis e podem receber props.

### Componentes Principais

#### **1. Layout.tsx**
```typescript
// Função: Wrapper da aplicação
// Renderiza: Navbar + Outlet (rotas filhas)
// Props: Nenhuma
// Responsabilidades:
//   - Exibir barra de navegação
//   - Verificar autenticação
//   - Renderizar conteúdo das rotas
```

#### **2. Navbar.tsx**
```typescript
// Função: Barra de navegação superior
// Renderiza: Links de navegação, logout, menu responsivo
// Props: Nenhuma
// Responsabilidades:
//   - Exibir menu de navegação
//   - Logout do usuário
//   - Links para diferentes seções
```

#### **3. RegisterForm.tsx**
```typescript
// Função: Formulário de cadastro de profissional
// Renderiza: Inputs de email, senha, CRP, etc
// Props: Nenhuma
// Responsabilidades:
//   - Validar dados do formulário
//   - Chamar API de registro
//   - Redirecionar após sucesso
// Dependências: React Hook Form, professionalService
```

#### **4. login-form.tsx**
```typescript
// Função: Formulário de login
// Renderiza: Inputs de email/senha, botão login
// Props: Nenhuma
// Responsabilidades:
//   - Validar credenciais
//   - Chamar API de autenticação
//   - Armazenar token no localStorage
//   - Redirecionar para dashboard
// Dependências: React Hook Form, useAuth hook
```

### Componentes de Relatórios (Reports)

#### **5. appointment-list.tsx** 🔄 (Recém Integrado)
```typescript
// Função: Exibir lista de chamadas CVV do paciente
// Renderiza: Card com lista de chamadas formatadas
// Props:
//   - userId: string (ID do paciente)
// Responsabilidades:
//   - Buscar chamadas CVV da API
//   - Formatar datas (dateCalled → formato pt-BR)
//   - Exibir duração das chamadas (timeCalled)
//   - Tratar erros de rede
// Dependências: api.ts, axios

// Fluxo:
// 1. Recebe userId como prop
// 2. useEffect dispara busca em /cvv-calls/{userId}
// 3. Transforma dateCalled em formato legível
// 4. Exibe 9 chamadas com datas e durações
// 5. Mostra loading/erro/vazio conforme necessário
```

#### **6. mood-donut-chart.tsx**
```typescript
// Função: Gráfico de distribuição de humor (últimos 30 dias)
// Renderiza: Gráfico de rosca (donut) com cores por sentimento
// Props:
//   - patientId: string | null
// Responsabilidades:
//   - Buscar sentimentos de 30 dias
//   - Agrupar e contar sentimentos
//   - Calcular percentuais
//   - Exibir gráfico Recharts
// Dependências: useFeelingsData, calculateDonutChartData

// Dados Exibidos:
// - Feliz: 45%
// - Triste: 25%
// - Raiva: 15%
// - Tédio: 10%
// - Não sei dizer: 5%
```

#### **7. mood-variation-chart.tsx**
```typescript
// Função: Gráfico de variação de sentimentos por dia
// Renderiza: Gráfico de barras horizontais
// Props:
//   - patientId: string | null
// Responsabilidades:
//   - Buscar sentimentos de um dia específico
//   - Calcular proporção de cada sentimento
//   - Exibir seletor de data
//   - Atualizar gráfico ao mudar data
// Dependências: useFeelingsData, calculateMoodAverages

// Exemplo do Dia 25/11/2025:
// - Feliz: 29%
// - Triste: 14%
// - Raiva: 14%
// - Ansioso: 14%
// - Tédio: 14%
// - Não sei dizer: 14%
```

---

## Hooks (Customizados)

### O que é um Hook?
Um **hook** é uma função React que permite usar estados e outros recursos React. Os **custom hooks** são funções que encapsulam lógica reutilizável.

### Hooks Implementados

#### **1. useAuth.ts**
```typescript
// Função: Gerenciar estado de autenticação
// Retorna: {
//   user: User | null,
//   isLoading: boolean,
//   isAuthenticated: boolean,
//   login: (email, password) => Promise,
//   logout: () => void,
//   register: (data) => Promise
// }

// Responsabilidades:
//   - Verificar token no localStorage
//   - Manter estado do usuário logado
//   - Fazer login/logout
//   - Fazer registro
//   - Persistir autenticação

// Uso:
// const { user, isAuthenticated, login, logout } = useAuth()
// if (isAuthenticated) { ... }
```

#### **2. useFeelingsData.ts** 🎯 (Crítico para Relatórios)
```typescript
// Função: Buscar dados de sentimentos de um paciente
// Parâmetros:
//   - userId: string
//   - startDate: string (formato YYYY-MM-DD)
//   - endDate: string (formato YYYY-MM-DD)
// Retorna: {
//   feelings: FeelingEntry[],
//   isLoading: boolean,
//   error: string | null,
//   refetch: () => Promise
// }

// Responsabilidades:
//   - Chamar feelingsService.ts
//   - Transformar resposta da API
//   - Manter estado de carregamento
//   - Tratar erros
//   - Permitir recarregar dados

// Uso:
// const { feelings, isLoading } = useFeelingsData(userId, '2025-11-25', '2025-11-25')

// Dados Retornados:
// [
//   {
//     description: 'FELIZ',
//     userPersonId: 'paciente-id',
//     createdAt: '2025-11-25T10:30:00',
//     motive: 'Estava com amigos',
//     id: 'feeling-id'
//   },
//   ...
// ]
```

#### **3. useDadosDashboard.ts**
```typescript
// Função: Buscar dados consolidados do dashboard
// Retorna: Dados agregados de pacientes, agendamentos, etc
// Responsabilidades:
//   - Chamar múltiplos services
//   - Agregar dados
//   - Gerenciar estado de carregamento
```

#### **4. useAppointmentConfirmation.ts**
```typescript
// Função: Gerenciar confirmação de agendamentos
// Responsabilidades:
//   - Confirmar agendamento pendente
//   - Cancelar agendamento
//   - Atualizar estado
```

#### **5. use-mobile.ts**
```typescript
// Função: Detectar se está em dispositivo móvel
// Retorna: boolean (true se mobile)
// Responsabilidades:
//   - Verificar viewport
//   - Detectar screen size
```

---

## Services

### O que é um Service?
Um **service** é um arquivo TypeScript que encapsula toda a lógica de comunicação com APIs e manipulação de dados. Cada service é responsável por um domínio específico.

### Services Implementados

#### **1. feelingsService.ts** 🎯 (Crítico para Relatórios)
```typescript
// Função: Gerenciar API de sentimentos/humor
// Métodos:

getFeelings(userId: string, startDay: string, endDay: string)
// GET /feelings/{userId}?startDay=YYYY-MM-DD&endDay=YYYY-MM-DD
// Retorna: { feelings: FeelingEntry[] }
// Uso: Buscar sentimentos de um período específico
// Exemplo:
//   const response = await feelingsService.getFeelings(
//     '47157343-809e-4b82-9015-806b4de1f4c3',
//     '2025-11-25',
//     '2025-11-25'
//   )
//   // Retorna 12 sentimentos registrados nesse dia

// Responsabilidades:
//   - Fazer requisição GET para API
//   - Formatar query parameters
//   - Tratar erros HTTP
//   - Transformar resposta
//   - Extrair array de feelings
//   - Validar dados recebidos

// Estrutura da Resposta:
// {
//   feelings: [
//     {
//       id: 'uuid',
//       description: 'FELIZ' | 'TRISTE' | 'RAIVA' | etc,
//       intensity: 100,
//       resultantIntensity: 100,
//       userPersonId: 'uuid',
//       createdAt: '2025-11-25T14:30:00.000Z',
//       motive: 'Texto opcional'
//     }
//   ]
// }
```

#### **2. patientsService.ts**
```typescript
// Função: Gerenciar dados de pacientes
// Métodos:

getPatientsByProfessional(professionalId: string)
// GET /professionals/patients/{professionalId}
// Retorna: { patients: Patient[] }
// Uso: Buscar lista de pacientes de um profissional

getPatientById(patientId: string)
// GET /patients/{patientId}
// Retorna: Dados detalhados do paciente

// Responsabilidades:
//   - Buscar pacientes do profissional logado
//   - Buscar dados específico do paciente
//   - Tratar erros
```

#### **3. professionalService.ts**
```typescript
// Função: Gerenciar autenticação e dados do profissional
// Métodos:

login(email: string, password: string)
// POST /persons/authenticate
// Retorna: { token: string, user: Professional }
// Uso: Autenticar profissional
// Responsabilidades:
//   - Enviar credenciais
//   - Receber token JWT
//   - Armazenar token no localStorage
//   - Retornar dados do usuário

getProfile(professionalId: string)
// GET /professionals/profile/{professionalId}
// Retorna: Professional com dados completos
// Uso: Buscar dados do perfil do profissional

register(data: RegisterData)
// POST /persons/register ou /professionals
// Retorna: { success: true, user: Professional }
// Uso: Cadastrar novo profissional

logout()
// Remove token do localStorage
```

#### **4. scheduleService.ts**
```typescript
// Função: Gerenciar agendamentos
// Métodos:

getSchedules(professionalId: string, params?: any)
// GET /schedules
// Retorna: { schedules: Schedule[] }
// Uso: Buscar agendamentos do profissional

createSchedule(data: ScheduleData)
// POST /schedules
// Retorna: { schedule: Schedule }
// Uso: Criar novo agendamento

updateSchedule(scheduleId: string, data: ScheduleData)
// PUT /schedules/{scheduleId}
// Retorna: { schedule: Schedule }

deleteSchedule(scheduleId: string)
// DELETE /schedules/{scheduleId}
// Retorna: { success: true }

confirmSchedule(scheduleId: string)
// PUT /schedules/{scheduleId}/confirm
// Retorna: { schedule: Schedule }
```

---

## Utilitários

### O que é um Utilitário?
**Utilitários** são funções reutilizáveis que não dependem de estado React, podendo ser usadas em qualquer lugar.

### Arquivos de Utilitários

#### **1. lib/axios.ts**
```typescript
// Função: Configurar cliente HTTP Axios
// Exporta: const api = axios.create(...)

// Configuração:
// - baseURL: 'https://mind-helping-api.fly.dev'
// - timeout: 5000ms
// - headers: Content-Type: application/json

// Interceptores:
// - Adiciona Bearer token automaticamente
// - Trata erros de timeout
// - Formata respostas

// Uso:
// import { api } from '@/lib/axios'
// const response = await api.get('/feelings/user-id', { params: {...} })
```

#### **2. lib/report-utils.ts** 🎯 (Crítico para Gráficos)
```typescript
// Funções: Transformar dados de sentimentos em dados de gráficos

transformFeelingToMoodEntry(feeling: FeelingEntry): MoodEntry
// Converte dados da API para formato interno
// Input:
//   { description: 'FELIZ', intensity: 100, createdAt: '2025-11-25T...' }
// Output:
//   { mood: 'Feliz', date: '2025-11-25', intensity: 100 }
// Responsabilidades:
//   - Extrair data de createdAt
//   - Capitalizar nome do sentimento
//   - Normalizar valores de intensidade

calculateMoodAverages(feelings: FeelingEntry[], targetDate: string)
// Calcula proporção de cada sentimento em UM DIA específico
// Input: Array de 7 sentimentos do dia 25/11/2025
// Output: [
//   { mood: 'Feliz', percentage: 29, count: 2 },
//   { mood: 'Triste', percentage: 14, count: 1 },
//   ...
// ]
// Lógica: (contagem / total) * 100
// Uso: Gráfico de barras diário

calculateDonutChartData(feelings: FeelingEntry[])
// Calcula distribuição de sentimentos em um PERÍODO (30 dias)
// Input: Array de 12 sentimentos dos últimos 30 dias
// Output: [
//   { mood: 'Triste', count: 5, percentage: 41.67 },
//   { mood: 'Não sei dizer', count: 3, percentage: 25 },
//   ...
// ]
// Lógica: Agrupa por sentimento e conta
// Uso: Gráfico de rosca (donut)

normalizeMoodName(description: string): string
// Normaliza variações do mesmo sentimento
// 'FELIZ' → 'feliz'
// 'NÃO_SEI_DIZER' → 'não_sei_dizer'
// 'TEDIO' → 'tédio'
// Responsabilidades:
//   - Converter para minúsculas
//   - Substitui underscores
//   - Remove acentos em alguns casos

getColorClass(mood: string): string
// Retorna classe Tailwind CSS para cor do sentimento
// 'feliz' → 'bg-green-500'
// 'triste' → 'bg-blue-500'
// 'raiva' → 'bg-red-500'
// Uso: Estilizar componentes baseado no sentimento
```

#### **3. lib/utils.ts**
```typescript
// Funções: Utilitários gerais
// - Formatação de datas
// - Validação de inputs
// - Cálculos gerais
// - Funções helper
```

---

## Fluxo de Dados

### Fluxo de Autenticação
```
1. Usuário acessa /login
   ↓
2. login-form.tsx renderiza
   ↓
3. Usuário preenche email/senha e clica LOGIN
   ↓
4. React Hook Form valida dados
   ↓
5. professionalService.login(email, password) é chamado
   ↓
6. POST /persons/authenticate é enviado
   ↓
7. API retorna { token, user }
   ↓
8. Token armazenado em localStorage
   ↓
9. useAuth hook atualiza estado
   ↓
10. Usuário redirecionado para /app/principal
```

### Fluxo de Visualização de Relatórios
```
1. Usuário clica em paciente na lista
   ↓
2. Navega para /app/reports?patientId=uuid
   ↓
3. reports.tsx renderiza
   ↓
4. useFeelingsData hook busca sentimentos
   ↓
5. feelingsService.getFeelings é chamado
   ↓
6. GET /feelings/{patientId}?startDay=...&endDay=...
   ↓
7. API retorna array de FeelingEntry
   ↓
8. Três componentes renderizam com dados:
   
   a) appointment-list.tsx
      - Busca /cvv-calls/{patientId}
      - Exibe 9 chamadas CVV com datas formatadas
   
   b) mood-variation-chart.tsx
      - Chama calculateMoodAverages()
      - Exibe gráfico de barras para UM DIA
      - Permite selecionar diferentes datas
   
   c) mood-donut-chart.tsx
      - Chama calculateDonutChartData()
      - Exibe gráfico de rosca para PERÍODO (30 dias)
```

### Fluxo de Processamento de Dados (Sentimentos)
```
API Response (feelingsService):
{
  "feelings": [
    {
      "id": "uuid",
      "description": "FELIZ",
      "intensity": 100,
      "userPersonId": "patient-id",
      "createdAt": "2025-11-25T14:30:00.000Z",
      "motive": "Com amigos"
    }
  ]
}
   ↓
transformFeelingToMoodEntry() [report-utils.ts]
   ↓
{
  "mood": "Feliz",
  "date": "2025-11-25",
  "intensity": 100
}
   ↓
calculateMoodAverages() ou calculateDonutChartData()
   ↓
{
  "mood": "Feliz",
  "percentage": 29,
  "count": 2,
  "color": "bg-green-500"
}
   ↓
Renderizado no gráfico Recharts
```

---

## Autenticação

### Sistema de Autenticação

#### **1. Login Flow**
```typescript
// professionalService.ts
export async function login(email: string, password: string) {
  // 1. Enviar credenciais
  const response = await api.post('/persons/authenticate', {
    email,
    password
  })
  
  // 2. Receber token JWT
  const { token, user } = response.data
  
  // 3. Armazenar token
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  
  // 4. Retornar dados
  return { token, user }
}
```

#### **2. Token Management**
```typescript
// axios.ts (Interceptor)
api.interceptors.request.use((config) => {
  // Adiciona token automaticamente em cada requisição
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

#### **3. Rota Protegida**
```typescript
// app.tsx (Layout protegido)
// Se não há token, redireciona para /login
// Se há token, renderiza dashboard
```

---

## APIs Integradas

### Endpoints da API

#### **1. Autenticação**
```
POST /persons/authenticate
Request: { email: string, password: string }
Response: { token: string, user: Professional }

POST /persons/register
Request: { email, password, name, crp, ... }
Response: { user: Professional }
```

#### **2. Sentimentos** 🎯
```
GET /feelings/{userId}?startDay=YYYY-MM-DD&endDay=YYYY-MM-DD
Response: { feelings: FeelingEntry[] }

Exemplo Real:
GET /feelings/47157343-809e-4b82-9015-806b4de1f4c3?startDay=2025-11-25&endDay=2025-11-25
Response: {
  "feelings": [
    { "description": "TRISTE", "createdAt": "2025-11-25T...", ... },
    { "description": "NÃO_SEI_DIZER", "createdAt": "2025-11-25T...", ... },
    ...
  ]
}
```

#### **3. Pacientes**
```
GET /professionals/patients/{professionalId}
Response: { patients: Patient[] }

GET /patients/{patientId}
Response: { patient: Patient }
```

#### **4. Profissional**
```
GET /professionals/profile/{professionalId}
Response: { professional: Professional }
```

#### **5. Agendamentos**
```
GET /schedules
POST /schedules
PUT /schedules/{scheduleId}
DELETE /schedules/{scheduleId}
PUT /schedules/{scheduleId}/confirm
```

#### **6. Chamadas CVV** 🔄 (Recém Integrado)
```
GET /cvv-calls/{userId}
Response: {
  "cvvCalls": [
    {
      "id": "uuid",
      "dateCalled": "2025-11-04T00:00:00.000Z",
      "timeCalled": "00:00:08",
      "userPersonId": "patient-id"
    },
    ... (9 chamadas)
  ]
}

Exemplo Real:
GET /cvv-calls/47157343-809e-4b82-9015-806b4de1f4c3
Response: 9 chamadas formatadas e exibidas com datas legíveis
```

---

## Interfaces TypeScript

### Tipos Principais

```typescript
// Profissional (terapeuta/psicólogo)
interface Professional {
  id: string
  name: string
  email: string
  crp: string
  phone: string
  birthDate: string
  cpf: string
  isAuthenticated: boolean
}

// Paciente
interface Patient {
  id: string
  name: string
  email: string
  birthDate: string
  phone: string
  cpf: string
}

// Sentimento (resposta da API)
interface FeelingEntry {
  id: string
  description: string // 'FELIZ', 'TRISTE', 'RAIVA', etc
  intensity?: number
  resultantIntensity: number
  userPersonId: string
  createdAt: string
  motive?: string
}

// Sentimento (formato interno)
interface MoodEntry {
  mood: string // 'Feliz', 'Triste', etc
  date: string
  intensity: number
  userId: string
}

// Dados para gráficos
interface ChartDataPoint {
  mood: string
  percentage: number
  count: number
  color: string
}

// Agendamento
interface Schedule {
  id: string
  date: string
  time: string
  patientId: string
  professionalId: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

// Chamada CVV (resposta da API)
interface CVVCall {
  id: string
  dateCalled: string // ISO format
  timeCalled: string // HH:MM:SS
  userPersonId: string
}

// Contexto de Autenticação
interface AuthContextType {
  user: Professional | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (data: RegisterData) => Promise<void>
}
```

---

## Fluxo de Desenvolvimento

### Como Adicionar uma Nova Funcionalidade

#### **Exemplo: Novo Gráfico de Emoções**

1. **Service** (API Communication)
   ```typescript
   // services/emotionsService.ts
   export async function getEmotions(userId: string) {
     const response = await api.get(`/emotions/${userId}`)
     return response.data
   }
   ```

2. **Hook** (Data Management)
   ```typescript
   // hooks/useEmotions.ts
   export function useEmotions(userId: string) {
     const [emotions, setEmotions] = useState([])
     useEffect(() => {
       emotionsService.getEmotions(userId).then(setEmotions)
     }, [userId])
     return emotions
   }
   ```

3. **Component** (UI)
   ```typescript
   // routes/_app/-components/emotions-chart.tsx
   export function EmotionsChart({ userId }: { userId: string }) {
     const emotions = useEmotions(userId)
     return <div>{/* Renderizar gráfico */}</div>
   }
   ```

4. **Route** (Integration)
   ```typescript
   // routes/_app/emotions.tsx
   import { EmotionsChart } from './-components/emotions-chart'
   
   export default function EmotionsPage() {
     return <EmotionsChart userId={...} />
   }
   ```

---

## Tratamento de Erros

### Estratégias Implementadas

```typescript
// 1. Validação de Entrada
if (!userId) {
  setError('User ID is required')
  return
}

// 2. Try/Catch
try {
  const data = await api.get(...)
} catch (error) {
  console.error('Error:', error.response?.status)
  setError(error.message)
}

// 3. Loading States
{isLoading && <Spinner />}
{error && <ErrorAlert message={error} />}
{!isLoading && !error && data.length === 0 && <EmptyState />}

// 4. Retry Mechanism
const { refetch } = useFeelingsData(...)
// Usuário pode clicar em "Tentar novamente" para chamar refetch()
```

---

## Performance Optimization

### Técnicas Utilizadas

```typescript
// 1. Memoização de Componentes
const MoodChart = memo(({ data }) => { ... })

// 2. useEffect com Dependencies
useEffect(() => {
  // Só reexecuta quando userId muda
}, [userId])

// 3. Lazy Loading de Rotas
const ReportsPage = lazy(() => import('./reports'))

// 4. Debouncing (em inputs/filtros)
// Espera usuário parar de digitar antes de buscar
```

---

## Conclusão

Este projeto implementa uma arquitetura moderna com separação de responsabilidades:

- **Services**: Comunicação com API
- **Hooks**: Gerenciamento de estado e lógica
- **Components**: Renderização da UI
- **Utils**: Funções reutilizáveis
- **Routes**: Navegação e proteção

Cada camada é independente e testável, facilitando manutenção e escalabilidade.

---

## Referências Úteis

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [TanStack Router](https://tanstack.com/router/latest)
- [Recharts](https://recharts.org)
- [Shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

