import { useParams, Link } from "react-router-dom";
import { getProjectById, getTasksByProjectId } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Edit, 
  Plus,
  CheckSquare,
  Clock,
  AlertCircle
} from "lucide-react";

const statusColors = {
  planning: "bg-blue-100 text-blue-800 border-blue-200",
  'in-progress': "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  'on-hold': "bg-gray-100 text-gray-800 border-gray-200"
};

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200"
};

const taskStatusColors = {
  todo: "bg-gray-100 text-gray-800 border-gray-200",
  'in-progress': "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  blocked: "bg-red-100 text-red-800 border-red-200"
};

const statusLabels = {
  planning: "Planejamento",
  'in-progress': "Em Progresso",
  completed: "Concluído",
  'on-hold': "Pausado"
};

const taskStatusLabels = {
  todo: "A Fazer",
  'in-progress': "Em Progresso",
  completed: "Concluído",
  blocked: "Bloqueado"
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProjectById(id) : null;
  const tasks = id ? getTasksByProjectId(id) : [];

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold mb-4">Projeto não encontrado</h1>
        <Link to="/projects">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Projetos
          </Button>
        </Link>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Projetos
          </Button>
        </Link>
        <div className="h-6 w-px bg-border" />
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
      </div>

      {/* Project Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <p className="text-muted-foreground">{project.description}</p>
                </div>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Badge variant="outline" className={statusColors[project.status]}>
                  {statusLabels[project.status]}
                </Badge>
                <Badge variant="outline" className={priorityColors[project.priority]}>
                  Prioridade {project.priority === 'high' ? 'Alta' : project.priority === 'medium' ? 'Média' : 'Baixa'}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso Geral</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Início</span>
                  </div>
                  <p className="font-medium">{new Date(project.startDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Prazo</span>
                  </div>
                  <p className="font-medium">{new Date(project.endDate).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Section */}
          <Tabs defaultValue="tasks" className="space-y-4">
            <TabsList>
              <TabsTrigger value="tasks">Tarefas</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="files">Arquivos</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Tarefas do Projeto</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Tarefa
                </Button>
              </div>

              <div className="space-y-3">
                {tasks.length > 0 ? tasks.map((task) => {
                  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
                  
                  return (
                    <Card key={task.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1">
                              <CheckSquare className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="space-y-1 flex-1">
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                  <AvatarFallback className="text-xs">
                                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isOverdue && (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            )}
                            <Badge variant="outline" className={taskStatusColors[task.status]}>
                              {taskStatusLabels[task.status]}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }) : (
                  <div className="text-center py-8">
                    <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h4 className="text-lg font-medium mb-2">Nenhuma tarefa criada</h4>
                    <p className="text-muted-foreground mb-4">Comece adicionando a primeira tarefa ao projeto.</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeira Tarefa
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h4 className="text-lg font-medium mb-2">Timeline em desenvolvimento</h4>
                    <p className="text-muted-foreground">Esta funcionalidade estará disponível em breve.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <div className="h-12 w-12 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h4 className="text-lg font-medium mb-2">Nenhum arquivo</h4>
                    <p className="text-muted-foreground mb-4">Faça upload de documentos, imagens e outros arquivos do projeto.</p>
                    <Button variant="outline">Fazer Upload</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total de Tarefas</span>
                <span className="font-medium">{tasks.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Concluídas</span>
                <span className="font-medium text-success">{completedTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Atrasadas</span>
                <span className="font-medium text-destructive">{overdueTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Membros</span>
                <span className="font-medium">{project.members.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Equipe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-xs">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {member.role === 'admin' ? 'Admin' : member.role === 'manager' ? 'Gerente' : 'Membro'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}