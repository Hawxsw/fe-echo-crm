import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  MoreHorizontal,
  Trash2,
  Edit,
  ListTodo,
} from 'lucide-react';
import { DraggableCard } from './DraggableCard';
import { IColumn, ICreateCard, CardPriority } from '@/types/kanban';
import { useUsers } from '@/hooks/useUsers';
import { IUser } from '@/types/user';
import { useState, useEffect } from 'react';

interface DroppableColumnProps {
  column: IColumn;
  onAddCard: (columnId: string, cardData: ICreateCard) => void;
  onDeleteCard: (cardId: string) => void;
  onEditCard: (card: any) => void;
  onDeleteColumn: (columnId: string, columnName: string) => void;
  onEditColumn: (column: IColumn) => void;
  cardForm: ICreateCard;
  setCardForm: (form: ICreateCard) => void;
  showNewColumnDialog: boolean;
  setShowNewColumnDialog: (show: boolean) => void;
}

export const DroppableColumn = ({
  column,
  onAddCard,
  onDeleteCard,
  onEditCard,
  onDeleteColumn,
  onEditColumn,
  cardForm,
  setCardForm,
}: DroppableColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  const [users, setUsers] = useState<IUser[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const { getAllUsers } = useUsers();

  useEffect(() => {
    if (showDialog) {
      getAllUsers().then((usersData) => {
        let usersArray: IUser[] = [];
        if (Array.isArray(usersData)) {
          usersArray = usersData;
        } else if (usersData && typeof usersData === 'object' && 'data' in usersData && Array.isArray((usersData as any).data)) {
          usersArray = (usersData as any).data;
        }
        setUsers(usersArray);
      }).catch((error) => {
        console.error('Erro ao carregar usuários:', error);
        setUsers([]);
      });
    }
  }, [showDialog, getAllUsers]);

  const handleCreateCard = () => {
    if (!cardForm.title.trim()) return;
    
    onAddCard(column.id, cardForm);
    setCardForm({
      title: '',
      description: '',
      position: 0,
      priority: 'MEDIUM',
      tags: [],
      assignedToId: undefined,
    });
    setShowDialog(false);
  };

  const cardIds = column.cards?.map(card => card.id) || [];

  return (
    <Card 
      ref={setNodeRef}
      className={`flex flex-col h-fit min-h-[500px] transition-all duration-300 rounded-2xl border shadow-md group ${
        isOver 
          ? 'bg-gradient-to-b from-blue-50 to-purple-50 border-blue-400 scale-[1.02] ring-2 ring-blue-400/50 shadow-xl shadow-blue-500/20' 
          : 'bg-white/90 backdrop-blur-sm border-slate-200 shadow-slate-200/50 hover:shadow-lg hover:shadow-slate-300/50'
      }`}
      style={{ minWidth: '320px', maxWidth: '320px' }}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-2 h-2 rounded-full shadow-sm" 
              style={{ backgroundColor: column.color || '#3B82F6' }}
            />
            <CardTitle className="text-base font-bold text-slate-900">
              {column.name}
            </CardTitle>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg shadow-sm">
              {column.cards?.length || 0}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg transition-colors">
                  <Plus className="w-4 h-4 text-slate-600" />
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Novo Card</DialogTitle>
                  <DialogDescription>
                    Adicione um novo card em <span className="font-semibold text-slate-700">"{column.name}"</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <Label htmlFor="cardTitle" className="text-sm font-semibold text-slate-700">Título *</Label>
                    <Input
                      id="cardTitle"
                      value={cardForm.title}
                      onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                      placeholder="Digite o título do card"
                      className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardDescription" className="text-sm font-semibold text-slate-700">Descrição</Label>
                    <Textarea
                      id="cardDescription"
                      value={cardForm.description}
                      onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                      placeholder="Descreva os detalhes do card..."
                      rows={3}
                      className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardPriority" className="text-sm font-semibold text-slate-700">Prioridade</Label>
                    <Select
                      value={cardForm.priority}
                      onValueChange={(value: CardPriority) => setCardForm({ ...cardForm, priority: value })}
                    >
                      <SelectTrigger className="mt-1.5 rounded-xl border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="LOW" className="rounded-lg">🟢 Baixa</SelectItem>
                        <SelectItem value="MEDIUM" className="rounded-lg">🔵 Média</SelectItem>
                        <SelectItem value="HIGH" className="rounded-lg">🟠 Alta</SelectItem>
                        <SelectItem value="URGENT" className="rounded-lg">🔴 Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cardAssignedTo" className="text-sm font-semibold text-slate-700">Responsável</Label>
                    <Select
                      value={cardForm.assignedToId || 'none'}
                      onValueChange={(value) => setCardForm({ ...cardForm, assignedToId: value === 'none' ? undefined : value })}
                    >
                      <SelectTrigger className="mt-1.5 rounded-xl border-slate-300">
                        <SelectValue placeholder="Selecione um responsável" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="none" className="rounded-lg">Nenhum</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id} className="rounded-lg">
                            {user.firstName} {user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => {
                    setCardForm({ title: '', description: '', position: 0, priority: 'MEDIUM', tags: [] });
                    setShowDialog(false);
                  }} className="rounded-xl">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreateCard}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                  >
                    Criar Card
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-slate-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem
                  onClick={() => onEditColumn(column)}
                  className="rounded-lg"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Coluna
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteColumn(column.id, column.name)}
                  className="text-red-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Coluna
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {column.description && (
          <p className="text-xs text-slate-500 leading-relaxed">{column.description}</p>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-3 max-h-[calc(100vh-300px)] px-3">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {column.cards?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <div className="flex items-center justify-center w-14 h-14 bg-slate-50 rounded-xl mb-3">
                <ListTodo className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-400">Nenhum card</p>
              <p className="text-xs text-slate-400 mt-1">Arraste cards aqui</p>
            </div>
          ) : (
            column.cards?.map((card) => (
              <DraggableCard
                key={card.id}
                card={card}
                onDelete={onDeleteCard}
                onEdit={onEditCard}
              />
            ))
          )}
        </SortableContext>
      </CardContent>
    </Card>
  );
};
