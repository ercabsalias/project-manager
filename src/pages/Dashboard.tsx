import { StatsCard } from "@/components/stats-card";
import { ProjectCard } from "@/components/project-card";
import { mockProjects, mockTasks } from "@/lib/mockData";
import { 
  FolderOpen, 
  CheckSquare, 
  Clock, 
  TrendingUp,
  Calendar,
  AlertTriangle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Dashboard() {
  const totalProjects = mockProjects.length;
  const completedProjects = mockProjects.filter(p => p.status === 'completed').length;
  const inProgressProjects = mockProjects.filter(p => p.status === 'in-progress').length;
  const totalTasks = mockTasks.length;
  const completedTasks = mockTasks.filter(t => t.status === 'completed').length;
  const overdueTasks = mockTasks.filter(t => new Date(t.dueDate) < new Date()).length;

  const recentProjects = mockProjects
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const upcomingTasks = mockTasks
    .filter(t => t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral dos seus projetos e atividades
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Projetos"
          value={totalProjects}
          description={`${completedProjects} concluídos`}
          icon={FolderOpen}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Projetos Ativos"
          value={inProgressProjects}
          description="Em desenvolvimento"
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Tarefas Pendentes"
          value={totalTasks - completedTasks}
          description={`${completedTasks} concluídas`}
          icon={CheckSquare}
          trend={{ value: -5, isPositive: false }}
        />
        <StatsCard
          title="Tarefas Atrasadas"
          value={overdueTasks}
          description="Requer atenção"
          icon={AlertTriangle}
          className={overdueTasks > 0 ? "border-destructive/20" : ""}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Projetos Recentes</h2>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Próximas Tarefas</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Agenda de Tarefas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTasks.map((task) => {
                const isOverdue = new Date(task.dueDate) < new Date();
                const isToday = new Date(task.dueDate).toDateString() === new Date().toDateString();
                
                return (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                        <AvatarFallback className="text-xs">
                          {task.assignee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.assignee.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isOverdue && (
                        <Badge variant="destructive" className="text-xs">
                          Atrasada
                        </Badge>
                      )}
                      {isToday && !isOverdue && (
                        <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">
                          Hoje
                        </Badge>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
              
              {upcomingTasks.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma tarefa pendente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}