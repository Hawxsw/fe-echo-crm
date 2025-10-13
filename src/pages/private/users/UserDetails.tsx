import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { useUsers } from '@/hooks';
import { IUser } from '@/types/user';
import { toast } from '@/components/ui/toaster';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Shield,
  Crown,
  UserCheck,
  UserX,
  Building2,
  Clock,
  Settings,
} from 'lucide-react';

export default function UserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getUserById, deleteUser } = useUsers();
  
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchUser(id);
    }
  }, [id]);

  const fetchUser = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getUserById(userId);
      setUser(userData);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      setError('Erro ao carregar dados do usuário');
      toast.error('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o usuário "${user.firstName} ${user.lastName}"?`)) {
      try {
        await deleteUser(user.id);
        toast.success('Usuário excluído com sucesso!');
        navigate('/dashboard/users');
      } catch (error) {
        console.error('Erro ao excluir:', error);
        toast.error('Erro ao excluir usuário');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Ativo';
      case 'INACTIVE':
        return 'Inativo';
      case 'SUSPENDED':
        return 'Suspenso';
      default:
        return status;
    }
  };

  const getRoleIcon = (user: IUser) => {
    if (user.isDepartmentHead) return <Crown className="w-5 h-5 text-yellow-600" />;
    if (user.isManager) return <Shield className="w-5 h-5 text-blue-600" />;
    return <UserCheck className="w-5 h-5 text-green-600" />;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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

  if (loading) {
    return (
      <div className="space-y-8 pb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mb-4"></div>
          <p className="text-muted-foreground font-medium">Carregando dados do usuário...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-8 pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <UserX className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {error || 'Usuário não encontrado'}
          </h3>
          <p className="text-muted-foreground mb-6">
            O usuário solicitado não foi encontrado ou ocorreu um erro ao carregar os dados.
          </p>
          <Button
            onClick={() => navigate('/dashboard/users')}
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
                  onClick={() => navigate('/dashboard/users')}
                  className="mr-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20 border-4 border-white shadow-xl">
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {user.firstName} {user.lastName}
                      </h1>
                      {getRoleIcon(user)}
                    </div>
                    <p className="text-muted-foreground text-lg font-medium mb-3">
                      {user.position || 'Sem cargo definido'}
                    </p>
                    <div className="flex items-center gap-3">
                      <div 
                        className={`${getStatusColor(user.status)} px-3 py-1 rounded-full text-sm font-medium border`}
                      >
                        {getStatusText(user.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {typeof user.role === 'string' ? user.role : user.role?.name || 'Sem cargo'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/dashboard/users/edit/${user.id}`)}
                  className="shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={handleDelete}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium truncate">{user.email}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                {user.phone || 'Não informado'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Membro desde
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                {formatDate(user.createdAt)}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Último acesso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Nunca acessou'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Dados básicos do usuário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Nome</label>
                  <p className="text-slate-900 font-medium">{user.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Sobrenome</label>
                  <p className="text-slate-900 font-medium">{user.lastName}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Email</label>
                <p className="text-slate-900 font-medium">{user.email}</p>
              </div>
              
              {user.phone && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Telefone</label>
                  <p className="text-slate-900 font-medium">{user.phone}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-slate-600">Status</label>
                <div className="mt-1">
                  <div 
                    className={`${getStatusColor(user.status)} px-3 py-1 rounded-full text-sm font-medium border inline-block`}
                  >
                    {getStatusText(user.status)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Professional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                  <Building2 className="w-5 h-5 text-green-600" />
                </div>
                Informações Profissionais
              </CardTitle>
              <CardDescription>
                Dados relacionados ao trabalho
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Cargo</label>
                <p className="text-slate-900 font-medium">{user.position || 'Não definido'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Função</label>
                <p className="text-slate-900 font-medium">
                  {typeof user.role === 'string' ? user.role : user.role?.name || 'Não definida'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Departamento</label>
                <p className="text-slate-900 font-medium">
                  {user.departmentId ? `ID: ${user.departmentId}` : 'Não atribuído'}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Privilégios</label>
                <div className="flex flex-wrap gap-2">
                  {user.isDepartmentHead && (
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                      <Crown className="w-3 h-3 mr-1" />
                      Chefe de Departamento
                    </Badge>
                  )}
                  {user.isManager && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      <Shield className="w-3 h-3 mr-1" />
                      Gerente
                    </Badge>
                  )}
                  {!user.isManager && !user.isDepartmentHead && (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <UserCheck className="w-3 h-3 mr-1" />
                      Colaborador
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              Informações do Sistema
            </CardTitle>
            <CardDescription>
              Dados técnicos e de controle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-600">ID do Usuário</label>
                <p className="text-slate-900 font-mono text-sm">{user.id}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Data de Criação</label>
                <p className="text-slate-900 font-medium">{formatDate(user.createdAt)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Última Atualização</label>
                <p className="text-slate-900 font-medium">{formatDate(user.updatedAt)}</p>
              </div>
              
              {user.lastLoginAt && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Último Login</label>
                  <p className="text-slate-900 font-medium">{formatDate(user.lastLoginAt)}</p>
                </div>
              )}
              
              {user.managerId && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Gerente ID</label>
                  <p className="text-slate-900 font-mono text-sm">{user.managerId}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}