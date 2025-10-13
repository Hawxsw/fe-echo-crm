import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDepartments } from '@/hooks';
import { IDepartment } from '@/types/department';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Building2,
  Crown,
  UserPlus,
  Network,
  ChevronRight,
  Activity,
} from 'lucide-react';

export default function DepartmentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getDepartment, deleteDepartment, loading } = useDepartments();
  
  const [department, setDepartment] = useState<IDepartment | null>(null);

  useEffect(() => {
    if (id) {
      getDepartment(id).then(setDepartment).catch(console.error);
    }
  }, [id, getDepartment]);

  const handleDelete = async () => {
    if (!department) return;
    
    if (window.confirm(`Tem certeza que deseja excluir "${department.name}"?`)) {
      try {
        await deleteDepartment(department.id);
        navigate('/dashboard/organizational-structure');
      } catch (error) {
        console.error('Erro ao excluir:', error);
      }
    }
  };

  if (loading || !department) {
    return (
      <div className="space-y-8 pb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mb-4"></div>
          <p className="text-muted-foreground font-medium">Carregando departamento...</p>
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
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard/organizational-structure')}
              className="shadow-sm hover:shadow-md transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: department.color || '#3B82F6' }}
              >
                {department.icon || '🏢'}
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {department.name}
                </h1>
                {department.description && (
                  <p className="text-muted-foreground mt-1 text-base">{department.description}</p>
                )}
              </div>
            </div>
          </div>
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <Button
              variant="outline"
              onClick={() => navigate(`/dashboard/departments/edit/${department.id}`)}
              className="shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 shadow-sm hover:shadow-md transition-all duration-200"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </motion.div>
        </div>
        <div className="absolute -top-1 -left-1 w-20 h-20 bg-primary/5 rounded-full blur-3xl -z-10" />
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nível</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 transition-transform duration-300 group-hover:scale-110">
                <Network className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                Nível {department.level}
              </p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Colaboradores</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 transition-transform duration-300 group-hover:scale-110">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {department._count?.users || 0}
              </p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Subdepartamentos</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 transition-transform duration-300 group-hover:scale-110">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {department._count?.children || 0}
              </p>
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
            <div className={`absolute inset-0 bg-gradient-to-br ${department.isActive ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500'} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${department.isActive ? 'from-green-500/20 to-emerald-500/20' : 'from-red-500/20 to-rose-500/20'} transition-transform duration-300 group-hover:scale-110`}>
                <Activity className={`h-5 w-5 ${department.isActive ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardHeader>
            <CardContent>
              <Badge className={`${department.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} text-sm py-1.5 px-3`}>
                {department.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Departamento Pai */}
      {department.parent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                Departamento Pai
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => navigate(`/dashboard/departments/${department.parent?.id}`)}
                className="flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {department.parent.name}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Colaboradores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                Colaboradores ({department.users?.length || 0})
              </CardTitle>
              <Button 
                size="sm" 
                className="shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => navigate(`/dashboard/departments/edit/${department.id}`)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Adicionar Colaborador
              </Button>
            </div>
            <CardDescription className="text-sm mt-1">
              Membros deste departamento
            </CardDescription>
          </CardHeader>
          <CardContent>
          {department.users && department.users.length > 0 ? (
            <div className="space-y-3">
              {department.users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900 flex items-center gap-2">
                        {user.firstName} {user.lastName}
                        {user.isDepartmentHead && (
                          <Crown className="w-4 h-4 text-yellow-600" />
                        )}
                      </p>
                      <p className="text-sm text-slate-600">
                        {user.position || 'Sem cargo definido'}
                      </p>
                      {user.manager && (
                        <p className="text-xs text-slate-500">
                          Reporta para: {user.manager.firstName} {user.manager.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.isManager && (
                      <Badge variant="outline" className="text-purple-600">
                        Gerente
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>Nenhum colaborador neste departamento</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subdepartamentos */}
      {department.children && department.children.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                  <Network className="w-5 h-5 text-purple-600" />
                </div>
                Subdepartamentos ({department.children.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {department.children.map((child) => (
                <div
                  key={child.id}
                  onClick={() => navigate(`/dashboard/departments/${child.id}`)}
                  className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer border-l-4"
                  style={{ borderLeftColor: child.color || '#3B82F6' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{child.icon || '🏢'}</span>
                    <h3 className="font-semibold text-slate-900">{child.name}</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{child.description || 'Sem descrição'}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Users className="w-3 h-3" />
                    {child._count?.users || 0} colaboradores
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </motion.div>
      )}
      </motion.div>
    </div>
  );
}

