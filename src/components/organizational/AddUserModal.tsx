import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUsers, useDepartments } from '@/hooks';
import { IUser } from '@/types/user';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string;
  allDepartmentUsers: string[];
  onUserAdded: () => void;
}

export const AddUserModal = ({
  isOpen,
  onClose,
  departmentId,
  allDepartmentUsers = [],
  onUserAdded,
}: AddUserModalProps) => {
  const { getAllUsers } = useUsers();
  const { addUserToDepartment } = useDepartments();
  const [availableUsers, setAvailableUsers] = useState<IUser[]>([]);
  const [addingUsers, setAddingUsers] = useState<Set<string>>(new Set());
  const [selectedRole, setSelectedRole] = useState<'colaborador' | 'supervisor'>('colaborador');

  useEffect(() => {
    if (isOpen) {
      getAllUsers().then((users) => {
        let usersArray: IUser[] = [];
        if (Array.isArray(users)) {
          usersArray = users;
        } else if (users && typeof users === 'object' && 'data' in users && Array.isArray((users as any).data)) {
          usersArray = (users as any).data;
        } else {
          usersArray = [];
        }
        
        const availableUsersFiltered = usersArray.filter(user => 
          !allDepartmentUsers.includes(user.id) && user.position !== 'CEO'
        );
        
        setAvailableUsers(availableUsersFiltered);
      }).catch((error) => {
        console.error('Erro ao carregar usuários:', error);
        toast.error('Erro ao carregar usuários');
        setAvailableUsers([]);
      });
    }
  }, [isOpen, getAllUsers]);

  const handleAddUser = async (userId: string) => {
    setAddingUsers(prev => new Set(prev).add(userId));
    
    try {
      await addUserToDepartment({
        departmentId,
        userId,
        isDepartmentHead: selectedRole === 'supervisor',
        isManager: selectedRole === 'supervisor',
      });

      const roleText = selectedRole === 'supervisor' ? 'Supervisor' : 'Colaborador';
      toast.success(`${roleText} adicionado com sucesso!`);
      onUserAdded();
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      toast.error('Erro ao adicionar colaborador');
    } finally {
      setAddingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Colaboradores Disponíveis
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">Função padrão:</span>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="colaborador"
                  checked={selectedRole === 'colaborador'}
                  onChange={() => setSelectedRole('colaborador')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-slate-700">👤 Colaborador</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="supervisor"
                  checked={selectedRole === 'supervisor'}
                  onChange={() => setSelectedRole('supervisor')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-slate-700">👑 Supervisor</span>
              </label>
            </div>
          </div>
        </div>

        <div className="px-2 py-4">
          {availableUsers.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              <UserPlus className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Nenhum colaborador disponível
            </div>
          ) : (
            <div className="space-y-1">
              {availableUsers.map((user) => {
                const isAdding = addingUsers.has(user.id);
                
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-all duration-200 group"
                    onClick={() => !isAdding && handleAddUser(user.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 ring-2 ring-slate-100 group-hover:ring-blue-200 transition-all">
                        <AvatarImage 
                          src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=3b82f6&color=fff&size=128`} 
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-slate-900 group-hover:text-blue-900 transition-colors">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {isAdding ? (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-all">
                        <UserPlus className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
