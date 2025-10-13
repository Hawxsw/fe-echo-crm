import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Users,
  Crown,
  UserPlus,
  Edit,
  Trash2,
  Building2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { IDepartment } from '@/types/department';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  position?: string | null;
  isManager?: boolean;
  isDepartmentHead?: boolean;
  avatar?: string | null;
  sortOrder?: number | null;
}

interface OrganizationalChartProps {
  departments: IDepartment[];
  onAddDepartment?: (parentId?: string) => void;
  onEditDepartment?: (department: IDepartment) => void;
  onDeleteDepartment?: (departmentId: string) => void;
  onAddUser?: (departmentId: string) => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
}

export const OrganizationalChart = ({
  departments,
  onAddDepartment,
  onEditDepartment,
  onDeleteDepartment,
  onAddUser,
  onEditUser,
  onDeleteUser,
}: OrganizationalChartProps) => {
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const toggleExpanded = (departmentId: string) => {
    setExpandedDepartments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(departmentId)) {
        newSet.delete(departmentId);
      } else {
        newSet.add(departmentId);
      }
      return newSet;
    });
  };

  const getDepartmentColor = (department: IDepartment) => {
    if (department.color) return department.color;
    
    const colors = [
      '#3B82F6',
      '#10B981',
      '#8B5CF6',
      '#F59E0B',
      '#EC4899',
      '#6366F1',
      '#14B8A6',
      '#EF4444',
    ];
    
    return colors[department.level % colors.length];
  };

  const renderDepartment = (department: IDepartment, depth = 0) => {
    const isExpanded = expandedDepartments.has(department.id);
    const hasChildren = department.children && department.children.length > 0;
    const isSelected = selectedDepartment === department.id;
    const totalUsers = department._count?.users || 0;
    const departmentColor = getDepartmentColor(department);

    return (
      <motion.div
        key={department.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: depth * 0.1 }}
        className="mb-4"
      >
        <div
          className={`relative group cursor-pointer transition-all duration-200 ${
            isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
          }`}
          onClick={() => setSelectedDepartment(department.id)}
        >
          <Card className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${
            isSelected ? 'shadow-lg' : 'hover:shadow-md'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Ícone de expansão */}
                  {hasChildren && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpanded(department.id);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  )}

                  {!hasChildren && <div className="w-6" />}

                  {/* Ícone do departamento */}
                  <div className={`h-10 w-10 rounded-lg ${departmentColor} flex items-center justify-center text-white font-semibold`}>
                    {department.icon ? (
                      <span className="text-lg">{department.icon}</span>
                    ) : (
                      <Building2 className="h-5 w-5" />
                    )}
                  </div>

                  {/* Informações do departamento */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {department.name}
                      </h3>
                      {department.users?.some(user => user.isDepartmentHead) && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    
                    {department.description && (
                      <p className="text-sm text-gray-600 truncate">
                        {department.description}
                      </p>
                    )}

                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {totalUsers} colaboradores
                        </span>
                      </div>
                      
                      {hasChildren && (
                        <span className="text-sm text-gray-600">
                          {department.children?.length || 0} departamentos
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Menu de ações */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddUser?.(department.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações do Departamento</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEditDepartment?.(department)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Departamento
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAddDepartment?.(department.id)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Sub-departamento
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => onDeleteDepartment?.(department.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir Departamento
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Lista de usuários */}
              {department.users && department.users.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {department.users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 group/user"
                      >
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-semibold">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            `${user.firstName[0]}${user.lastName[0]}`
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium text-gray-900 truncate">
                            {user.firstName} {user.lastName}
                          </span>
                          {user.isDepartmentHead && (
                            <Crown className="h-3 w-3 text-yellow-500" />
                          )}
                            {user.isManager && (
                              <Badge variant="secondary" className="text-xs">
                                Gerente
                              </Badge>
                            )}
                          </div>
                          {user.position && (
                            <p className="text-xs text-gray-600 truncate">
                              {user.position}
                            </p>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover/user:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações do Usuário</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEditUser?.(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar Usuário
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => onDeleteUser?.(user.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir Usuário
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sub-departamentos */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="ml-8 mt-2 space-y-2"
            >
              {department.children?.map(child => renderDepartment(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {departments.map(department => renderDepartment(department))}
    </div>
  );
};
