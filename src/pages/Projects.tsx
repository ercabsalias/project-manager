import { useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { mockProjects } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter } from "lucide-react";

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const statusCounts = {
    all: mockProjects.length,
    planning: mockProjects.filter(p => p.status === 'planning').length,
    'in-progress': mockProjects.filter(p => p.status === 'in-progress').length,
    completed: mockProjects.filter(p => p.status === 'completed').length,
    'on-hold': mockProjects.filter(p => p.status === 'on-hold').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os seus projetos em um só lugar
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant={statusFilter === "all" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setStatusFilter("all")}
        >
          Todos ({statusCounts.all})
        </Badge>
        <Badge 
          variant={statusFilter === "in-progress" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setStatusFilter("in-progress")}
        >
          Em Progresso ({statusCounts['in-progress']})
        </Badge>
        <Badge 
          variant={statusFilter === "planning" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setStatusFilter("planning")}
        >
          Planejamento ({statusCounts.planning})
        </Badge>
        <Badge 
          variant={statusFilter === "completed" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setStatusFilter("completed")}
        >
          Concluídos ({statusCounts.completed})
        </Badge>
        <Badge 
          variant={statusFilter === "on-hold" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setStatusFilter("on-hold")}
        >
          Pausados ({statusCounts['on-hold']})
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Tente ajustar os filtros ou criar um novo projeto.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Projeto
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}