import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HierarchicalOrgChart } from '@/components/organizational/HierarchicalOrgChart';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { AddUserModal } from '@/components/organizational/AddUserModal';
import { useOrganizationalStructure } from '@/hooks/useOrganizationalStructure';
import { useDepartments } from '@/hooks/useDepartments';
import { useUsers } from '@/hooks/useUsers';
import { toast } from '@/components/ui/toaster';
import {
  Plus,
  Search,
  Building2,
  Users,
  Settings,
  Crown,
  UserPlus,
  Network,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { IDepartment } from '@/types/department';

export default function OrganizationalStructure() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [removeUserModal, setRemoveUserModal] = useState({
    open: false,
    userId: '',
    userName: '',
    departmentName: '',
  });

  const [deleteDepartmentModal, setDeleteDepartmentModal] = useState({
    open: false,
    departmentId: '',
    departmentName: '',
    hasUsers: false,
    userCount: 0,
  });

  const [addUserModal, setAddUserModal] = useState({
    open: false,
    departmentId: '',
    departmentName: '',
  });
  
  const [ceoUser, setCeoUser] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  
  const {
    departments,
    loading,
    getOrganizationalStructure,
    deleteDepartment,
  } = useOrganizationalStructure();

  const { removeUserFromDepartment } = useDepartments();
  const { getAllUsers } = useUsers();

  useEffect(() => {
    getOrganizationalStructure();
  }, [getOrganizationalStructure]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers(1, 100); // Buscar todos os usuários
        const ceo = users.find(user => user.position === 'CEO');
        setCeoUser(ceo || null);
        setAllUsers(users);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };
    
    fetchUsers();
  }, [getAllUsers]);

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDepartment = () => {
    navigate('/dashboard/departments/new');
  };

  const handleEditDepartment = (department: IDepartment) => {
    navigate(`/dashboard/departments/edit/${department.id}`);
  };

  const handleDeleteDepartment = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (!department) {
      return;
    }

    const hasUsers = !!(department.users && department.users.length > 0);
    const userCount = department.users?.length || 0;

    setDeleteDepartmentModal({
      open: true,
      departmentId,
      departmentName: department.name,
      hasUsers,
      userCount,
    });
  };


  const confirmDeleteDepartment = async () => {
    try {
      await deleteDepartment(deleteDepartmentModal.departmentId);
    } catch (error: any) {
      console.error('Erro ao excluir departamento:', error);
      
      if (error?.response?.data?.message?.includes('colaboradores')) {
        alert(error.response.data.message);
      } else {
        alert('Erro ao excluir departamento. Tente novamente.');
      }
    }
  };

  const handleAddUser = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (department) {
      setAddUserModal({
        open: true,
        departmentId,
        departmentName: department.name,
      });
    }
  };

  const handleEditUser = async (_user: any) => {

  };

  const handleDeleteUser = (userId: string) => {
    const departmentWithUser = departments.find(dept => 
      dept.users?.some(user => user.id === userId)
    );
    
    if (!departmentWithUser) {
      return;
    }

    const user = departmentWithUser.users?.find(u => u.id === userId);
    const userName = user ? `${user.firstName} ${user.lastName}` : 'este usuário';
    
    setRemoveUserModal({
      open: true,
      userId,
      userName,
      departmentName: departmentWithUser.name,
    });
  };

  const confirmRemoveUser = async () => {
    try {
      const departmentWithUser = departments.find(dept => 
        dept.users?.some(user => user.id === removeUserModal.userId)
      );
      
      if (!departmentWithUser) {
        return;
      }

      await removeUserFromDepartment(departmentWithUser.id, removeUserModal.userId);
      await getOrganizationalStructure();
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Organograma Hierárquico
            </h1>
            <p className="text-muted-foreground mt-2 text-base font-light">
              Visualize e gerencie a estrutura organizacional em formato de árvore
            </p>
          </div>
        </motion.div>
        
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
                  <div className="h-12 w-12 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-2xl" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg mb-2" />
                  <div className="h-3 w-24 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
                <p className="text-muted-foreground font-medium">Carregando estrutura organizacional...</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Organograma Hierárquico
          </h1>
          <p className="text-muted-foreground mt-2 text-base font-light">
            Visualize e gerencie a estrutura organizacional em formato de árvore
          </p>
          <div className="absolute -top-1 -left-1 w-20 h-20 bg-primary/5 rounded-full blur-3xl -z-10" />
        </div>
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <Button 
            variant="outline"
            className="shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => {
              toast.info('⚙️ Funcionalidade de configurações será implementada em breve!');
            }}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          <Button 
            onClick={() => handleAddDepartment()}
            className="shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Departamento
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Departamentos</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 transition-transform duration-300 group-hover:scale-110">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {departments.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Estrutura organizacional
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Colaboradores</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 transition-transform duration-300 group-hover:scale-110">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {departments.reduce((total, dept) => total + (dept._count?.users || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Pessoas na organização
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
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gerentes</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 transition-transform duration-300 group-hover:scale-110">
                <Crown className="h-6 w-6 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {departments.reduce((total, dept) => 
                  total + (dept.users?.filter(user => user.isManager).length || 0), 0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Liderança ativa
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
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Níveis Hierárquicos</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 transition-transform duration-300 group-hover:scale-110">
                <Network className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {departments.length > 0 ? Math.max(...departments.map(dept => dept.level)) + 1 : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Profundidade da estrutura
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {departments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5" />
            <CardContent className="p-16 relative">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="inline-block p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl mb-6"
                >
                  <Building2 className="h-20 w-20 text-primary mx-auto" />
                </motion.div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-3">
                  Nenhuma estrutura organizacional criada
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Comece criando departamentos e adicionando colaboradores para construir sua estrutura organizacional.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={() => handleAddDepartment()}
                    className="shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Departamento
                  </Button>
                  <Button 
                    variant="outline"
                    className="shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={() => {
                      toast.warning('👥 Primeiro crie um departamento para adicionar colaboradores!');
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Colaborador
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Estrutura Organizacional
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    Clique nas caixas para expandir/colapsar e ver a hierarquia completa
                  </CardDescription>
                </div>
                <div className="relative w-full lg:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar departamentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full lg:w-80 shadow-sm focus:shadow-md transition-shadow duration-200"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <HierarchicalOrgChart
                departments={filteredDepartments}
                ceoUser={ceoUser}
                allUsers={allUsers}
                onAddDepartment={handleAddDepartment}
                onEditDepartment={handleEditDepartment}
                onDeleteDepartment={handleDeleteDepartment}
                onAddUser={handleAddUser}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="grid gap-6 md:grid-cols-3"
      >
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card 
            className="cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            onClick={() => handleAddDepartment()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base mb-1 group-hover:text-blue-600 transition-colors duration-200">
                    Criar Departamento
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Adicione um novo departamento à estrutura
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card 
            className="cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            onClick={() => {
              if (departments.length === 0) {
                toast.warning('👥 Primeiro crie um departamento para adicionar colaboradores!');
              } else {
                toast.success('🔄 Redirecionando para a página de usuários...');
                setTimeout(() => navigate('/dashboard/users'), 1000);
              }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UserPlus className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base mb-1 group-hover:text-green-600 transition-colors duration-200">
                    Adicionar Colaborador
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Inclua novos membros na organização
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card 
            className="cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            onClick={() => {
              toast.info('⚙️ Funcionalidade de configurações será implementada em breve!');
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Settings className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base mb-1 group-hover:text-purple-600 transition-colors duration-200">
                    Configurações
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Personalize cores, ícones e layout
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <ConfirmationDialog
        isOpen={removeUserModal.open}
        onClose={() => setRemoveUserModal(prev => ({ ...prev, open: false }))}
        title="Remover usuário"
        description={`Tem certeza que deseja remover ${removeUserModal.userName} do departamento ${removeUserModal.departmentName}?`}
        confirmText="Remover"
        cancelText="Cancelar"
        onConfirm={confirmRemoveUser}
        variant="destructive"
      />

      <ConfirmationDialog
        isOpen={deleteDepartmentModal.open}
        onClose={() => setDeleteDepartmentModal(prev => ({ ...prev, open: false }))}
        title="Excluir departamento"
        description={
          deleteDepartmentModal.hasUsers
            ? `Não é possível excluir o departamento "${deleteDepartmentModal.departmentName}" pois ele possui ${deleteDepartmentModal.userCount} usuário(s). Remova os usuários primeiro.`
            : `Tem certeza que deseja excluir o departamento "${deleteDepartmentModal.departmentName}"?`
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={confirmDeleteDepartment}
        variant="destructive"
      />

        <AddUserModal
          isOpen={addUserModal.open}
          onClose={() => setAddUserModal(prev => ({ ...prev, open: false }))}
          departmentId={addUserModal.departmentId}
          allDepartmentUsers={departments.flatMap(dept => dept.users?.map(user => user.id) || [])}
          onUserAdded={() => {
            getOrganizationalStructure(); // Recarregar dados
            setAddUserModal(prev => ({ ...prev, open: false }));
          }}
        />
    </div>
  );
}
