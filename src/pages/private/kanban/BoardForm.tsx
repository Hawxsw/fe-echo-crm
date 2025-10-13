import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useBoards } from '@/hooks/useBoards';
import { routes } from '@/routes/routes';
import { ICreateBoard, IUpdateBoard } from '@/types/kanban';
import { toast } from '@/components/ui/toaster';

interface BoardFormProps {
  mode: 'create' | 'edit';
}

export const BoardForm = ({ mode }: BoardFormProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createBoard, updateBoard, getBoardById } = useBoards();

  const [formData, setFormData] = useState<ICreateBoard | IUpdateBoard>({
    name: '',
    description: '',
  });
  
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && id) {
      loadBoard();
    }
  }, [mode, id]);

  const loadBoard = async () => {
    try {
      const board = await getBoardById(id!);
      if (board) {
        setFormData({
          name: board.name,
          description: board.description || '',
        });
        setIsActive(board.isActive);
      }
    } catch (error) {
      console.error('Erro ao carregar board:', error);
      toast.error('Erro ao carregar board');
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

    if (!formData.name?.trim()) {
      newErrors.name = 'Nome é obrigatório';
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
        await createBoard(formData as ICreateBoard);
        toast.success('Board criado com sucesso!');
      } else {
        await updateBoard(id!, { ...formData, isActive } as IUpdateBoard);
        toast.success('Board atualizado com sucesso!');
      }
      
      navigate(routes.dashboard.routes.kanban.path);
    } catch (error) {
      console.error('Erro ao salvar board:', error);
      toast.error('Erro ao salvar board');
    } finally {
      setLoading(false);
    }
  };

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
            onClick={() => navigate(routes.dashboard.routes.kanban.path)}
            className="shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              {mode === 'create' ? 'Novo Board' : 'Editar Board'}
            </h1>
            <p className="text-muted-foreground mt-2 text-base font-light">
              {mode === 'create' 
                ? 'Crie um novo board para organizar suas tarefas'
                : 'Atualize as informações do board'
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
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                  <Layout className="w-5 h-5 text-blue-600" />
                </div>
                Informações do Board
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Configure o nome e descrição do board
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Board *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Desenvolvimento de Produto"
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
                  placeholder="Descreva o propósito deste board..."
                  rows={4}
                />
              </div>

              {mode === 'edit' && (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <Label htmlFor="isActive">Board Ativo</Label>
                    <p className="text-sm text-slate-500 mt-1">
                      Boards inativos ficam ocultos da visualização principal
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={(checked) => setIsActive(checked)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Info sobre colunas */}
        {mode === 'create' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-blue-50/50 border-blue-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Layout className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">
                      Próximo passo: Adicionar Colunas
                    </h3>
                    <p className="text-sm text-blue-700">
                      Após criar o board, você poderá adicionar colunas como "A Fazer", "Em Progresso", "Concluído", etc.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-end gap-4"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(routes.dashboard.routes.kanban.path)}
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
            {mode === 'create' ? 'Criar Board' : 'Salvar Alterações'}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default BoardForm;

