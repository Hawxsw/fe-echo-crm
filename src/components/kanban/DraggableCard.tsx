import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Calendar,
  CheckCircle2,
  GripVertical,
  Edit,
  Trash2,
  AlertCircle,
  ArrowUp,
  Zap,
} from 'lucide-react';
import { ICard } from '@/types/kanban';

interface DraggableCardProps {
  card: ICard;
  onDelete: (cardId: string) => void;
  onEdit: (card: ICard) => void;
}

export const DraggableCard = ({ card, onDelete, onEdit }: DraggableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const PRIORITY_CONFIG = {
    URGENT: {
      color: 'bg-red-500 text-white border-red-600',
      gradient: 'bg-gradient-to-r from-red-500 to-red-600',
      icon: <Zap className="w-3 h-3" />,
      label: 'Urgente',
    },
    HIGH: {
      color: 'bg-orange-500 text-white border-orange-600',
      gradient: 'bg-gradient-to-r from-orange-500 to-orange-600',
      icon: <ArrowUp className="w-3 h-3" />,
      label: 'Alta',
    },
    MEDIUM: {
      color: 'bg-blue-500 text-white border-blue-600',
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
      icon: <AlertCircle className="w-3 h-3" />,
      label: 'Média',
    },
    LOW: {
      color: 'bg-emerald-500 text-white border-emerald-600',
      gradient: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      icon: <CheckCircle2 className="w-3 h-3" />,
      label: 'Baixa',
    },
  } as const;

  const priorityConfig = PRIORITY_CONFIG[card.priority] || PRIORITY_CONFIG.LOW;

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden bg-white border border-slate-200/70 rounded-xl hover:shadow-xl hover:shadow-slate-200/50 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50 scale-95 shadow-2xl' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      {/* Barra colorida superior baseada na prioridade */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${priorityConfig.gradient}`} />

      <CardContent className="p-4 pt-5">
        {/* Header do Card */}
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-bold text-slate-900 flex-1 pr-2 leading-snug">
            {card.title}
          </h4>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-slate-400" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-slate-100 rounded-lg">
                  <MoreHorizontal className="w-4 h-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => onEdit(card)} className="rounded-lg">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(card.id)}
                  className="text-red-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Descrição */}
        {card.description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
            {card.description}
          </p>
        )}

        {/* Footer com badges e metadata */}
        <div className="flex items-center justify-between gap-2">
          <Badge className={`${priorityConfig.color} px-2.5 py-1 rounded-lg font-semibold shadow-sm`}>
            <span className="flex items-center gap-1.5">
              {priorityConfig.icon}
              <span className="text-xs">{priorityConfig.label}</span>
            </span>
          </Badge>

          <div className="flex items-center gap-2">
            {card.createdAt && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                <Calendar className="w-3.5 h-3.5" />
                <span className="font-medium">{formatDate(card.createdAt)}</span>
              </div>
            )}

            {card.assignedTo && (
              <Avatar className="w-7 h-7 border-2 border-white shadow-sm">
                <AvatarImage src={card.assignedTo.avatar || ''} />
                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {card.assignedTo.firstName?.[0]}{card.assignedTo.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
