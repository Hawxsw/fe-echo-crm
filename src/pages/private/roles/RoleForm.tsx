import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Shield, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useRoles } from '@/hooks/useRoles';
import { routes } from '@/routes/routes';
import { ICreateRole, IUpdateRole, IPermission, PermissionAction, PermissionResource } from '@/types/role';
import { toast } from '@/components/ui/toaster';

interface RoleFormProps {
  mode: 'create' | 'edit';
}


const RESOURCES: Array<{ value: PermissionResource; label: string }> = [
  { value: 'USERS', label: 'Usuários' },
  { value: 'ROLES', label: 'Funções' },
  { value: 'KANBAN_BOARDS', label: 'Boards Kanban' },
  { value: 'KANBAN_CARDS', label: 'Cards Kanban' },
  { value: 'CHAT', label: 'Chat' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'REPORTS', label: 'Relatórios' },
];


const ACTIONS: Array<{ value: PermissionAction; label: string; description: string }> = [
  { value: 'CREATE', label: 'Criar', description: 'Criar novos registros' },
  { value: 'READ', label: 'Visualizar', description: 'Visualizar registros existentes' },
  { value: 'UPDATE', label: 'Atualizar', description: 'Editar registros existentes' },
  { value: 'DELETE', label: 'Excluir', description: 'Remover registros' },
  { value: 'MANAGE', label: 'Gerenciar', description: 'Acesso total ao recurso' },
];

export const RoleForm = ({ mode }: RoleFormProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    createRole, 
    updateRole, 
    getRoleById, 
    loading: rolesLoading 
  } = useRoles();

  const [formData, setFormData] = useState<ICreateRole | IUpdateRole>({
    name: '',
    description: '',
    permissions: [],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (mode === 'edit' && id) {
      loadRole();
    }
  }, [mode, id]);

  const loadRole = async () => {
    try {
      const role = await getRoleById(id!);
      if (role) {
        setFormData({
          name: role.name,
          description: role.description || '',
          permissions: role.permissions || [],
        });


        const permSet = new Set<string>();
        role.permissions?.forEach(perm => {
          permSet.add(`${perm.resource}-${perm.action}`);
        });
        setSelectedPermissions(permSet);
      }
    } catch (error) {
      console.error('Erro ao carregar função:', error);
      toast.error('Erro ao carregar função');
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

  const togglePermission = (resource: PermissionResource, action: PermissionAction) => {
    const key = `${resource}-${action}`;
    const newSelected = new Set(selectedPermissions);
    
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    
    setSelectedPermissions(newSelected);


    const permissions: IPermission[] = Array.from(newSelected).map(k => {
      const [res, act] = k.split('-');
      return {
        resource: res as PermissionResource,
        action: act as PermissionAction,
      };
    });

    setFormData(prev => ({
      ...prev,
      permissions,
    }));
  };

  const toggleAllActionsForResource = (resource: PermissionResource) => {
    const allActionsSelected = ACTIONS.every(action => 
      selectedPermissions.has(`${resource}-${action.value}`)
    );

    const newSelected = new Set(selectedPermissions);

    if (allActionsSelected) {

      ACTIONS.forEach(action => {
        newSelected.delete(`${resource}-${action.value}`);
      });
    } else {

      ACTIONS.forEach(action => {
        newSelected.add(`${resource}-${action.value}`);
      });
    }

    setSelectedPermissions(newSelected);


    const permissions: IPermission[] = Array.from(newSelected).map(k => {
      const [res, act] = k.split('-');
      return {
        resource: res as PermissionResource,
        action: act as PermissionAction,
      };
    });

    setFormData(prev => ({
      ...prev,
      permissions,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.permissions || formData.permissions.length === 0) {
      newErrors.permissions = 'Selecione pelo menos uma permissão';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'create') {
        await createRole(formData as ICreateRole);
        toast.success('Função criada com sucesso!');
      } else {
        await updateRole(id!, formData as IUpdateRole);
        toast.success('Função atualizada com sucesso!');
      }
      
      navigate(routes.dashboard.routes.roles.path);
    } catch (error) {
      console.error('Erro ao salvar função:', error);
      toast.error('Erro ao salvar função');
    } finally {
      setLoading(false);
    }
  };

  if (rolesLoading) {
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
            onClick={() => navigate(routes.dashboard.routes.roles.path)}
            className="shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              {mode === 'create' ? 'Nova Função' : 'Editar Função'}
            </h1>
            <p className="text-muted-foreground mt-2 text-base font-light">
              {mode === 'create' 
                ? 'Crie uma nova função com permissões personalizadas'
                : 'Atualize as informações e permissões da função'
              }
            </p>
          </div>
        </div>
        <div className="absolute -top-1 -left-1 w-20 h-20 bg-primary/5 rounded-full blur-3xl -z-10" />
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                Informações Básicas
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Defina o nome e descrição da função
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Função *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Gerente de Vendas"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva as responsabilidades desta função..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Permissões */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                Permissões
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Selecione as permissões que esta função terá
                {errors.permissions && (
                  <span className="text-red-500 ml-2">* {errors.permissions}</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {RESOURCES.map((resource) => {
                const allActionsSelected = ACTIONS.every(action => 
                  selectedPermissions.has(`${resource.value}-${action.value}`)
                );

                return (
                  <div 
                    key={resource.value} 
                    className="border-l-4 border-purple-500 pl-6 py-4 bg-slate-50 rounded-r-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {resource.label}
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAllActionsForResource(resource.value)}
                        className="text-xs"
                      >
                        {allActionsSelected ? (
                          <>
                            <Square className="w-4 h-4 mr-1" />
                            Desmarcar Todas
                          </>
                        ) : (
                          <>
                            <CheckSquare className="w-4 h-4 mr-1" />
                            Marcar Todas
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                      {ACTIONS.map((action) => {
                        const isSelected = selectedPermissions.has(
                          `${resource.value}-${action.value}`
                        );

                        return (
                          <button
                            key={action.value}
                            type="button"
                            onClick={() => togglePermission(resource.value, action.value)}
                            className={`
                              flex flex-col items-start p-3 rounded-lg border-2 transition-all
                              ${isSelected 
                                ? 'bg-purple-100 border-purple-500 shadow-md' 
                                : 'bg-white border-slate-200 hover:border-purple-300'
                              }
                            `}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-purple-600" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                              )}
                              <span className={`font-medium text-sm ${
                                isSelected ? 'text-purple-900' : 'text-slate-700'
                              }`}>
                                {action.label}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500 text-left">
                              {action.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Resumo das Permissões */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                  <CheckSquare className="w-5 h-5 text-green-600" />
                </div>
                Resumo
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Total de permissões selecionadas: {selectedPermissions.size}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedPermissions.size === 0 ? (
                <p className="text-slate-500 text-center py-4">
                  Nenhuma permissão selecionada
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {Array.from(selectedPermissions).map((key) => {
                    const [resource, action] = key.split('-');
                    const resourceLabel = RESOURCES.find(r => r.value === resource)?.label || resource;
                    const actionLabel = ACTIONS.find(a => a.value === action)?.label || action;
                    
                    return (
                      <div
                        key={key}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium border border-purple-200"
                      >
                        {actionLabel} {resourceLabel}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

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
            onClick={() => navigate(routes.dashboard.routes.roles.path)}
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
            {mode === 'create' ? 'Criar Função' : 'Salvar Alterações'}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default RoleForm;

