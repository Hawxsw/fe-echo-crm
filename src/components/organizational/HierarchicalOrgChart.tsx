import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Plus,
  MoreHorizontal,
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
import { DepartmentDetailsModal } from './DepartmentDetailsModal';

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

interface HierarchicalOrgChartProps {
  departments: IDepartment[];
  ceoUser?: User;
  allUsers?: User[];
  onAddDepartment?: (parentId?: string) => void;
  onEditDepartment?: (department: IDepartment) => void;
  onDeleteDepartment?: (departmentId: string) => void;
  onAddUser?: (departmentId: string) => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
}

interface OrgNode {
  id: string;
  name: string;
  type: 'ceo' | 'department' | 'user';
  level: number;
  position: number;
  parentId?: string;
  children: OrgNode[];
  user?: User;
  department?: IDepartment;
  isExpanded?: boolean;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Connection {
  from: string;
  to: string;
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
}

export const HierarchicalOrgChart = ({
  departments,
  ceoUser,
  allUsers = [],
  onAddDepartment,
  onEditDepartment,
  onDeleteDepartment,
  onAddUser,
  onEditUser,
  onDeleteUser,
}: HierarchicalOrgChartProps) => {
  const [selectedDepartment, setSelectedDepartment] = useState<IDepartment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_nodePositions, setNodePositions] = useState<Map<string, NodePosition>>(new Map());
  const [connections, setConnections] = useState<Connection[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const buildOrgTree = (): OrgNode[] => {
    const nodes: OrgNode[] = [];
    const nodeMap = new Map<string, OrgNode>();

    const ceoNode: OrgNode = {
      id: 'ceo',
      name: ceoUser ? `${ceoUser.firstName} ${ceoUser.lastName}` : 'CEO',
      type: 'ceo',
      level: 0,
      position: 0,
      children: [],
      isExpanded: true,
      user: ceoUser,
    };
    nodes.push(ceoNode);
    nodeMap.set('ceo', ceoNode);

    departments.forEach((dept) => {
      const deptNode: OrgNode = {
        id: dept.id,
        name: dept.name,
        type: 'department',
        level: dept.level + 1,
        position: dept.position,
        parentId: dept.parentId || 'ceo',
        children: [],
        department: dept,
        isExpanded: true,
      };
      nodeMap.set(dept.id, deptNode);
    });

    nodeMap.forEach((node) => {
      if (node.parentId && node.parentId !== node.id) {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.children.push(node);
        } else if (node.parentId === 'ceo') {
          ceoNode.children.push(node);
        }
      }
    });

    const sortChildren = (node: OrgNode) => {
      node.children.sort((a, b) => a.position - b.position);
      node.children.forEach(sortChildren);
    };
    sortChildren(ceoNode);

    return [ceoNode];
  };

  const calculatePositionsAndConnections = useCallback(() => {
    if (!containerRef.current) return;

    const positions = new Map<string, NodePosition>();
    const containerRect = containerRef.current.getBoundingClientRect();

    if (nodeRefs.current.size === 0) {
      return;
    }

    nodeRefs.current.forEach((element, nodeId) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        positions.set(nodeId, {
          id: nodeId,
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
        });
      }
    });

    setNodePositions(positions);

    const newConnections: Connection[] = [];
    const orgTree = buildOrgTree();

    const processNode = (node: OrgNode) => {
      if (node.children.length > 0) {
        const parentPos = positions.get(node.id);
        
        if (parentPos) {
          node.children.forEach((child) => {
            const childPos = positions.get(child.id);
            
            if (childPos) {
              newConnections.push({
                from: node.id,
                to: child.id,
                fromPos: {
                  x: parentPos.x,
                  y: parentPos.y + parentPos.height / 2,
                },
                toPos: {
                  x: childPos.x,
                  y: childPos.y - childPos.height / 2,
                },
              });
            }
            
            processNode(child);
          });
        }
      }
    };

