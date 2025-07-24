import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  Users, 
  Settings,
  Plus
} from "lucide-react";
import { Button } from "./button";
import { CreateProjectModal } from "../modals/create-project-modal";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Projetos",
    href: "/projects",
    icon: FolderOpen,
  },
  {
    name: "Tarefas",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Equipe",
    href: "/team",
    icon: Users,
  },
];

export function Navigation() {
  const location = useLocation();
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          ProjectHub
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestão inteligente de projetos
        </p>
      </div>

      <div className="px-4 mb-4">
        <CreateProjectModal open={createProjectOpen} onOpenChange={setCreateProjectOpen} />
        <Button onClick={() => setCreateProjectOpen(true)} className="w-full justify-start gap-2" size="sm">
          <Plus className="h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
          <Settings className="h-4 w-4" />
          Configurações
        </Button>
      </div>
    </div>
  );
}