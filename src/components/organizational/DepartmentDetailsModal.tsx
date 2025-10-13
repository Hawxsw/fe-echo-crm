import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Crown,
  Building2,
  Users,
  UserPlus,
  Edit,
  Trash2,
  User,
  Mail,
} from 'lucide-react';

import { IDepartment } from '@/types/department';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  position?: string | null;
  isManager?: boolean;
  isDepartmentHead?: boolean;
  avatar?: string | null;
  sortOrder?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

interface DepartmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: IDepartment | null;
  ceoUser?: User | null;
  onAddUser?: (departmentId: string) => void;
  onEditDepartment?: (department: IDepartment) => void;
  onDeleteDepartment?: (departmentId: string) => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
}

export const DepartmentDetailsModal = ({
  isOpen,
  onClose,
  department,
  ceoUser,
  onAddUser,
  onEditDepartment,
  onDeleteDepartment,
  onEditUser,
  onDeleteUser,
}: DepartmentDetailsModalProps) => {
  if (!department) return null;

  // Para o departamento CEO, usar o CEO como chefe
  const departmentHead = department.id === 'ceo-structure' 
    ? null // Será tratado especialmente no modal
    : department.users?.find(user => user.isDepartmentHead);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[600px] lg:w-[700px] max-w-[90vw] overflow-y-auto overflow-x-hidden">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-xl font-bold truncate">{department.name}</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground truncate">
                {department.description || 'Sem descrição'}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Informações do Departamento - Apenas para departamentos normais */}
          {department.id !== 'ceo-structure' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Informações do Departamento</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditDepartment?.(department)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onDeleteDepartment?.(department.id);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Nível:</span>
                <p className="font-medium">{department.level}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Posição:</span>
                <p className="font-medium">{department.position}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total de Membros:</span>
                <p className="font-medium">{department.users?.length || 0}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Departamento Pai:</span>
                <p className="font-medium">{department.parentId ? 'Sim' : 'Não'}</p>
              </div>
            </div>
          </div>
          )}

          {/* Chefe do Departamento ou CEO */}
          {(departmentHead || (department.id === 'ceo-structure' && ceoUser)) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Crown className="h-5 w-5 text-orange-500" />
                  {department.id === 'ceo-structure' ? 'CEO' : 'Chefe do Departamento'}
                </h3>
                <Badge variant="default" className="bg-orange-500">
                  {department.id === 'ceo-structure' ? 'CEO' : 'Chefe'}
                </Badge>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={(department.id === 'ceo-structure' ? ceoUser : departmentHead)?.avatar || undefined} />
                    <AvatarFallback className="bg-orange-100 text-orange-700">
                      {getInitials(
                        (department.id === 'ceo-structure' ? ceoUser : departmentHead)?.firstName || '',
                        (department.id === 'ceo-structure' ? ceoUser : departmentHead)?.lastName || ''
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">
                      {(department.id === 'ceo-structure' ? ceoUser : departmentHead)?.firstName} {(department.id === 'ceo-structure' ? ceoUser : departmentHead)?.lastName}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {(department.id === 'ceo-structure' ? ceoUser : departmentHead)?.position || 'Sem cargo definido'}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{(department.id === 'ceo-structure' ? ceoUser : departmentHead)?.email}</span>
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const user = department.id === 'ceo-structure' ? ceoUser : departmentHead;
                      if (user) onEditUser?.(user as any);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}


          {/* Estrutura Organizacional para CEO ou Colaboradores para Departamentos */}
          {department.id === 'ceo-structure' ? (
            /* Estrutura de Departamentos para CEO */
          <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                Departamentos
              </h3>
              
              {department.children && department.children.length > 0 ? (
                <div className="space-y-4">
                  {department.children.map((dept) => (
                    <motion.div
                      key={dept.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-900">{dept.name}</h4>
                            <p className="text-sm text-blue-700">{dept.description || 'Sem descrição'}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {dept.users?.length || 0} membros
                        </Badge>
                      </div>
                      
                      {/* Chefe do Departamento */}
                      {dept.users?.find(user => user.isDepartmentHead) && (
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Crown className="h-4 w-4 text-orange-500" />
                            <span className="text-sm font-medium text-gray-700">Chefe:</span>
                          </div>
                          <div className="flex items-center gap-3 ml-6">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={dept.users.find(user => user.isDepartmentHead)?.avatar || undefined} />
                              <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">
                                {getInitials(
                                  dept.users.find(user => user.isDepartmentHead)?.firstName || '',
                                  dept.users.find(user => user.isDepartmentHead)?.lastName || ''
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {dept.users.find(user => user.isDepartmentHead)?.firstName} {dept.users.find(user => user.isDepartmentHead)?.lastName}
                              </p>
                              <p className="text-xs text-gray-600">
                                {dept.users.find(user => user.isDepartmentHead)?.position}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Colaboradores do Departamento */}
                      {dept.users && dept.users.filter(user => !user.isDepartmentHead).length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                              Colaboradores ({dept.users.filter(user => !user.isDepartmentHead).length}):
                            </span>
                          </div>
                          <div className="ml-6 space-y-1">
                            {dept.users.filter(user => !user.isDepartmentHead).slice(0, 3).map((user) => (
                              <div key={user.id} className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={user.avatar || undefined} />
                                  <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                                    {getInitials(user.firstName, user.lastName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-medium truncate">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {user.position}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {dept.users.filter(user => !user.isDepartmentHead).length > 3 && (
                              <p className="text-xs text-gray-500 ml-8">
                                +{dept.users.filter(user => !user.isDepartmentHead).length - 3} outros
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum departamento encontrado</p>
                </div>
              )}
            </div>
          ) : (
            /* Colaboradores para Departamentos Normais */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2 min-w-0">
                  <Users className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span className="truncate">Colaboradores ({department.users?.filter(user => !user.isDepartmentHead).length || 0})</span>
              </h3>
              <Button
                variant="outline"
                size="sm"
                  onClick={() => onAddUser?.(department.id || '')}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>

              {(department.users?.filter(user => !user.isDepartmentHead).length || 0) > 0 ? (
              <div className="space-y-3">
                {department.users?.filter(user => !user.isDepartmentHead).map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || undefined} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">
                          {user.firstName} {user.lastName}
                        </h4>
                          <p className="text-sm text-muted-foreground truncate">
                          {user.position || 'Sem cargo definido'}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                            onClick={() => onEditUser?.(user as any)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteUser?.(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum colaborador adicionado</p>
                <p className="text-sm">Clique em "Adicionar" para incluir colaboradores</p>
              </div>
            )}
          </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
