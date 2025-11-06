import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import {
  Users,
  Building2,
  TrendingUp,
  UserPlus,
  LayoutDashboard,
  Calendar,
  Activity,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Clock,
  Target,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const PRIORITY_STYLES = {
  high: 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 shadow-sm',
  medium: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 shadow-sm',
  low: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 shadow-sm',
} as const;

const PRIORITY_LABELS = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
} as const;

const TaskPriorityBadge = ({ priority }: { priority: string }) => (
  <div className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${PRIORITY_STYLES[priority as keyof typeof PRIORITY_STYLES]}`}>
    {PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS]}
  </div>
);

interface DashboardStats {
  totalUsers: number;
  usersChange: number;
  totalCompanies: number;
  companiesChange: number;
  totalBoards: number;
  boardsChange: number;
  activeUsers: number;
  activeUsersChange: number;
}

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats] = useState<DashboardStats>({
    totalUsers: 248,
    usersChange: 12,
    totalCompanies: 43,
    companiesChange: 8,
    totalBoards: 12,
    boardsChange: 23,
    activeUsers: 235,
    activeUsersChange: 95,
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const statsCards = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers,
      change: stats.usersChange,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Empresas Cadastradas',
      value: stats.totalCompanies,
      change: stats.companiesChange,
      icon: Building2,
      gradient: 'from-green-500 to-emerald-500',
      iconBg: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-600',
    },
    {
      title: 'Boards Kanban',
      value: stats.totalBoards,
      change: stats.boardsChange,
      icon: LayoutDashboard,
      gradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Usuários Ativos',
      value: stats.activeUsers,
      change: stats.activeUsersChange,
      icon: Activity,
      gradient: 'from-orange-500 to-amber-500',
      iconBg: 'bg-gradient-to-br from-orange-500/20 to-amber-500/20',
      iconColor: 'text-orange-600',
    },
  ];

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const past = typeof date === 'string' ? new Date(date) : date;
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Há poucos segundos';
    if (diffInMinutes === 1) return 'Há 1 minuto';
    if (diffInMinutes < 60) return `Há ${diffInMinutes} minutos`;
    if (diffInMinutes < 120) return 'Há 1 hora';
    if (diffInMinutes < 1440) return `Há ${Math.floor(diffInMinutes / 60)} horas`;
    if (diffInMinutes < 2880) return 'Há 1 dia';
    return `Há ${Math.floor(diffInMinutes / 1440)} dias`;
  };

  const recentActivities = [
    {
      id: '1',
      type: 'user_created',
      title: 'Novo usuário cadastrado',
      description: 'João Silva entrou no sistema',
      time: new Date(Date.now() - 1000 * 60 * 15),
      icon: UserPlus,
      color: 'text-blue-500',
    },
    {
      id: '2',
      type: 'company_created',
      title: 'Nova empresa cadastrada',
      description: 'Tech Solutions Ltda',
      time: new Date(Date.now() - 1000 * 60 * 45),
      icon: Building2,
      color: 'text-green-500',
    },
    {
      id: '3',
      type: 'board_created',
      title: 'Board criado',
      description: 'Vendas Q1 2025',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2),
      icon: LayoutDashboard,
      color: 'text-purple-500',
    },
    {
      id: '4',
      type: 'task_completed',
      title: 'Tarefa concluída',
      description: 'Reunião com cliente finalizada',
      time: new Date(Date.now() - 1000 * 60 * 60 * 4),
      icon: CheckCircle2,
      color: 'text-orange-500',
    },
  ];

  const upcomingTasks = [
    {
      id: '1',
      title: 'Reunião com cliente - Tech Solutions',
      time: '14:00 - 15:00',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Apresentação de proposta comercial',
      time: '15:30 - 16:30',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Follow-up com leads',
      time: '17:00 - 17:30',
      priority: 'low',
    },
    {
      id: '4',
      title: 'Revisão de métricas do mês',
      time: '18:00 - 19:00',
      priority: 'medium',
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative"
      >
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Bem-vindo de volta, {currentUser?.firstName}! 👋
        </h1>
        <p className="text-muted-foreground mt-2 text-base font-light">
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        <div className="absolute -top-1 -left-1 w-20 h-20 bg-primary/5 rounded-full blur-3xl -z-10" />
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-3 rounded-2xl ${stat.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      <div className="h-9 w-24 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
                      <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-3xl font-bold mb-3 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                        {stat.value}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <motion.div
                          animate={{
                            y: stat.change > 0 ? [-1, 1, -1] : [1, -1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        >
                          {stat.change > 0 ? (
                            <ArrowUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-red-500" />
                          )}
                        </motion.div>
                        <span className={`font-semibold ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change}%
                        </span>
                        <span className="text-muted-foreground">no último mês</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              Atividades Recentes
            </CardTitle>
            <CardDescription className="text-sm">Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="h-12 w-12 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-2xl" />
                    <div className="flex-1 space-y-2.5">
                      <div className="h-4 w-36 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
                      <div className="h-3 w-28 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
                      <div className="h-3 w-20 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {recentActivities.map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.3 }}
                      className="flex items-start gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors duration-200 group"
                    >
                      <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${
                        activity.type === 'user_created' ? 'from-blue-500/20 to-cyan-500/20' :
                        activity.type === 'company_created' ? 'from-green-500/20 to-emerald-500/20' :
                        activity.type === 'board_created' ? 'from-purple-500/20 to-pink-500/20' :
                        'from-orange-500/20 to-amber-500/20'
                      } flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className={`h-6 w-6 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(activity.time)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              Próximas Tarefas
            </CardTitle>
            <CardDescription className="text-sm">Atividades agendadas para hoje</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-5 w-5 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-md" />
                    <div className="flex-1 space-y-2.5">
                      <div className="h-4 w-36 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
                      <div className="h-3 w-24 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {upcomingTasks.map((task, idx) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors duration-200 group"
                  >
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded-md border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary/50 cursor-pointer transition-all duration-200 hover:border-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors duration-200">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        {task.time}
                      </p>
                    </div>
                    <TaskPriorityBadge priority={task.priority} />
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid gap-6 md:grid-cols-3"
      >
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversão do Mês</CardTitle>
              <div className="p-2.5 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                <Target className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                32.5%
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <motion.div
                  animate={{ y: [-1, 1, -1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowUp className="h-4 w-4 text-green-500" />
                </motion.div>
                <span className="font-semibold text-green-600">+4.3%</span>
                <span className="text-muted-foreground">vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Leads em Andamento</CardTitle>
              <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                127
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <motion.div
                  animate={{ y: [-1, 1, -1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowUp className="h-4 w-4 text-green-500" />
                </motion.div>
                <span className="font-semibold text-green-600">+18</span>
                <span className="text-muted-foreground">novos esta semana</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reuniões Hoje</CardTitle>
              <div className="p-2.5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                4
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Próxima em <span className="font-semibold text-purple-600 ml-1">45 minutos</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="border-0 shadow-lg overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -z-10" />
          <CardContent className="p-8 relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Sparkles className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Bem-vindo ao Echo CRM! 🚀
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Dashboard com dados de demonstração. Explore as funcionalidades disponíveis no menu lateral e descubra todo o potencial da plataforma.
                </p>
              </div>
              <div className="hidden lg:flex gap-3 opacity-20">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Calendar className="h-12 w-12 text-primary" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  <TrendingUp className="h-12 w-12 text-primary" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                >
                  <Target className="h-12 w-12 text-primary" />
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

