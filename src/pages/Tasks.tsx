import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { mockTasks, mockProjects } from "@/lib/mockData";
import { 
  Search, 
  Plus, 
  Filter,
  CheckSquare,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  Flag
} from "lucide-react";

export default function Tasks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesProject = projectFilter === "all" || task.projectId === projectFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const taskStatusColors = {
    todo: "bg-gray-100 text-gray-800 border-gray-200",
    'in-progress': "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    blocked: "bg-red-100 text-red-800 border-red-200"
  };

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 border-blue-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200"
  };

  const taskStatusLabels = {
    todo: "A Fazer",
    'in-progress': "Em Progresso",
    completed: "Concluído",
    blocked: "Bloqueado"
  };

  const priorityLabels = {
    low: "Baixa",
    medium: "Média",
    high: "Alta"
  };

  const statusCounts = {
    all: mockTasks.length,
    todo: mockTasks.filter(t => t.status === 'todo').length,
    'in-progress': mockTasks.filter(t => t.status === 'in-progress').length,
    completed: mockTasks.filter(t => t.status === 'completed').length,
    blocked: mockTasks.filter(t => t.status === 'blocked').length,
  };

  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
    blocked: filteredTasks.filter(t => t.status === 'blocked'),
  };

  const getProjectName = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    return project?.title || "Projeto não encontrado";
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const TaskCard = ({ task }: { task: typeof mockTasks[0] }) => {
    const overdue = isOverdue(task.dueDate) && task.status !== 'completed';
    
    return (
      <Card className="hover:shadow-sm transition-all duration-200 cursor-pointer">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-1">
                <h4 className="font-medium line-clamp-1">{task.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              </div>
              <div className="flex gap-1 ml-3">
                <Badge variant="outline" className={taskStatusColors[task.status]}>
                  {taskStatusLabels[task.status]}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className={priorityColors[task.priority]}>
                <Flag className="h-3 w-3 mr-1" />
                {priorityLabels[task.priority]}
              </Badge>
              {overdue && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Atrasada
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                  <AvatarFallback className="text-xs">
                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground">{task.assignee.name}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span className={overdue ? "text-destructive" : ""}>
                  {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Projeto: {getProjectName(task.projectId)}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todas as tarefas da equipe
          </p>
        </div>
        <Button onClick={() => setCreateTaskOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-sm transition-shadow" 
              onClick={() => setStatusFilter("todo")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Fazer</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.todo}</div>
            <p className="text-xs text-muted-foreground">
              Tarefas pendentes
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-sm transition-shadow"
              onClick={() => setStatusFilter("in-progress")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statusCounts['in-progress']}</div>
            <p className="text-xs text-muted-foreground">
              Em desenvolvimento
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-sm transition-shadow"
              onClick={() => setStatusFilter("completed")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
            <p className="text-xs text-muted-foreground">
              Finalizadas
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-sm transition-shadow"
              onClick={() => setStatusFilter("blocked")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bloqueadas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusCounts.blocked}</div>
            <p className="text-xs text-muted-foreground">
              Precisam atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="todo">A Fazer</SelectItem>
              <SelectItem value="in-progress">Em Progresso</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="blocked">Bloqueado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <Flag className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[140px]">
              <User className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Projeto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Projetos</SelectItem>
              {mockProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tasks Content */}
      <Tabs defaultValue="grid" className="space-y-6">
        <TabsList>
          <TabsTrigger value="grid">Visualização em Grade</TabsTrigger>
          <TabsTrigger value="kanban">Quadro Kanban</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          {filteredTasks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Nenhuma tarefa encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  Tente ajustar os filtros ou criar uma nova tarefa.
                </p>
                <Button onClick={() => setCreateTaskOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Tarefa
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="kanban" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* To Do Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">A Fazer</h3>
                <Badge variant="outline">{tasksByStatus.todo.length}</Badge>
              </div>
              <div className="space-y-3">
                {tasksByStatus.todo.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {tasksByStatus.todo.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma tarefa</p>
                  </div>
                )}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-blue-700">Em Progresso</h3>
                <Badge variant="outline">{tasksByStatus['in-progress'].length}</Badge>
              </div>
              <div className="space-y-3">
                {tasksByStatus['in-progress'].map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {tasksByStatus['in-progress'].length === 0 && (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
                    <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma tarefa</p>
                  </div>
                )}
              </div>
            </div>

            {/* Completed Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-green-700">Concluído</h3>
                <Badge variant="outline">{tasksByStatus.completed.length}</Badge>
              </div>
              <div className="space-y-3">
                {tasksByStatus.completed.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {tasksByStatus.completed.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
                    <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma tarefa</p>
                  </div>
                )}
              </div>
            </div>

            {/* Blocked Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-red-700">Bloqueado</h3>
                <Badge variant="outline">{tasksByStatus.blocked.length}</Badge>
              </div>
              <div className="space-y-3">
                {tasksByStatus.blocked.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {tasksByStatus.blocked.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma tarefa</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <CreateTaskModal 
        open={createTaskOpen} 
        onOpenChange={setCreateTaskOpen}
      />
    </div>
  );
}