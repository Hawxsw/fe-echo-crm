import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useDepartments } from '@/hooks';
import { getDepartmentLevelColor, DEFAULT_DEPARTMENT_COLOR } from '@/constants';
import { motion } from 'framer-motion';
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Network,
  TrendingUp,
  Activity,
  Star,
  Filter,
  Grid3X3,
  List,
} from 'lucide-react';

export default function DepartmentsList() {
  const navigate = useNavigate();
  const { 
    departments, 
    loading, 
    error, 
    fetchDepartments, 
    deleteDepartment 
  } = useDepartments();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'users'>('name');

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const filteredDepartments = departments
    .filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'level':
          return a.level - b.level;
        case 'users':
          return (b._count?.users || 0) - (a._count?.users || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleDelete = async (id: string, name: string) => {
    // TODO: Substituir por componente de diálogo customizado
    if (window.confirm(`Tem certeza que deseja excluir o departamento "${name}"?`)) {
      try {
        await deleteDepartment(id);
      } catch (error) {
        console.error('Erro ao excluir:', error);
      }
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Departamentos
            </h1>
            <p className="text-muted-foreground mt-2 text-base font-light">
              Gerencie a estrutura organizacional da sua empresa
            </p>
            <div className="absolute -top-1 -left-1 w-20 h-20 bg-primary/5 rounded-full blur-3xl -z-10" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <Button
              onClick={() => navigate('/dashboard/departments/new')}
              className="shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Departamento
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full shadow-sm">
          <Activity className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            {departments.length} departamentos
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full shadow-sm">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            {departments.reduce((total, dept) => total + (dept._count?.users || 0), 0)} colaboradores
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full shadow-sm">
          <Star className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-700">
            {departments.filter(d => d.isActive).length} ativos
          </span>
        </div>
      </motion.div>

      {/* Modern Search and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="border-0 shadow-lg rounded-2xl"
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Buscar por nome, descrição ou nível..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 shadow-sm focus:shadow-md transition-shadow duration-200"
                />
              </div>
              
              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'level' | 'users')}
                  className="px-3 py-2 border border-input rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                >
                  <option value="name">Nome</option>
                  <option value="level">Nível</option>
                  <option value="users">Colaboradores</option>
                </select>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center bg-muted rounded-xl p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-lg"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-lg"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-red-200 bg-red-50 shadow-lg">
            <CardContent className="p-6">
              <p className="text-red-600 font-medium">{error}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Departments list */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mb-4"></div>
          <p className="text-muted-foreground font-medium">Carregando departamentos...</p>
        </motion.div>
      ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredDepartments.map((department, index) => (
              <div
                key={department.id}
                className={`
                  group relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden
                  hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 cursor-pointer
                  hover:scale-[1.02] hover:-translate-y-1
                  ${viewMode === 'list' ? 'flex items-center p-6' : 'p-6'}
                `}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
                onClick={() => navigate(`/dashboard/departments/${department.id}`)}
              >
                {/* Gradient overlay */}
                <div 
                  className="absolute top-0 left-0 w-full h-1 opacity-80"
                  style={{ 
                    background: `linear-gradient(90deg, ${department.color || DEFAULT_DEPARTMENT_COLOR}, ${department.color || DEFAULT_DEPARTMENT_COLOR}88)`
                  }}
                ></div>
                
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500"></div>
                </div>

                {viewMode === 'grid' ? (
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110"
                          style={{ backgroundColor: department.color || DEFAULT_DEPARTMENT_COLOR }}
                        >
                          {department.icon || '🏢'}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-900 transition-colors">
                            {department.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div 
                              className={`${getDepartmentLevelColor(department.level)} px-3 py-1 rounded-full font-medium hover:shadow-md hover:scale-105 transition-all duration-200 border-0 inline-flex items-center text-xs font-semibold`}
                              style={{
                                backgroundColor: 'inherit',
                                borderColor: 'transparent'
                              }}
                            >
                              Nível {department.level}
                            </div>
                            {!department.isActive && (
                              <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                                Inativo
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {department.description && (
                      <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                        {department.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-700">
                            {department._count?.users || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-xl">
                          <Network className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-semibold text-purple-700">
                            {department._count?.children || 0}
                          </span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/departments/edit/${department.id}`);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(department.id, department.name);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* List View */
                  <div className="relative z-10 flex items-center w-full">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg mr-4 flex-shrink-0"
                      style={{ backgroundColor: department.color || DEFAULT_DEPARTMENT_COLOR }}
                    >
                      {department.icon || '🏢'}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-blue-900 transition-colors">
                        {department.name}
                      </h3>
                      <p className="text-slate-600 text-sm truncate mt-1">
                        {department.description || 'Sem descrição'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 mr-4">
                      <div 
                        className={`${getDepartmentLevelColor(department.level)} hover:shadow-md hover:scale-105 transition-all duration-200 border-0 inline-flex items-center px-2.5 py-0.5 text-xs font-semibold`}
                        style={{
                          backgroundColor: 'inherit',
                          borderColor: 'transparent'
                        }}
                      >
                        Nível {department.level}
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">{department._count?.users || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <Network className="w-4 h-4" />
                        <span className="text-sm font-medium">{department._count?.children || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/departments/edit/${department.id}`);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(department.id, department.name);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      {/* Empty State */}
      {!loading && filteredDepartments.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5" />
            <CardContent className="p-16 relative text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl mb-6"
              >
                <Building2 className="w-20 h-20 text-primary mx-auto" />
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-3">
                {searchTerm ? 'Nenhum departamento encontrado' : 'Nenhum departamento criado'}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {searchTerm
                  ? 'Tente ajustar sua busca ou criar um novo departamento'
                  : 'Comece criando seu primeiro departamento para organizar sua empresa'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => navigate('/dashboard/departments/new')}
                  className="shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Departamento
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