    orgTree.forEach(processNode);
    setConnections(newConnections);
  }, [departments]);

  useEffect(() => {
    if (departments.length === 0) return;
    
    const timer1 = setTimeout(() => {
      calculatePositionsAndConnections();
    }, 100);

    const timer2 = setTimeout(() => {
      calculatePositionsAndConnections();
    }, 500);

    const timer3 = setTimeout(() => {
      calculatePositionsAndConnections();
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [departments, calculatePositionsAndConnections]);

  useEffect(() => {
    const handleResize = () => {
      const timer = setTimeout(() => {
        calculatePositionsAndConnections();
      }, 100);
      return () => clearTimeout(timer);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculatePositionsAndConnections]);

  const handleNodeClick = (node: OrgNode) => {
    if (node.type === 'department' && node.department) {
      setSelectedDepartment(node.department);
      setIsModalOpen(true);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const renderConnections = () => {
    if (!containerRef.current) {
      return null;
    }

    const containerRect = containerRef.current.getBoundingClientRect();

    if (connections.length === 0) {
      return null;
    }

    const connectionsByParent = new Map<string, Connection[]>();
    connections.forEach((conn) => {
      const existing = connectionsByParent.get(conn.from) || [];
      existing.push(conn);
      connectionsByParent.set(conn.from, existing);
    });

    const paths: React.ReactElement[] = [];
    let pathIndex = 0;

    connectionsByParent.forEach((conns, parentId) => {
      if (conns.length === 0) return;

      if (conns.length === 1) {
        const conn = conns[0];
        const pathData = `M ${conn.fromPos.x} ${conn.fromPos.y} L ${conn.fromPos.x} ${conn.toPos.y}`;

        paths.push(
          <motion.path
            key={`single-${parentId}-${pathIndex++}`}
            d={pathData}
            stroke="#3b82f6"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        );
      } else {
        const sortedConns = [...conns].sort((a, b) => a.toPos.x - b.toPos.x);
        const leftmost = sortedConns[0];
        const rightmost = sortedConns[sortedConns.length - 1];
        const parentX = sortedConns[0].fromPos.x;
        const parentY = sortedConns[0].fromPos.y;
        const childrenY = sortedConns[0].toPos.y;
        const midY = (parentY + childrenY) / 2;

        paths.push(
          <motion.path
            key={`vertical-parent-${parentId}-${pathIndex++}`}
            d={`M ${parentX} ${parentY} L ${parentX} ${midY}`}
            stroke="#3b82f6"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        );

        paths.push(
          <motion.path
            key={`horizontal-${parentId}-${pathIndex++}`}
            d={`M ${leftmost.toPos.x} ${midY} L ${rightmost.toPos.x} ${midY}`}
            stroke="#3b82f6"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeInOut' }}
          />
        );

        sortedConns.forEach((conn, idx) => {
          paths.push(
            <motion.path
              key={`vertical-child-${parentId}-${idx}-${pathIndex++}`}
              d={`M ${conn.toPos.x} ${midY} L ${conn.toPos.x} ${conn.toPos.y}`}
              stroke="#3b82f6"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + idx * 0.1, ease: 'easeInOut' }}
            />
          );
        });
      }
    });

    return (
      <svg
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          width: containerRect.width,
          height: containerRect.height,
          overflow: 'visible',
        }}
        viewBox={`0 0 ${containerRect.width} ${containerRect.height}`}
      >
        {paths}
      </svg>
    );
  };

  const renderNode = (node: OrgNode, depth = 0): React.ReactNode => {
    const hasChildren = node.children.length > 0;

    const getNodeStyle = () => {
      switch (node.type) {
        case 'ceo':
          return {
            backgroundColor: '#1e40af',
            color: 'white',
            border: '2px solid #1e40af',
            fontWeight: 'bold',
          };
        case 'department':
          return {
            backgroundColor: 'white',
            color: '#1f2937',
            border: '2px solid #6b7280',
            fontWeight: '600',
          };
        default:
          return {};
      }
    };

    const getNodeIcon = () => {
      switch (node.type) {
        case 'ceo':
          if (node.user?.avatar) {
            return (
              <Avatar className="h-8 w-8">
                <AvatarImage src={node.user.avatar} alt={node.name} />
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  <Crown className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            );
          }
          return <Crown className="h-5 w-5" />;
        case 'department':
          return <Building2 className="h-5 w-5" />;
        default:
          return null;
      }
    };

    return (
      <div key={node.id} className="flex flex-col items-center relative">
        <motion.div
          ref={(el) => {
            if (el) {
              nodeRefs.current.set(node.id, el);
            }
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
          onAnimationComplete={() => {
            setTimeout(() => {
              calculatePositionsAndConnections();
            }, 50);
          }}
        >
           <Card
             className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
               node.type === 'ceo' ? 'min-w-[220px]' : 'w-[280px]'
             } ${
               node.type === 'department' ? 'hover:scale-105' : ''
             }`}
             style={getNodeStyle()}
             onClick={() => {
               if (node.type === 'ceo') {

                 const ceoDepartment = {
                   id: 'ceo-structure',
                   name: 'Estrutura Organizacional',
                   description: 'Visão geral da empresa',
                   parentId: null,
                   level: 0,
                   position: 0,
                   color: '#1e40af',
                   icon: '👑',
                   isActive: true,
                   users: allUsers.filter(user => user.position !== 'CEO'), // Excluir o CEO da lista de usuários
                   children: departments,
                 };
                 setSelectedDepartment(ceoDepartment as any);
                 setIsModalOpen(true);
               } else if (node.type === 'department' && node.department) {
                 handleNodeClick(node);
               }
             }}
           >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-1">
                    {getNodeIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{node.name}</h3>
                    {node.department?.description && (
                      <p className="text-xs opacity-75 line-clamp-1">
                        {node.department.description}
                      </p>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {node.type === 'department' && (
                      <>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onAddDepartment?.(node.id);
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Novo Subdepartamento
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onAddUser?.(node.id);
                        }}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Adicionar Colaborador
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onEditDepartment?.(node.department!);
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Departamento
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDepartment?.(node.id);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir Departamento
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-1">
                  {node.type === 'ceo' && (
                    <Badge variant="secondary" className="text-xs">
                      CEO
                    </Badge>
                  )}
                  {node.type === 'department' && (
                    <Badge variant="outline" className="text-xs">
                      {node.department?.users?.length || 0} membros
                    </Badge>
                  )}
                </div>

                {node.type === 'department' && node.department?.users && node.department.users.length > 0 && (
                  <div className="flex -space-x-2">
                    {node.department.users.slice(0, 3).map((user) => (
                      <Avatar key={user.id} className="h-6 w-6 border-2 border-white">
                        <AvatarImage src={user.avatar || undefined} />
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {node.department.users.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600">+{node.department.users.length - 3}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {hasChildren && (
          <div className="flex justify-center gap-12 mt-16 px-4">
            <AnimatePresence>
              {node.children.map((child) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderNode(child, depth + 1)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  };

  const orgTree = buildOrgTree();

  return (
    <>
      <div className="w-full overflow-auto overflow-x-auto">
        <div 
          ref={containerRef}
          className="min-w-full flex justify-center py-8 relative px-8"
          style={{ minHeight: '600px', minWidth: 'max-content' }}
        >
          {renderConnections()}
          
          <div className="flex flex-col items-center relative z-20">
            {orgTree.map((node) => renderNode(node))}
          </div>
        </div>
      </div>

      <DepartmentDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        department={selectedDepartment}
        ceoUser={ceoUser || null}
        onAddUser={onAddUser}
        onEditDepartment={onEditDepartment}
        onDeleteDepartment={onDeleteDepartment}
        onEditUser={onEditUser}
        onDeleteUser={onDeleteUser}
      />
    </>
  );
};
