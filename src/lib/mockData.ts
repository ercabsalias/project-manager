export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  members: Member[];
  tasks: Task[];
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  assignee: Member;
  dueDate: string;
  projectId: string;
  createdAt: string;
  comments: Comment[];
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'manager' | 'member';
}

export interface Comment {
  id: string;
  content: string;
  author: Member;
  createdAt: string;
}

// Mock data
export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana@empresa.com',
    avatar: '/placeholder.svg',
    role: 'admin'
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@empresa.com',
    avatar: '/placeholder.svg',
    role: 'manager'
  },
  {
    id: '3',
    name: 'Maria Costa',
    email: 'maria@empresa.com',
    avatar: '/placeholder.svg',
    role: 'member'
  },
  {
    id: '4',
    name: 'Pedro Lima',
    email: 'pedro@empresa.com',
    avatar: '/placeholder.svg',
    role: 'member'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Sistema de E-commerce',
    description: 'Desenvolvimento de uma plataforma completa de e-commerce com integração de pagamentos e gestão de estoque.',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    status: 'in-progress',
    progress: 65,
    priority: 'high',
    createdAt: '2024-01-15T10:00:00Z',
    members: [mockMembers[0], mockMembers[1], mockMembers[2]],
    tasks: []
  },
  {
    id: '2',
    title: 'App Mobile de Delivery',
    description: 'Aplicativo mobile para delivery de comida com geolocalização e pagamento integrado.',
    startDate: '2024-02-01',
    endDate: '2024-05-15',
    status: 'in-progress',
    progress: 40,
    priority: 'high',
    createdAt: '2024-02-01T09:00:00Z',
    members: [mockMembers[1], mockMembers[3]],
    tasks: []
  },
  {
    id: '3',
    title: 'Dashboard Analytics',
    description: 'Painel de controle para análise de dados e relatórios empresariais.',
    startDate: '2024-03-01',
    endDate: '2024-04-30',
    status: 'completed',
    progress: 100,
    priority: 'medium',
    createdAt: '2024-03-01T14:00:00Z',
    members: [mockMembers[0], mockMembers[2]],
    tasks: []
  },
  {
    id: '4',
    title: 'Sistema de CRM',
    description: 'Implementação de um sistema de gestão de relacionamento com clientes.',
    startDate: '2024-04-01',
    endDate: '2024-08-30',
    status: 'planning',
    progress: 10,
    priority: 'medium',
    createdAt: '2024-04-01T11:00:00Z',
    members: [mockMembers[1], mockMembers[2], mockMembers[3]],
    tasks: []
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Configurar ambiente de desenvolvimento',
    description: 'Configurar Docker, banco de dados e ferramentas de desenvolvimento',
    status: 'completed',
    priority: 'high',
    assignee: mockMembers[0],
    dueDate: '2024-01-20',
    projectId: '1',
    createdAt: '2024-01-15T10:00:00Z',
    comments: []
  },
  {
    id: '2',
    title: 'Implementar autenticação de usuários',
    description: 'Sistema de login e registro com JWT',
    status: 'in-progress',
    priority: 'high',
    assignee: mockMembers[1],
    dueDate: '2024-02-15',
    projectId: '1',
    createdAt: '2024-01-20T14:00:00Z',
    comments: []
  },
  {
    id: '3',
    title: 'Criar catálogo de produtos',
    description: 'Interface para exibição e busca de produtos',
    status: 'todo',
    priority: 'medium',
    assignee: mockMembers[2],
    dueDate: '2024-03-01',
    projectId: '1',
    createdAt: '2024-01-25T09:00:00Z',
    comments: []
  },
  {
    id: '4',
    title: 'Integração com gateway de pagamento',
    description: 'Implementar Stripe/PayPal para processamento de pagamentos',
    status: 'todo',
    priority: 'high',
    assignee: mockMembers[0],
    dueDate: '2024-03-15',
    projectId: '1',
    createdAt: '2024-02-01T11:00:00Z',
    comments: []
  },
  {
    id: '5',
    title: 'Design da interface mobile',
    description: 'Criar protótipos e layouts para o app mobile',
    status: 'in-progress',
    priority: 'medium',
    assignee: mockMembers[3],
    dueDate: '2024-02-20',
    projectId: '2',
    createdAt: '2024-02-01T10:00:00Z',
    comments: []
  }
];

// Update projects with their respective tasks
mockProjects.forEach(project => {
  project.tasks = mockTasks.filter(task => task.projectId === project.id);
});

export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(project => project.id === id);
};

export const getTasksByProjectId = (projectId: string): Task[] => {
  return mockTasks.filter(task => task.projectId === projectId);
};

export const getTaskById = (id: string): Task | undefined => {
  return mockTasks.find(task => task.id === id);
};