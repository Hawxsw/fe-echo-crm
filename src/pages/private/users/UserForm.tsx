import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, User, Building, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useUsers } from '@/hooks/useUsers';
import { useRoles } from '@/hooks/useRoles';
import { useDepartments } from '@/hooks/useDepartments';
import { routes } from '@/routes/routes';
import { ICreateUser, IUpdateUser } from '@/types/user';

interface UserFormProps {
  mode: 'create' | 'edit';
}

export const UserForm = ({ mode }: UserFormProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    createUser, 
    updateUser, 
    getUserById, 
    loading: usersLoading 
  } = useUsers();
  const { roles, loading: rolesLoading } = useRoles();
  const { departments, loading: departmentsLoading } = useDepartments();

  const [formData, setFormData] = useState<ICreateUser | IUpdateUser>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    position: '',
    roleId: '',
    departmentId: '',
    isActive: true,
    isManager: false,
    isDepartmentHead: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && id) {
      loadUser();
    }
  }, [mode, id]);

  const loadUser = async () => {
    try {
      const user = await getUserById(id!);
      if (user) {
        setFormData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          position: user.position || '',
          roleId: user.roleId || '',
          departmentId: user.departmentId || '',
          isActive: user.isActive,
          isManager: user.isManager,
          isDepartmentHead: user.isDepartmentHead,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'Nome é obrigatório';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (mode === 'create' && !(formData as ICreateUser).password) {
      newErrors.password = 'Senha é obrigatória';
    }

    if (!formData.roleId) {
      newErrors.roleId = 'Função é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (mode === 'create') {
        await createUser(formData as ICreateUser);
      } else {
        await updateUser(id!, formData as IUpdateUser);
      }
      
      navigate(routes.dashboard.routes.users.path);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  if (usersLoading || rolesLoading || departmentsLoading) {
    return (
      <div className="space-y-8 pb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mb-4"></div>
          <p className="text-muted-foreground font-medium">Carregando...</p>
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
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(routes.dashboard.routes.users.path)}
            className="shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              {mode === 'create' ? 'Novo Usuário' : 'Editar Usuário'}
            </h1>
            <p className="text-muted-foreground mt-2 text-base font-light">
              {mode === 'create' 
                ? 'Preencha os dados para criar um novo usuário'
                : 'Atualize as informações do usuário'
              }
            </p>
          </div>
        </div>
        <div className="absolute -top-1 -left-1 w-20 h-20 bg-primary/5 rounded-full blur-3xl -z-10" />
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Pessoais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nome *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Nome"
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Sobrenome *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Sobrenome"
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@exemplo.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {mode === 'create' && (
                <div>
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={(formData as ICreateUser).password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Senha"
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="position">Cargo</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="Ex: Desenvolvedor Full Stack"
                />
              </div>
            </CardContent>
          </Card>
          </motion.div>

          {/* Organizacional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                    <Building className="w-5 h-5 text-green-600" />
                  </div>
                  Organizacional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div>
                <Label htmlFor="roleId">Função *</Label>
                <Select
                  value={formData.roleId}
                  onValueChange={(value) => handleInputChange('roleId', value)}
                >
                  <SelectTrigger className={errors.roleId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roleId && (
                  <p className="text-sm text-red-500 mt-1">{errors.roleId}</p>
                )}
              </div>

              <div>
                <Label htmlFor="departmentId">Departamento</Label>
                <Select
                  value={formData.departmentId || undefined}
                  onValueChange={(value) => handleInputChange('departmentId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sem departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          {/* Configurações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  Configurações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isActive">Usuário Ativo</Label>
                  <p className="text-sm text-gray-500">
                    Usuário pode fazer login no sistema
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isManager">É Gerente</Label>
                  <p className="text-sm text-gray-500">
                    Usuário tem privilégios de gerente
                  </p>
                </div>
                <Switch
                  id="isManager"
                  checked={formData.isManager}
                  onCheckedChange={(checked) => handleInputChange('isManager', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isDepartmentHead">Chefe de Departamento</Label>
                  <p className="text-sm text-gray-500">
                    Usuário é chefe do departamento
                  </p>
                </div>
                <Switch
                  id="isDepartmentHead"
                  checked={formData.isDepartmentHead}
                  onCheckedChange={(checked) => handleInputChange('isDepartmentHead', checked)}
                />
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-end gap-4"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(routes.dashboard.routes.users.path)}
            className="shadow-sm hover:shadow-md transition-all duration-200"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações'}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default UserForm;