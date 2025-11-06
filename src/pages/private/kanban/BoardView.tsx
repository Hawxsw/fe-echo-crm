import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  ArrowLeft,
  Edit,
  Plus,
  AlertCircle,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useBoards } from '@/hooks/useBoards';
import { useColumns } from '@/hooks/useColumns';
import { useCards } from '@/hooks/useCards';
import { IBoard, ICreateCard } from '@/types/kanban';
import { toast } from '@/components/ui/toaster';
import { DroppableColumn } from '@/components/kanban/DroppableColumn';
import { ColumnEditor } from '@/components/kanban/ColumnEditor';
import { CardEditor } from '@/components/kanban/CardEditor';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export default function BoardView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getBoardById } = useBoards();
  const { createColumn, deleteColumn } = useColumns();
  const { createCard, updateCard, deleteCard, moveCard } = useCards();

  const [board, setBoard] = useState<IBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewColumnDialog, setShowNewColumnDialog] = useState(false);


  const [showColumnEditor, setShowColumnEditor] = useState(false);
  const [editingColumn, setEditingColumn] = useState<any>(null);
  const [columnEditorMode, setColumnEditorMode] = useState<'create' | 'edit'>('create');


  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<{id: string, name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const [showCardEditor, setShowCardEditor] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [cardEditorMode, setCardEditorMode] = useState<'create' | 'edit'>('create');


  const [showCardDeleteConfirm, setShowCardDeleteConfirm] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<{id: string, title: string} | null>(null);
  const [isDeletingCard, setIsDeletingCard] = useState(false);


  const [activeCard, setActiveCard] = useState<any>(null);


  const [cardForm, setCardForm] = useState<ICreateCard>({
    title: '',
    description: '',
    position: 0,
    priority: 'MEDIUM',
    tags: [],
  });


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Aumentado para melhor controle
        delay: 100, // Pequeno delay para evitar arrastes acidentais
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    if (id) {
      loadBoard();
    }
  }, [id]);

  const loadBoard = async () => {
    try {
      setLoading(true);
      const boardData = await getBoardById(id!);

      if (boardData.columns) {
        boardData.columns.sort((a, b) => a.position - b.position);

        boardData.columns.forEach(column => {
          if (column.cards) {
            column.cards.sort((a, b) => a.position - b.position);
          }
        });
      }
      setBoard(boardData);
    } catch (error) {
      console.error('Erro ao carregar board:', error);
      toast.error('Erro ao carregar board');
    } finally {
      setLoading(false);
    }
  };



  const handleEditColumn = (column: any) => {
    setEditingColumn(column);
    setColumnEditorMode('edit');
    setShowColumnEditor(true);
  };

  const handleSaveColumn = async (data: { name: string; color: string; description?: string }) => {
    try {
      if (columnEditorMode === 'create') {
      const position = board?.columns?.length || 0;
      await createColumn(id!, {
          name: data.name,
        position,
          color: data.color,
          description: data.description,
      });
      toast.success('Coluna criada com sucesso!');
      } else {

        toast.success('Coluna atualizada com sucesso!');
      }
      
      setShowColumnEditor(false);
      setEditingColumn(null);
      loadBoard();
    } catch (error) {
      console.error('Erro ao salvar coluna:', error);
      toast.error('Erro ao salvar coluna');
    }
  };

  const handleDeleteColumn = async (columnId: string, columnName: string) => {

    const column = board?.columns?.find(c => c.id === columnId);
    const cardCount = column?.cards?.length || 0;
    
    if (cardCount > 0) {

      setColumnToDelete({ id: columnId, name: columnName });
      setShowDeleteConfirm(true);
    } else {

      setColumnToDelete({ id: columnId, name: columnName });
      setShowDeleteConfirm(true);
    }
  };

  const confirmDeleteColumn = async () => {
    if (!columnToDelete) return;

    setIsDeleting(true);
    try {
      await deleteColumn(columnToDelete.id);
      toast.success(`Coluna "${columnToDelete.name}" excluída com sucesso!`);
      setShowDeleteConfirm(false);
      setColumnToDelete(null);
        loadBoard();
      } catch (error) {
        console.error('Erro ao excluir coluna:', error);
        toast.error('Erro ao excluir coluna');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateCard = async (columnId: string, cardData: ICreateCard) => {
    if (!cardData.title.trim()) {
      toast.error('Digite um título para o card');
      return;
    }

    try {
      const column = board?.columns?.find(c => c.id === columnId);
      const position = column?.cards?.length || 0;
      
      await createCard(columnId, {
        ...cardData,
        position,
      });
      
      setCardForm({
        title: '',
        description: '',
        position: 0,
        priority: 'MEDIUM',
        tags: [],
        assignedToId: undefined,
      });
      toast.success('Card criado com sucesso!');
      loadBoard();
    } catch (error) {
      console.error('Erro ao criar card:', error);
      toast.error('Erro ao criar card');
    }
  };

  const handleEditCard = (card: any) => {
    setEditingCard(card);
    setCardEditorMode('edit');
    setShowCardEditor(true);
  };

  const handleSaveCard = async (data: { title: string; description: string; priority: string; assignedToId?: string }) => {
    try {
      if (cardEditorMode === 'edit' && editingCard) {
        await updateCard(editingCard.id, {
          title: data.title,
          description: data.description,
          priority: data.priority as any,
          assignedToId: data.assignedToId,
        });
        toast.success('Card atualizado com sucesso!');
      } else {

        toast.error('Modo de criação não suportado neste contexto');
      }
      
      setShowCardEditor(false);
      setEditingCard(null);
      loadBoard();
    } catch (error) {
      console.error('Erro ao salvar card:', error);
      toast.error('Erro ao salvar card');
    }
  };

  const handleDeleteCard = async (cardId: string) => {

    let cardTitle = 'Card';
    if (board?.columns) {
      for (const column of board.columns) {
        const card = column.cards?.find(c => c.id === cardId);
        if (card) {
          cardTitle = card.title;
          break;
        }
      }
    }
    
    setCardToDelete({ id: cardId, title: cardTitle });
    setShowCardDeleteConfirm(true);
  };

  const confirmDeleteCard = async () => {
    if (!cardToDelete) return;

    setIsDeletingCard(true);
    try {
      await deleteCard(cardToDelete.id);
      toast.success(`Card "${cardToDelete.title}" excluído com sucesso!`);
      setShowCardDeleteConfirm(false);
      setCardToDelete(null);
      loadBoard();
    } catch (error) {
      console.error('Erro ao excluir card:', error);
      toast.error('Erro ao excluir card');
    } finally {
      setIsDeletingCard(false);
    }
  };


  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = findCardById(active.id as string);
    setActiveCard(card);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !activeCard) {
      setActiveCard(null);
      return;
    }

    const activeCardId = active.id as string;
    const overId = over.id as string;


    if (activeCard.columnId === overId) {
      setActiveCard(null);
      return;
    }

    try {

      const targetColumn = board?.columns?.find(col => col.id === overId);
      const newPosition = targetColumn?.cards?.length || 0;


      setBoard(prevBoard => {
        if (!prevBoard) return prevBoard;

        const updatedColumns = prevBoard.columns?.map(column => {
          if (column.id === activeCard.columnId) {

            return {
              ...column,
              cards: column.cards?.filter(card => card.id !== activeCardId) || []
            };
          } else if (column.id === overId) {

            const updatedCard = { ...activeCard, columnId: overId };
            return {
              ...column,
              cards: [...(column.cards || []), updatedCard]
            };
          }
          return column;
        });

        return {
          ...prevBoard,
          columns: updatedColumns
        };
      });


      moveCard(activeCardId, {
        targetColumnId: overId,
        newPosition,
      }).catch(error => {
        console.error('Erro ao mover card:', error);
        toast.error('Erro ao mover card');

        loadBoard();
      });

      toast.success('Card movido com sucesso!');
    } catch (error) {
      console.error('Erro ao mover card:', error);
      toast.error('Erro ao mover card');
    } finally {
      setActiveCard(null);
    }
  };

  const findCardById = (cardId: string) => {
    if (!board?.columns) return null;
    
    for (const column of board.columns) {
      const card = column.cards?.find(c => c.id === cardId);
      if (card) return { ...card, columnId: column.id };
    }
    return null;
  };


  if (loading) {
    return (
      <div className="space-y-8 pb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mb-4"></div>
          <p className="text-muted-foreground font-medium">Carregando board...</p>
        </motion.div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="space-y-8 pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-2xl mb-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Board não encontrado</h3>
          <p className="text-muted-foreground mb-6">Não foi possível carregar o board solicitado.</p>
          <Button 
            onClick={() => navigate('/dashboard/kanban')} 
            className="shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Lista
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative"
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard/kanban')}
                  className="shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <div className="border-l border-border h-8"></div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg transition-transform duration-300 hover:scale-110">
                    <LayoutDashboard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      {board.name}
                    </h1>
                    {board.description && (
                      <p className="text-sm text-muted-foreground mt-0.5">{board.description}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/dashboard/kanban/edit/${board.id}`)}
                  className="shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Board
                </Button>
                <Button 
                  size="sm"
                  className="shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => {
                    setEditingColumn(null);
                    setColumnEditorMode('create');
                    setShowColumnEditor(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Coluna
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {board.columns?.map((column) => (
              <DroppableColumn
                key={column.id}
                column={column}
                onAddCard={handleCreateCard}
                onDeleteCard={handleDeleteCard}
                onEditCard={handleEditCard}
                onDeleteColumn={handleDeleteColumn}
                onEditColumn={handleEditColumn}
                cardForm={cardForm}
                setCardForm={setCardForm}
                showNewColumnDialog={showNewColumnDialog}
                setShowNewColumnDialog={setShowNewColumnDialog}
              />
            ))}

            {(!board.columns || board.columns.length === 0) && (
              <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg shadow-slate-200/30 w-full rounded-2xl">
                <CardContent className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl mb-4">
                    <Sparkles className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Comece criando colunas
                  </h3>
                  <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                    Organize suas tarefas criando colunas como "A Fazer", "Em Progresso" e "Concluído"
                  </p>
                  <Button 
                    onClick={() => {
                      setEditingColumn(null);
                      setColumnEditorMode('create');
                      setShowColumnEditor(true);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Coluna
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="rotate-2 scale-105 transition-all duration-300 z-50">
              <Card className="w-80 border border-slate-300 shadow-2xl shadow-blue-500/20 bg-white rounded-xl ring-2 ring-blue-400/50">
                <CardContent className="p-5">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 mb-1">{activeCard.title}</h4>
                      {activeCard.description && (
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {activeCard.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-slate-500">Arrastando...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <ColumnEditor
        column={editingColumn}
        isOpen={showColumnEditor}
        onClose={() => {
          setShowColumnEditor(false);
          setEditingColumn(null);
        }}
        onSave={handleSaveColumn}
        mode={columnEditorMode}
      />

      <CardEditor
        card={editingCard}
        isOpen={showCardEditor}
        onClose={() => {
          setShowCardEditor(false);
          setEditingCard(null);
        }}
        onSave={handleSaveCard}
        mode={cardEditorMode}
      />

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setColumnToDelete(null);
        }}
        onConfirm={confirmDeleteColumn}
        title="Excluir coluna"
        description={
          columnToDelete ? (
            (() => {
              const column = board?.columns?.find(c => c.id === columnToDelete.id);
              const cardCount = column?.cards?.length || 0;
              
              if (cardCount > 0) {
                return `Não é possível excluir a coluna "${columnToDelete.name}" pois ela possui ${cardCount} card(s). Remova os cards primeiro ou mova-os para outra coluna.`;
              } else {
                return `Tem certeza que deseja excluir a coluna "${columnToDelete.name}"? Esta ação não pode ser desfeita.`;
              }
            })()
          ) : ''
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        isLoading={isDeleting}
      />

      <ConfirmationDialog
        isOpen={showCardDeleteConfirm}
        onClose={() => {
          setShowCardDeleteConfirm(false);
          setCardToDelete(null);
        }}
        onConfirm={confirmDeleteCard}
        title="Excluir card"
        description={
          cardToDelete 
            ? `Tem certeza que deseja excluir o card "${cardToDelete.title}"? Esta ação não pode ser desfeita.`
            : ''
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        isLoading={isDeletingCard}
      />
    </div>
  );
}
