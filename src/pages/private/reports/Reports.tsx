import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Download, 
  TrendingUp,
  Users,
  MessageSquare,
  Building2,
  DollarSign,
  Clock,
  Filter,
  RefreshCw,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/useToast';

interface ReportData {
  users: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    growth: number;
  };
  conversations: {
    total: number;
    resolved: number;
    pending: number;
    averageTime: string;
    satisfaction: number;
  };
  departments: {
    total: number;
    active: number;
    inactive: number;
    averageUsers: number;
    growth: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
    averageTicket: number;
  };
}

const MOCK_DATA: ReportData = {
  users: {
    total: 1247,
    active: 1156,
    inactive: 91,
    newThisMonth: 87,
    growth: 12.5
  },
  conversations: {
    total: 8934,
    resolved: 7821,
    pending: 823,
    averageTime: '2.4h',
    satisfaction: 4.6
  },
  departments: {
    total: 12,
    active: 11,
    inactive: 1,
    averageUsers: 104,
    growth: 8.2
  },
  revenue: {
    total: 245680,
    thisMonth: 32890,
    lastMonth: 29840,
    growth: 10.1,
    averageTicket: 156.80
  }
};

export default function Reports() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedType, setSelectedType] = useState('all');

  const handleGenerateReport = useCallback(async (type: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Relatório gerado",
        description: `Relatório de ${type} foi gerado com sucesso.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar relatório",
        description: "Não foi possível gerar o relatório.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleDownloadReport = useCallback((type: string) => {
    toast({
      title: "Download iniciado",
      description: `Relatório de ${type} está sendo baixado.`,
      variant: "default",
    });
  }, [toast]);

  return (
    <div className="space-y-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Relatórios
            </h1>
            <p className="text-muted-foreground mt-2 text-base font-light">
              Análise e insights dos dados da aplicação
            </p>
            <div className="absolute -top-1 -left-1 w-20 h-20 bg-primary/5 rounded-full blur-3xl -z-10" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="flex space-x-2"
          >
            <Button variant="outline" className="shadow-sm hover:shadow-md transition-all">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button className="shadow-lg hover:shadow-xl transition-all duration-200">
              <Download className="h-4 w-4 mr-2" />
              Exportar Tudo
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                <Filter className="w-5 h-5 text-blue-600" />
              </div>
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Últimos 7 dias</SelectItem>
                    <SelectItem value="30">Últimos 30 dias</SelectItem>
                    <SelectItem value="90">Últimos 90 dias</SelectItem>
                    <SelectItem value="365">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="users">Usuários</SelectItem>
                    <SelectItem value="conversations">Conversas</SelectItem>
                    <SelectItem value="revenue">Receita</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-from">Data Inicial</Label>
                <Input type="date" id="date-from" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-to">Data Final</Label>
                <Input type="date" id="date-to" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Usuários</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 transition-transform duration-300 group-hover:scale-110">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {MOCK_DATA.users.total.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+{MOCK_DATA.users.growth}%</span>
                <span>vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversas</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 transition-transform duration-300 group-hover:scale-110">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {MOCK_DATA.conversations.total.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 text-blue-500" />
                <span>{MOCK_DATA.conversations.averageTime} tempo médio</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Departamentos</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 transition-transform duration-300 group-hover:scale-110">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {MOCK_DATA.departments.total}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+{MOCK_DATA.departments.growth}%</span>
                <span>crescimento</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 transition-transform duration-300 group-hover:scale-110">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                R$ {MOCK_DATA.revenue.total.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+{MOCK_DATA.revenue.growth}%</span>
                <span>vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="conversations">Conversas</TabsTrigger>
            <TabsTrigger value="revenue">Receita</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Novos usuários cadastrados</p>
                          <p className="text-sm text-slate-500">Hoje às 14:30</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        +12
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Nova conversa iniciada</p>
                          <p className="text-sm text-slate-500">Hoje às 13:45</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        +5
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <DollarSign className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Nova venda registrada</p>
                          <p className="text-sm text-slate-500">Hoje às 12:20</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        R$ 2.450
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl">
                      <PieChart className="w-5 h-5 text-orange-600" />
                    </div>
                    Distribuição por Departamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Vendas</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900">35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Suporte</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900">28%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Marketing</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900">20%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">TI</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900">17%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-base">Usuários Ativos</CardTitle>
                  <CardDescription>Usuários que acessaram nos últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {MOCK_DATA.users.active.toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    {((MOCK_DATA.users.active / MOCK_DATA.users.total) * 100).toFixed(1)}% do total
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-base">Novos Usuários</CardTitle>
                  <CardDescription>Cadastros neste mês</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {MOCK_DATA.users.newThisMonth}
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    Crescimento de {MOCK_DATA.users.growth}%
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-base">Usuários Inativos</CardTitle>
                  <CardDescription>Sem acesso há mais de 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {MOCK_DATA.users.inactive}
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    {((MOCK_DATA.users.inactive / MOCK_DATA.users.total) * 100).toFixed(1)}% do total
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Relatório de Usuários</CardTitle>
                  <CardDescription>Análise detalhada dos usuários do sistema</CardDescription>
                </div>
                <Button 
                  onClick={() => handleGenerateReport('usuários')} 
                  disabled={isLoading}
                  className="shadow-sm hover:shadow-md transition-all"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Gerar Relatório
                </Button>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="conversations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{MOCK_DATA.conversations.total.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Resolvidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{MOCK_DATA.conversations.resolved.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{MOCK_DATA.conversations.pending.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Satisfação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{MOCK_DATA.conversations.satisfaction}/5</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Relatório de Conversas</CardTitle>
                  <CardDescription>Análise de performance do atendimento</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadReport('conversas')}
                    className="shadow-sm hover:shadow-md transition-all"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                  <Button 
                    onClick={() => handleGenerateReport('conversas')} 
                    disabled={isLoading}
                    className="shadow-sm hover:shadow-md transition-all"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    Gerar
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-base">Receita Este Mês</CardTitle>
                  <CardDescription>Total de vendas em {new Date().toLocaleDateString('pt-BR', { month: 'long' })}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    R$ {MOCK_DATA.revenue.thisMonth.toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    Crescimento de {MOCK_DATA.revenue.growth}% vs mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-base">Ticket Médio</CardTitle>
                  <CardDescription>Valor médio por transação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    R$ {MOCK_DATA.revenue.averageTicket}
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    Baseado em {Math.round(MOCK_DATA.revenue.thisMonth / MOCK_DATA.revenue.averageTicket)} transações
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-base">Receita Anual</CardTitle>
                  <CardDescription>Total acumulado no ano</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    R$ {MOCK_DATA.revenue.total.toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    Projeção: R$ {(MOCK_DATA.revenue.total * 1.2).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Relatório Financeiro</CardTitle>
                  <CardDescription>Análise completa de receitas e vendas</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadReport('receita')}
                    className="shadow-sm hover:shadow-md transition-all"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                  <Button 
                    onClick={() => handleGenerateReport('receita')} 
                    disabled={isLoading}
                    className="shadow-sm hover:shadow-md transition-all"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    Gerar
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
