import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useRoles } from '@/hooks/useRoles';
import { IRole } from '@/types/role';
import { toast } from '@/components/ui/toaster';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Shield,
  Lock,
  Users,
  Calendar,
  Clock,
  Settings,
  CheckCircle2,
} from 'lucide-react';

export default function RoleDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getRoleById, deleteRole } = useRoles();
  
  const [role, setRole] = useState<IRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchRole(id);
    }
  }, [id]);

  const fetchRole = async (roleId: string) => {
    try {
      setLoading(true);
      setError(null);
      const roleData = await getRoleById(roleId);
      setRole(roleData);
    } catch (error) {
      console.error('Erro ao carregar função:', error);
      setError('Erro ao carregar dados da função');
      toast.error('Erro ao carregar dados da função');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!role) return;

    if (role.isSystem) {
      toast.error('Não é possível excluir funções do sistema');
      return;
    }
    
    if (window.confirm(`Tem certeza que deseja excluir a função "${role.name}"?`)) {
      try {
        await deleteRole(role.id);
        toast.success('Função excluída com sucesso!');
        navigate('/dashboard/roles');
      } catch (error) {
        console.error('Erro ao excluir:', error);
        toast.error('Erro ao excluir função');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPermissionLabel = (resource: string, action: string) => {
    const resourceLabels: Record<string, string> = {
      USERS: 'Usuários',
      ROLES: 'Funções',
      KANBAN_BOARDS: 'Boards Kanban',
      KANBAN_CARDS: 'Cards Kanban',
      CHAT: 'Chat',
      WHATSAPP: 'WhatsApp',
      REPORTS: 'Relatórios',
      ALL: 'Todos os Recursos',
    };

    const actionLabels: Record<string, string> = {
      CREATE: 'Criar',
      READ: 'Visualizar',
      UPDATE: 'Atualizar',
      DELETE: 'Excluir',
      MANAGE: 'Gerenciar',
    };

    return `${actionLabels[action] || action} ${resourceLabels[resource] || resource}`;
  };

  const groupPermissionsByResource = () => {
    if (!role?.permissions) return {};
    
    return role.permissions.reduce((acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = [];
      }
      acc[permission.resource].push(permission);
      return acc;
    }, {} as Record<string, typeof role.permissions>);
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
          <p className="text-muted-foreground font-medium">Carregando dados da função...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="space-y-8 pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {error || 'Função não encontrada'}
          </h3>
          <p className="text-muted-foreground mb-6">
            A função solicitada não foi encontrada ou ocorreu um erro ao carregar os dados.
          </p>
          <Button
            onClick={() => navigate('/dashboard/roles')}
            variant="outline"
            className="shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Lista
          </Button>
        </motion.div>
      </div>
    );
  }

  const groupedPermissions = groupPermissionsByResource();

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative"
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard/roles')}
                  className="shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-110">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {role.name}
                      </h1>
                      {role.isSystem && (
                        <Lock className="w-6 h-6 text-purple-500" />
                      )}
                    </div>
                    {role.description && (
                      <p className="text-muted-foreground text-lg mb-3">
                        {role.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      <Badge className={role.isSystem 
                        ? 'bg-purple-100 text-purple-800 border-purple-200' 
                        : 'bg-blue-100 text-blue-800 border-blue-200'
                      }>
                        {role.isSystem ? 'Função do Sistema' : 'Função Personalizada'}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {role.userCount || 0} usuários
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/dashboard/roles/edit/${role.id}`)}
                  className="shadow-sm hover:shadow-md transition-all duration-200"
                  disabled={role.isSystem}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={handleDelete}
                  disabled={role.isSystem}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="absolute -top-1 -left-1 w-20 h-20 bg-primary/5 rounded-full blur-3xl -z-10" />
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Permissões</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 transition-transform duration-300 group-hover:scale-110">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {role.permissions?.length || 0}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Usuários</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 transition-transform duration-300 group-hover:scale-110">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {role.userCount || 0}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Criado em</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 transition-transform duration-300 group-hover:scale-110">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                {formatDate(role.createdAt)}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Atualizado em</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 transition-transform duration-300 group-hover:scale-110">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                {formatDate(role.updatedAt)}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Permissions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              Permissões da Função
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              Recursos e ações permitidas para esta função
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(groupedPermissions).length === 0 ? (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Nenhuma permissão configurada</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([resource, permissions]) => (
                  <div key={resource} className="border-l-4 border-purple-500 pl-6 py-2">
                    <h3 className="font-semibold text-lg text-slate-900 mb-3 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-purple-500" />
                      {resource.replace(/_/g, ' ')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {permissions.map((permission, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-slate-700">
                            {getPermissionLabel(permission.resource, permission.action)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* System Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              Informações do Sistema
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              Dados técnicos e de controle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-600">ID da Função</label>
                <p className="text-slate-900 font-mono text-sm">{role.id}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Tipo</label>
                <p className="text-slate-900 font-medium">
                  {role.isSystem ? 'Função do Sistema' : 'Função Personalizada'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Total de Permissões</label>
                <p className="text-slate-900 font-medium">{role.permissions?.length || 0}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Data de Criação</label>
                <p className="text-slate-900 font-medium">{formatDate(role.createdAt)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Última Atualização</label>
                <p className="text-slate-900 font-medium">{formatDate(role.updatedAt)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Usuários com esta Função</label>
                <p className="text-slate-900 font-medium">{role.userCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
