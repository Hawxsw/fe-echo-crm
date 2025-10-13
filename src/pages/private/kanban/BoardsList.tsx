import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  LayoutDashboard,
  KanbanSquare, 
  CheckCircle2,
  XCircle,
  Layers,
  Calendar,
  Sparkles,
  EllipsisVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useBoards } from '@/hooks/useBoards';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/routes/routes';
import { IBoard } from '@/types/kanban';
import { toast } from '@/components/ui/toaster';

export default function BoardsList() {
  const navigate = useNavigate();
  const { getAllBoards, deleteBoard } = useBoards();
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      setLoading(true);
      const data = await getAllBoards();
      setBoards(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar boards:', error);
      toast.error('Erro ao carregar boards');
      setBoards([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBoards = Array.isArray(boards) ? boards.filter((board: IBoard) => {
    const matchesSearch = 
      board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  }) : [];

  const handleDeleteBoard = async (boardId: string, boardName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o board "${boardName}"?`)) {
      try {
        await deleteBoard(boardId);
        toast.success('Board excluído com sucesso!');
        loadBoards();
      } catch (error) {
        console.error('Erro ao excluir board:', error);
        toast.error('Erro ao excluir board');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mb-4"></div>
          <p className="text-muted-foreground font-medium">Carregando boards...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Boards Kanban
            </h1>
            <p className="text-muted-foreground mt-2 text-base font-light flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Gerencie seus projetos e fluxos de trabalho
            </p>
            <div className="absolute -top-1 -left-1 w-20 h-20 bg-primary/5 rounded-full blur-3xl -z-10" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <Button
              onClick={() => navigate(routes.dashboard.routes.kanban.routes.new.path)}
              className="shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Board
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Boards</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 transition-transform duration-300 group-hover:scale-110">
                <LayoutDashboard className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {Array.isArray(boards) ? boards.length : 0}
              </div>
              <p className="text-xs text-muted-foreground">boards cadastrados</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Boards Ativos</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 transition-transform duration-300 group-hover:scale-110">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {Array.isArray(boards) ? boards.filter(b => b.isActive).length : 0}
              </div>
              <p className="text-xs text-muted-foreground">em uso</p>
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
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Boards Inativos</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 transition-transform duration-300 group-hover:scale-110">
                <XCircle className="h-6 w-6 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {Array.isArray(boards) ? boards.filter(b => !b.isActive).length : 0}
              </div>
              <p className="text-xs text-muted-foreground">pausados</p>
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
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Colunas</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 transition-transform duration-300 group-hover:scale-110">
                <Layers className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {Array.isArray(boards) ? boards.reduce((sum, board) => sum + (board.columns?.length || 0), 0) : 0}
              </div>
              <p className="text-xs text-muted-foreground">no total</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Buscar boards por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 shadow-sm focus:shadow-md transition-shadow duration-200"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Boards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBoards.length === 0 ? (
          <div className="col-span-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5" />
                <CardContent className="p-16 relative text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline-block p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl mb-6"
                  >
                    <KanbanSquare className="w-20 h-20 text-primary mx-auto" />
                  </motion.div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-3">
                    {searchTerm ? 'Nenhum board encontrado' : 'Comece criando um board'}
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    {searchTerm 
                      ? 'Tente buscar com outros termos ou limpe os filtros'
                      : 'Crie seu primeiro board Kanban para começar a organizar suas tarefas'
                    }
                  </p>
                  {!searchTerm && (
                    <Button 
                      onClick={() => navigate(routes.dashboard.routes.kanban.routes.new.path)}
                      className="shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Board
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
            filteredBoards.map((board, idx) => (
              <motion.div
                key={board.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
              >
                <Card 
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(routes.dashboard.routes.kanban.routes.board.path.replace(':id', board.id))}
                >
                  {/* Indicador de borda superior baseado no status */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    board.isActive 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-orange-500 to-amber-500'
                  }`}></div>

                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <CardHeader className="pb-4 relative">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-600 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                          <KanbanSquare className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-bold truncate group-hover:text-primary transition-colors">
                            {board.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge className={`${
                              board.isActive 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-orange-100 text-orange-700'
                            } px-2.5 py-0.5 rounded-lg text-xs font-semibold`}>
                              {board.isActive ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <EllipsisVertical className="w-4 h-4 text-slate-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(routes.dashboard.routes.kanban.routes.board.path.replace(':id', board.id));
                          }}
                          className="rounded-lg"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Board
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(routes.dashboard.routes.kanban.routes.edit.path.replace(':id', board.id));
                          }}
                          className="rounded-lg"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBoard(board.id, board.name);
                          }}
                          className="text-red-600 focus:text-red-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {board.description && (
                    <CardDescription className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {board.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Layers className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">Colunas</span>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        {board.columns?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">Criado em</span>
                      </div>
                      <span className="font-semibold text-slate-700 text-sm">
                        {formatDate(board.createdAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            ))
          )}
        </div>
    </div>
  );
}
