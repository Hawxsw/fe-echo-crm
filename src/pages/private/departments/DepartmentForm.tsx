import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDepartments, useUsers } from '@/hooks';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, UserPlus, X } from 'lucide-react';
import { IUser } from '@/types/user';
import { IDepartmentUser } from '@/types/department';
import { toast } from 'sonner';

export default function DepartmentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { getDepartment, createDepartment, updateDepartment, departments, loading, addUserToDepartment } = useDepartments();
  const { getAllUsers } = useUsers();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: '',
    color: '#3B82F6',
    icon: '🏢',
    position: 0,
  });

  const [availableUsers, setAvailableUsers] = useState<IUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<(IUser | IDepartmentUser & { role?: string })[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  useEffect(() => {
    // Carregar usuários disponíveis
    getAllUsers().then((users) => {
      // Garantir que users seja um array
      let usersArray: IUser[] = [];
      if (Array.isArray(users)) {
        usersArray = users;
      } else if (users && typeof users === 'object' && 'data' in users && Array.isArray((users as any).data)) {
        // Se a resposta estiver em um wrapper { data: [...] }
        usersArray = (users as any).data;
      } else {
        usersArray = [];
      }
      
      setAvailableUsers(usersArray);
    }).catch((error) => {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
      setAvailableUsers([]); // Garantir que seja um array vazio em caso de erro
    });
  }, [getAllUsers]);

  useEffect(() => {
    if (isEditing && id) {
      getDepartment(id).then((dept) => {
        setFormData({
          name: dept.name,
          description: dept.description || '',
          parentId: dept.parentId || '',
          color: dept.color || '#3B82F6',
          icon: dept.icon || '🏢',
          position: dept.position,
        });
        // Se tiver usuários no departamento, adicionar aos selecionados
        if (dept.users && dept.users.length > 0) {
          const usersWithRole = dept.users.map(user => ({
            ...user,
            role: user.isDepartmentHead ? 'supervisor' : 'colaborador'
          }));
          setSelectedUsers(usersWithRole);
        }
      });
    }
  }, [id, isEditing, getDepartment]);

  const handleAddUser = () => {
    if (!selectedUserId) return;

    const user = availableUsers.find(u => u.id === selectedUserId);
    if (user && !selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
      setSelectedUserId('');
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        parentId: formData.parentId || undefined,
        description: formData.description || undefined,
      };

      let departmentId = id;

      if (isEditing && id) {
        await updateDepartment(id, data);
        toast.success('Departamento atualizado com sucesso!');
      } else {
        const newDept = await createDepartment(data);
        departmentId = newDept.id;
        toast.success('Departamento criado com sucesso!');
      }

      // Adicionar usuários ao departamento
      if (departmentId && selectedUsers.length > 0) {
        
        try {
          for (const user of selectedUsers) {
            await addUserToDepartment({
              departmentId,
              userId: user.id,
              isDepartmentHead: (user as any).role === 'supervisor',
              isManager: (user as any).role === 'supervisor',
            });
          }
          toast.success(`${selectedUsers.length} membro(s) adicionado(s) ao departamento`);
        } catch (error) {
          console.error('Erro ao adicionar usuários:', error);
          toast.error('Erro ao adicionar alguns membros ao departamento');
        }
      }
      
      // Aguardar um pouco antes de navegar para garantir que as operações foram concluídas
      setTimeout(() => {
        navigate('/dashboard/organizational-structure');
      }, 1000);
    } catch (error: any) {
      console.error('Erro ao salvar departamento:', error);
      toast.error(error?.response?.data?.message || 'Erro ao salvar departamento');
    }
  };

  return (
    <div className="space-y-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/organizational-structure')}
            className="shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              {isEditing ? 'Editar Departamento' : 'Novo Departamento'}
            </h1>
            <p className="text-muted-foreground mt-2 text-base font-light">
              {isEditing ? 'Atualize as informações do departamento' : 'Crie um novo departamento na estrutura'}
            </p>
          </div>
        </div>
        <div className="absolute -top-1 -left-1 w-20 h-20 bg-primary/5 rounded-full blur-3xl -z-10" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Informações do Departamento</CardTitle>
            <CardDescription className="text-sm mt-1">
              Preencha os dados do departamento
            </CardDescription>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Departamento *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Tecnologia da Informação"
                  required
                />
              </div>

              {/* Departamento Pai */}
              <div className="space-y-2">
                <Label htmlFor="parentId">Departamento Pai (opcional)</Label>
                <select
                  id="parentId"
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Nenhum (departamento raiz)</option>
                  {departments
                    .filter(d => d.id !== id) // Não mostrar ele mesmo
                    .map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {'  '.repeat(dept.level)} {dept.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Descrição */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do departamento..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cor */}
              <div className="space-y-2">
                <Label htmlFor="color">Cor do Departamento</Label>
                <div className="relative">
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="appearance-none bg-white border border-slate-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    <option value="#3B82F6">🔵 Azul</option>
                    <option value="#1E40AF">🔷 Azul Escuro</option>
                    <option value="#60A5FA">🔹 Azul Claro</option>
                    <option value="#10B981">🟢 Verde</option>
                    <option value="#059669">🟢 Verde Escuro</option>
                    <option value="#34D399">🟢 Verde Claro</option>
                    <option value="#F59E0B">🟡 Amarelo</option>
                    <option value="#D97706">🟡 Laranja Escuro</option>
                    <option value="#FCD34D">🟡 Amarelo Claro</option>
                    <option value="#EF4444">🔴 Vermelho</option>
                    <option value="#DC2626">🔴 Vermelho Escuro</option>
                    <option value="#F87171">🔴 Vermelho Claro</option>
                    <option value="#8B5CF6">🟣 Roxo</option>
                    <option value="#7C3AED">🟣 Roxo Escuro</option>
                    <option value="#A78BFA">🟣 Roxo Claro</option>
                    <option value="#06B6D4">🔵 Ciano</option>
                    <option value="#0891B2">🔵 Ciano Escuro</option>
                    <option value="#67E8F9">🔵 Ciano Claro</option>
                    <option value="#84CC16">🟢 Lima</option>
                    <option value="#65A30D">🟢 Lima Escuro</option>
                    <option value="#A3E635">🟢 Lima Claro</option>
                    <option value="#F97316">🟠 Laranja</option>
                    <option value="#EA580C">🟠 Laranja Escuro</option>
                    <option value="#FB923C">🟠 Laranja Claro</option>
                    <option value="#EC4899">🩷 Rosa</option>
                    <option value="#DB2777">🩷 Rosa Escuro</option>
                    <option value="#F472B6">🩷 Rosa Claro</option>
                    <option value="#6366F1">🔵 Índigo</option>
                    <option value="#4F46E5">🔵 Índigo Escuro</option>
                    <option value="#818CF8">🔵 Índigo Claro</option>
                    <option value="#14B8A6">🟢 Turquesa</option>
                    <option value="#0D9488">🟢 Turquesa Escuro</option>
                    <option value="#5EEAD4">🟢 Turquesa Claro</option>
                    <option value="#F43F5E">🔴 Magenta</option>
                    <option value="#E11D48">🔴 Magenta Escuro</option>
                    <option value="#FB7185">🔴 Magenta Claro</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Ícone */}
              <div className="space-y-2">
                <Label htmlFor="icon">Ícone do Departamento</Label>
                <div className="relative">
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="appearance-none bg-white border border-slate-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    <option value="🏢">🏢 Edifício</option>
                    <option value="🏗️">🏗️ Construção</option>
                    <option value="🏭">🏭 Indústria</option>
                    <option value="💻">💻 Tecnologia</option>
                    <option value="💾">💾 Dados</option>
                    <option value="🌐">🌐 Web</option>
                    <option value="🤖">🤖 IA/ML</option>
                    <option value="📱">📱 Mobile</option>
                    <option value="💼">💼 Negócios</option>
                    <option value="📈">📈 Crescimento</option>
                    <option value="📊">📊 Analytics</option>
                    <option value="📋">📋 Gestão</option>
                    <option value="🎯">🎯 Marketing</option>
                    <option value="📢">📢 Comunicação</option>
                    <option value="📺">📺 Mídia</option>
                    <option value="💰">💰 Financeiro</option>
                    <option value="💳">💳 Pagamentos</option>
                    <option value="📊">📊 Contabilidade</option>
                    <option value="👥">👥 Recursos Humanos</option>
                    <option value="👨‍💼">👨‍💼 Recrutamento</option>
                    <option value="🎓">🎓 Treinamento</option>
                    <option value="🚀">🚀 Inovação</option>
                    <option value="💡">💡 Ideias</option>
                    <option value="🔬">🔬 Pesquisa</option>
                    <option value="🔧">🔧 Operações</option>
                    <option value="⚙️">⚙️ Manutenção</option>
                    <option value="🛠️">🛠️ Ferramentas</option>
                    <option value="📞">📞 Atendimento</option>
                    <option value="🎧">🎧 Suporte</option>
                    <option value="💬">💬 Chat</option>
                    <option value="🏥">🏥 Saúde</option>
                    <option value="🏥">🏥 Médico</option>
                    <option value="💊">💊 Farmácia</option>
                    <option value="🎓">🎓 Educação</option>
                    <option value="📚">📚 Biblioteca</option>
                    <option value="🎨">🎨 Design</option>
                    <option value="🎭">🎭 Criatividade</option>
                    <option value="🖼️">🖼️ Arte</option>
                    <option value="⚡">⚡ Energia</option>
                    <option value="🔋">🔋 Bateria</option>
                    <option value="🌱">🌱 Sustentabilidade</option>
                    <option value="📦">📦 Logística</option>
                    <option value="🚚">🚚 Transporte</option>
                    <option value="📮">📮 Entrega</option>
                    <option value="🛡️">🛡️ Segurança</option>
                    <option value="🔐">🔐 Privacidade</option>
                    <option value="👮">👮 Proteção</option>
                    <option value="🏆">🏆 Qualidade</option>
                    <option value="⭐">⭐ Excelência</option>
                    <option value="🎖️">🎖️ Certificação</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Posição */}
              <div className="space-y-2">
                <Label htmlFor="position">Posição no Organograma</Label>
                <div className="relative">
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                    className="appearance-none bg-white border border-slate-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    <option value={0}>🥇 Primeiro (0)</option>
                    <option value={1}>🥈 Segundo (1)</option>
                    <option value={2}>🥉 Terceiro (2)</option>
                    <option value={3}>4º Quarto (3)</option>
                    <option value={4}>5º Quinto (4)</option>
                    <option value={5}>6º Sexto (5)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Menor número = aparece primeiro</p>
              </div>
            </div>

            {/* Membros do Departamento */}
            <div className="space-y-4 pt-6 border-t">
              <div>
                <Label className="text-base font-semibold">Membros do Departamento</Label>
                <p className="text-sm text-slate-600 mt-1">
                  👥 Adicione os membros e defina quem é supervisor e quem é colaborador
                </p>
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um membro...</option>
                  {Array.isArray(availableUsers) && availableUsers
                    .filter(user => !selectedUsers.find(u => u.id === user.id))
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </option>
                    ))}
                </select>
                <Button
                  type="button"
                  onClick={handleAddUser}
                  disabled={!selectedUserId}
                  variant="outline"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {/* Lista de membros selecionados */}
              {selectedUsers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    {selectedUsers.length} membro(s) selecionado(s):
                  </p>
                  <div className="space-y-3">
                    {selectedUsers.map((user, index) => (
                      <div
                        key={user.id}
                        className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-semibold text-blue-600">
                                {user.firstName[0]}{user.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-slate-600">{user.email}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveUser(user.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* Seleção de função */}
                        <div className="flex items-center gap-4">
                          <Label className="text-sm font-medium text-slate-700">
                            Função no departamento:
                          </Label>
                          <div className="flex gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`role-${user.id}`}
                                value="colaborador"
                                checked={(user as any).role === 'colaborador'}
                                className="w-4 h-4 text-blue-600"
                                onChange={() => {
                                  // Atualizar o tipo de usuário
                                  const updatedUsers = [...selectedUsers];
                                  updatedUsers[index] = { ...user, role: 'colaborador' };
                                  setSelectedUsers(updatedUsers);
                                }}
                              />
                              <span className="text-sm text-slate-700">👤 Colaborador</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`role-${user.id}`}
                                value="supervisor"
                                checked={(user as any).role === 'supervisor'}
                                className="w-4 h-4 text-blue-600"
                                onChange={() => {
                                  // Atualizar o tipo de usuário
                                  const updatedUsers = [...selectedUsers];
                                  updatedUsers[index] = { ...user, role: 'supervisor' };
                                  setSelectedUsers(updatedUsers);
                                }}
                              />
                              <span className="text-sm text-slate-700">👑 Supervisor</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/organizational-structure')}
                className="shadow-sm hover:shadow-md transition-all duration-200"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Departamento'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}

