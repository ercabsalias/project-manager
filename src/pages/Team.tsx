import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockMembers, mockTasks, mockProjects } from "@/lib/mockData";
import { 
  Search, 
  Plus, 
  Users, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  CheckSquare,
  Clock,
  Filter
} from "lucide-react";

export default function Team() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getStatsForMember = (memberId: string) => {
    const memberTasks = mockTasks.filter(task => task.assignee.id === memberId);
    const completedTasks = memberTasks.filter(task => task.status === 'completed').length;
    const activeTasks = memberTasks.filter(task => task.status === 'in-progress').length;
    const memberProjects = mockProjects.filter(project => 
      project.members.some(member => member.id === memberId)
    ).length;

    return {
      totalTasks: memberTasks.length,
      completedTasks,
      activeTasks,
      projects: memberProjects
    };
  };

  const roleColors = {
    admin: "bg-red-100 text-red-800 border-red-200",
    manager: "bg-blue-100 text-blue-800 border-blue-200",
    member: "bg-green-100 text-green-800 border-green-200"
  };

  const roleLabels = {
    admin: "Administrador",
    manager: "Gerente",
    member: "Membro"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipe</h1>
          <p className="text-muted-foreground">
            Gerencie os membros da sua equipe e suas atribuições
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Convidar Membro
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 novos este mês
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMembers.filter(m => m.role === 'admin').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Acesso total ao sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gerentes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMembers.filter(m => m.role === 'manager').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Liderança de projetos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros Ativos</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMembers.filter(m => m.role === 'member').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Executores de tarefas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar membros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os cargos</SelectItem>
            <SelectItem value="admin">Administradores</SelectItem>
            <SelectItem value="manager">Gerentes</SelectItem>
            <SelectItem value="member">Membros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Team Members Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => {
            const stats = getStatsForMember(member.id);
            
            return (
              <Card key={member.id} className="hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-lg">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={roleColors[member.role]}>
                      {roleLabels[member.role]}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>+55 (11) 99999-9999</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>São Paulo, SP</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Na empresa há 1 ano</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{stats.projects}</div>
                      <div className="text-xs text-muted-foreground">Projetos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-success">{stats.completedTasks}</div>
                      <div className="text-xs text-muted-foreground">Concluídas</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-info">{stats.activeTasks}</div>
                      <div className="text-xs text-muted-foreground">Ativas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-muted-foreground">{stats.totalTasks}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                  </div>

                  {/* Performance Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Performance</span>
                      <span className="font-medium">
                        {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-success h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: stats.totalTasks > 0 
                            ? `${(stats.completedTasks / stats.totalTasks) * 100}%`
                            : '0%'
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Perfil
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Mensagem
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum membro encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Tente ajustar os filtros ou convide novos membros para a equipe.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Convidar Primeiro Membro
            </Button>
          </div>
        </div>
      )}

      {/* Team Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Produtividade da Equipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tarefas Concluídas (Mês)</span>
                <span className="font-medium">
                  {mockTasks.filter(t => t.status === 'completed').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taxa de Conclusão</span>
                <span className="font-medium text-success">
                  {Math.round((mockTasks.filter(t => t.status === 'completed').length / mockTasks.length) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Projetos Ativos</span>
                <span className="font-medium">
                  {mockProjects.filter(p => p.status === 'in-progress').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mockMembers[0].avatar} alt={mockMembers[0].name} />
                  <AvatarFallback className="text-xs">
                    {mockMembers[0].name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{mockMembers[0].name}</p>
                  <p className="text-xs text-muted-foreground">Concluiu 3 tarefas hoje</p>
                </div>
                <span className="text-xs text-muted-foreground">2h atrás</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mockMembers[1].avatar} alt={mockMembers[1].name} />
                  <AvatarFallback className="text-xs">
                    {mockMembers[1].name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{mockMembers[1].name}</p>
                  <p className="text-xs text-muted-foreground">Criou novo projeto</p>
                </div>
                <span className="text-xs text-muted-foreground">5h atrás</span>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mockMembers[2].avatar} alt={mockMembers[2].name} />
                  <AvatarFallback className="text-xs">
                    {mockMembers[2].name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{mockMembers[2].name}</p>
                  <p className="text-xs text-muted-foreground">Adicionou comentário</p>
                </div>
                <span className="text-xs text-muted-foreground">1d atrás</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}