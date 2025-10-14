import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { ISalesOpportunity } from '@/types/sales';
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
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  User,
  Building2,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  PlusCircle,
  Columns3,
  Check,
  Zap,
  ArrowUp,
  ListTodo,
  GripVertical,
  EllipsisVertical,
  Sparkles,
  Workflow,
  Clock,
  MessageSquare,
  Phone,
  Mail,
  Video,
  FileText,
  Target,
  X,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/toaster';


const formatPhone = (value: string) => {

  const numbers = value.replace(/\D/g, '');
  

  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
};

const formatCurrency = (value: string) => {

  const numbers = value.replace(/\D/g, '');
  

  const numericValue = parseFloat(numbers) / 100;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(numericValue);
};

const formatEmail = (value: string) => {

  return value.trim().toLowerCase();
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string) => {
  const phoneNumbers = phone.replace(/\D/g, '');
  return phoneNumbers.length >= 10 && phoneNumbers.length <= 11;
};


interface ISalesCard {
  id: string;
  title: string;
  description?: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  value: number;
  stage: 'lead' | 'qualificado' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  expectedCloseDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface ICreateSalesCard {
  title: string;
  description?: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  value: number;
  stage: 'lead' | 'qualificado' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  assignedTo?: string;
  expectedCloseDate?: string;
}


interface ISalesColumn {
  id: string;
  title: string;
  stage: 'lead' | 'qualificado' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';
  color: string;
  cards: ISalesCard[];
}


interface DraggableSalesCardProps {
  card: ISalesCard;
  onDelete: (cardId: string) => void;
  onOpenActivity: (card: ISalesCard) => void;
}

const DraggableSalesCard = ({ card, onDelete, onOpenActivity }: DraggableSalesCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'bg-red-500 text-white border-red-600';
      case 'alta': return 'bg-orange-500 text-white border-orange-600';
      case 'media': return 'bg-blue-500 text-white border-blue-600';
      case 'baixa': return 'bg-emerald-500 text-white border-emerald-600';
      default: return 'bg-slate-500 text-white border-slate-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgente': return <Zap className="w-3 h-3" />;
      case 'alta': return <ArrowUp className="w-3 h-3" />;
      case 'media': return <AlertCircle className="w-3 h-3" />;
      case 'baixa': return <CheckCircle2 className="w-3 h-3" />;
      default: return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card 
        className={`group relative overflow-hidden bg-white border border-slate-200/70 rounded-xl hover:shadow-xl hover:shadow-slate-200/50 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer ${
          isDragging ? 'opacity-50 scale-95 shadow-2xl' : ''
        }`}
        onClick={() => onOpenActivity(card)}
      >
        {/* Barra colorida superior baseada na prioridade */}
        <div 
          className={`absolute top-0 left-0 right-0 h-1 ${
            card.priority === 'urgente' ? 'bg-gradient-to-r from-red-500 to-red-600' :
            card.priority === 'alta' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
            card.priority === 'media' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
            'bg-gradient-to-r from-emerald-500 to-emerald-600'
          }`}
        ></div>

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
                    <EllipsisVertical className="w-4 h-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem onClick={() => onOpenActivity(card)} className="rounded-lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    Atividades
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

          {/* Informações do Card */}
          <div className="space-y-2.5 mb-4">
            <div className="flex items-center gap-2.5 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="font-medium truncate">{card.company}</span>
            </div>
            
            <div className="flex items-center gap-2.5 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
              <User className="w-4 h-4 text-slate-400" />
              <span className="font-medium truncate">{card.contact}</span>
            </div>

            <div className="flex items-center gap-2.5 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-emerald-600">
                {formatCurrency(card.value)}
              </span>
            </div>
          </div>

          {/* Footer com badges e metadata */}
          <div className="flex items-center justify-between gap-2">
            <Badge className={`${getPriorityColor(card.priority)} px-2.5 py-1 rounded-lg font-semibold shadow-sm`}>
              <span className="flex items-center gap-1.5">
                {getPriorityIcon(card.priority)}
                <span className="text-xs">
                {card.priority.toUpperCase()}
                </span>
              </span>
            </Badge>

            <div className="flex items-center gap-2">
            {card.expectedCloseDate && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="font-medium">{formatDate(card.expectedCloseDate)}</span>
                </div>
            )}

            {card.assignedTo && (
                <Avatar className="w-7 h-7 border-2 border-white shadow-sm">
                  <AvatarImage src={card.assignedTo.avatar} />
                  <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {card.assignedTo.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
            )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


interface SortableSalesColumnProps {
  column: ISalesColumn;
  onAddCard: (stage: string, cardData: ICreateSalesCard) => void;
  onDeleteCard: (cardId: string) => void;
  onOpenActivity: (card: ISalesCard) => void;
}

const SortableSalesColumn = ({ column, onAddCard, onDeleteCard, onOpenActivity }: SortableSalesColumnProps) => {
  const {
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [showNewCardDialog, setShowNewCardDialog] = useState(false);
  const [cardForm, setCardForm] = useState<ICreateSalesCard>({
    title: '',
    description: '',
    company: '',
    contact: '',
    email: '',
    phone: '',
    value: 0,
    stage: column.stage,
    priority: 'media',
  });

  const handleCreateCard = () => {
    if (!cardForm.title.trim() || !cardForm.company.trim() || !cardForm.contact.trim()) {
      toast.error('Preencha pelo menos o título, empresa e contato');
      return;
    }

    onAddCard(column.stage, cardForm);
    setCardForm({
      title: '',
      description: '',
      company: '',
      contact: '',
      email: '',
      phone: '',
      value: 0,
      stage: column.stage,
      priority: 'media',
    });
    setShowNewCardDialog(false);
  };

  const cardIds = column.cards.map(card => card.id);

  return (
    <Card 
      ref={setNodeRef}
      className="flex flex-col h-fit min-h-[500px] transition-all duration-300 rounded-2xl border shadow-md group bg-white/90 backdrop-blur-sm border-slate-200 shadow-slate-200/50 hover:shadow-lg hover:shadow-slate-300/50"
      style={{ minWidth: '340px', maxWidth: '340px', ...style }}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-2 h-2 rounded-full shadow-sm" 
              style={{ backgroundColor: column.color }}
            />
            <CardTitle className="text-base font-bold text-slate-900">
              {column.title}
            </CardTitle>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg shadow-sm">
              {column.cards.length}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <Dialog open={showNewCardDialog} onOpenChange={setShowNewCardDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg transition-colors">
                  <Plus className="w-4 h-4 text-slate-600" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Nova Oportunidade</DialogTitle>
                  <DialogDescription>
                    Adicione uma nova oportunidade em <span className="font-semibold text-slate-700">"{column.title}"</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div>
                    <Label htmlFor="cardTitle" className="text-sm font-semibold text-slate-700">Nome da Empresa *</Label>
                    <Input
                      id="cardTitle"
                      value={cardForm.title}
                      onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                      placeholder="Ex: Venda de Software"
                      className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardCompany" className="text-sm font-semibold text-slate-700">Empresa *</Label>
                    <Input
                      id="cardCompany"
                      value={cardForm.company}
                      onChange={(e) => setCardForm({ ...cardForm, company: e.target.value })}
                      placeholder="Nome da empresa"
                      className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardContact" className="text-sm font-semibold text-slate-700">Contato *</Label>
                    <Input
                      id="cardContact"
                      value={cardForm.contact}
                      onChange={(e) => setCardForm({ ...cardForm, contact: e.target.value })}
                      placeholder="Nome do contato"
                      className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardEmail" className="text-sm font-semibold text-slate-700">Email</Label>
                    <Input
                      id="cardEmail"
                      type="email"
                      value={cardForm.email}
                      onChange={(e) => {
                        const formattedEmail = formatEmail(e.target.value);
                        setCardForm({ ...cardForm, email: formattedEmail });
                      }}
                      placeholder="email@empresa.com"
                      className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {cardForm.email && !validateEmail(cardForm.email) && (
                      <p className="text-xs text-red-500 mt-1">Email inválido</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cardPhone" className="text-sm font-semibold text-slate-700">Telefone</Label>
                    <Input
                      id="cardPhone"
                      value={cardForm.phone}
                      onChange={(e) => {
                        const formattedPhone = formatPhone(e.target.value);
                        setCardForm({ ...cardForm, phone: formattedPhone });
                      }}
                      placeholder="(11) 99999-9999"
                      className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {cardForm.phone && !validatePhone(cardForm.phone) && (
                      <p className="text-xs text-red-500 mt-1">Telefone deve ter 10 ou 11 dígitos</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cardValue" className="text-sm font-semibold text-slate-700">Valor</Label>
                    <Input
                      id="cardValue"
                      value={cardForm.value === 0 ? '' : formatCurrency(cardForm.value.toString())}
                      onChange={(e) => {
                        const numbers = e.target.value.replace(/\D/g, '');
                        const numericValue = parseFloat(numbers) / 100;
                        setCardForm({ ...cardForm, value: numericValue || 0 });
                      }}
                      placeholder="R$ 0,00"
                      className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="cardDescription" className="text-sm font-semibold text-slate-700">Descrição</Label>
                    <Textarea
                      id="cardDescription"
                      value={cardForm.description}
                      onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                      placeholder="Detalhes da oportunidade..."
                      rows={3}
                      className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setShowNewCardDialog(false)} className="rounded-xl">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreateCard}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                  >
                    Criar Oportunidade
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-3 max-h-[calc(100vh-300px)] px-3">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {column.cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <div className="flex items-center justify-center w-14 h-14 bg-slate-50 rounded-xl mb-3">
                <ListTodo className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-400">Nenhuma oportunidade</p>
              <p className="text-xs text-slate-400 mt-1">Arraste cards aqui</p>
            </div>
          ) : (
            column.cards.map((card) => (
              <DraggableSalesCard
                key={card.id}
                card={card}
                onDelete={onDeleteCard}
                onOpenActivity={onOpenActivity}
              />
            ))
          )}
        </SortableContext>
      </CardContent>
    </Card>
  );
};


export default function SalesKanban() {
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [pipelineId, setPipelineId] = useState<string | null>(null);
  const [columns, setColumns] = useState<ISalesColumn[]>([]);

  const [activeCard, setActiveCard] = useState<ISalesCard | null>(null);
  

  const [showNewColumnModal, setShowNewColumnModal] = useState(false);
  const [showNewOpportunityModal, setShowNewOpportunityModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showCardDetailModal, setShowCardDetailModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<{id: string, title: string} | null>(null);
  const [selectedCard, setSelectedCard] = useState<ISalesCard | null>(null);
  const [activeTab, setActiveTab] = useState<'geral' | 'atividades' | 'comentarios'>('geral');
  
  const [newColumnForm, setNewColumnForm] = useState({
    name: '',
      color: '#3B82F6',
    position: 0,
  });
  const [newOpportunityForm, setNewOpportunityForm] = useState<ICreateSalesCard>({
    title: '',
    description: '',
    company: '',
    contact: '',
    email: '',
    phone: '',
    value: 0,
          stage: 'lead',
    priority: 'media',
  });
  const [editOpportunityForm, setEditOpportunityForm] = useState<ISalesCard>({
    id: '',
    title: '',
    description: '',
    company: '',
    contact: '',
    email: '',
    phone: '',
    value: 0,
    stage: 'lead',
    priority: 'media',
    createdAt: '',
    updatedAt: '',
  });


  const [activities, setActivities] = useState<Array<{
    id: string;
    type: 'call' | 'email' | 'meeting' | 'task' | 'note';
    title: string;
    description: string;
    scheduledDate: string;
    scheduledTime: string;
    completedDate?: string;
    completedTime?: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    assignedTo: string;
    createdAt: string;
  }>>([]);
  
  const [newActivityForm, setNewActivityForm] = useState({
    type: 'call' as 'call' | 'email' | 'meeting' | 'task' | 'note',
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
  });


  const [comments, setComments] = useState<Array<{
    id: string;
    content: string;
    author: string;
    createdAt: string;
    isPinned: boolean;
  }>>([]);
  
  const [newComment, setNewComment] = useState('');


  useEffect(() => {
    const loadPipeline = async () => {
      try {
        setLoading(true);
        let pipelines = await api.sales.getAllPipelines();
        

        if (!pipelines || pipelines.length === 0) {
          const defaultPipeline = await api.sales.createPipeline({
            name: 'Pipeline de Vendas',
            description: 'Pipeline padrão para gerenciamento de oportunidades de vendas',
          });
          

          const defaultStages = [
            { name: 'Leads', color: '#3B82F6', position: 0 },
            { name: 'Qualificados', color: '#10B981', position: 1 },
            { name: 'Propostas', color: '#F59E0B', position: 2 },
            { name: 'Negociação', color: '#EF4444', position: 3 },
            { name: 'Fechados', color: '#8B5CF6', position: 4 },
            { name: 'Perdidos', color: '#6B7280', position: 5 },
          ];

          for (const stageData of defaultStages) {
            await api.sales.createStage(defaultPipeline.id, stageData);
          }


          pipelines = await api.sales.getAllPipelines();
        }
        
        if (pipelines && pipelines.length > 0) {
          const pipeline = pipelines[0]; // Pega o primeiro pipeline
          setPipelineId(pipeline.id);
          

          const convertedColumns: ISalesColumn[] = pipeline.stages.map((stage) => ({
            id: stage.id,
            title: stage.name,
            stage: stage.name.toLowerCase().replace(/\s+/g, '_') as any,
            color: stage.color,
            cards: stage.opportunities.map(convertOpportunityToCard),
          }));
          
          setColumns(convertedColumns);
        }
      } catch (error) {
        console.error('Erro ao carregar pipeline:', error);
        toast.error('Erro ao carregar pipeline de vendas');
      } finally {
        setLoading(false);
      }
    };

    loadPipeline();
  }, []);


  const convertOpportunityToCard = (opportunity: ISalesOpportunity): ISalesCard => {

    const priorityMap: Record<string, 'baixa' | 'media' | 'alta' | 'urgente'> = {
      'LOW': 'baixa',
      'MEDIUM': 'media',
      'HIGH': 'alta',
      'URGENT': 'urgente',
    };

    return {
      id: opportunity.id,
      title: opportunity.title,
      description: opportunity.description,
      company: opportunity.company,
      contact: opportunity.contact,
      email: opportunity.email || '',
      phone: opportunity.phone || '',
      value: Number(opportunity.value),
      stage: 'lead' as any, // Será definido pela coluna
      priority: priorityMap[opportunity.priority] || 'media',
      assignedTo: opportunity.assignedTo ? {
        id: opportunity.assignedTo.id,
        name: `${opportunity.assignedTo.firstName} ${opportunity.assignedTo.lastName}`,
        avatar: opportunity.assignedTo.avatar,
      } : undefined,
      createdAt: opportunity.createdAt,
      updatedAt: opportunity.updatedAt,
    };
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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
    const overStageId = over.id as string;


    const currentColumn = columns.find(col => col.cards.some(c => c.id === activeCardId));
    if (currentColumn?.id === overStageId) {
      setActiveCard(null);
      return;
    }

    try {

      const updatedCard = { ...activeCard, stage: overStageId as any };
      
      setColumns(prevColumns => 
        prevColumns.map(column => ({
          ...column,
          cards: column.cards.filter(card => card.id !== activeCardId)
        }))
      );

      setColumns(prevColumns => 
        prevColumns.map(column => 
          column.id === overStageId 
            ? { ...column, cards: [...column.cards, updatedCard] }
            : column
        )
      );


      await api.sales.moveOpportunity(activeCardId, { stageId: overStageId });
      
      toast.success('Oportunidade movida com sucesso!');
    } catch (error) {
      console.error('Erro ao mover oportunidade:', error);
      toast.error('Erro ao mover oportunidade');
      

      const pipelines = await api.sales.getAllPipelines();
      if (pipelines && pipelines.length > 0) {
        const pipeline = pipelines[0];
        const convertedColumns: ISalesColumn[] = pipeline.stages.map((stage) => ({
          id: stage.id,
          title: stage.name,
          stage: stage.name.toLowerCase().replace(/\s+/g, '_') as any,
          color: stage.color,
          cards: stage.opportunities.map(convertOpportunityToCard),
        }));
        setColumns(convertedColumns);
      }
    } finally {
      setActiveCard(null);
    }
  };

  const findCardById = (cardId: string): ISalesCard | null => {
    for (const column of columns) {
      const card = column.cards.find(c => c.id === cardId);
      if (card) return card;
    }
    return null;
  };

  const handleAddCard = async (stage: string, cardData: ICreateSalesCard) => {
    try {

      if (cardData.email && !validateEmail(cardData.email)) {
        toast.error('Email inválido');
        return;
      }

      if (cardData.phone && !validatePhone(cardData.phone)) {
        toast.error('Telefone inválido');
        return;
      }


      const column = columns.find(col => col.stage === stage);
      if (!column) {
        toast.error('Estágio não encontrado');
        return;
      }


      const priorityMap: Record<string, 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> = {
        'baixa': 'LOW',
        'media': 'MEDIUM',
        'alta': 'HIGH',
        'urgente': 'URGENT',
      };


      const opportunity = await api.sales.createOpportunity({
        title: cardData.title,
        description: cardData.description,
        company: cardData.company,
        contact: cardData.contact,
        email: cardData.email,
        phone: cardData.phone,
        value: cardData.value,
        stageId: column.id,
        priority: priorityMap[cardData.priority],
        assignedToId: cardData.assignedTo,
      });


      const newCard = convertOpportunityToCard(opportunity);
      newCard.stage = stage as any;

    setColumns(prevColumns =>
        prevColumns.map(col =>
          col.stage === stage
            ? { ...col, cards: [...col.cards, newCard] }
            : col
        )
      );

      toast.success('Oportunidade criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar oportunidade:', error);
      toast.error('Erro ao criar oportunidade');
    }
  };

  const handleDeleteCard = (cardId: string) => {

    let cardTitle = 'Oportunidade';
    if (columns) {
      for (const column of columns) {
        const card = column.cards.find(c => c.id === cardId);
        if (card) {
          cardTitle = card.title;
          break;
        }
      }
    }
    
    setCardToDelete({ id: cardId, title: cardTitle });
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteCard = async () => {
    if (!cardToDelete) return;

    try {

      await api.sales.deleteOpportunity(cardToDelete.id);


      setColumns(prevColumns =>
        prevColumns.map(column => ({
          ...column,
          cards: column.cards.filter(card => card.id !== cardToDelete.id)
        }))
      );
    
      toast.success(`Oportunidade "${cardToDelete.title}" excluída com sucesso!`);
    } catch (error) {
      console.error('Erro ao excluir oportunidade:', error);
      toast.error('Erro ao excluir oportunidade');
    } finally {
      setShowDeleteConfirmModal(false);
      setCardToDelete(null);
    }
  };


  const handleOpenCardDetail = (card: ISalesCard) => {
    setSelectedCard(card);
    setEditOpportunityForm({
      ...card,
      assignedTo: card.assignedTo ? {
        id: card.assignedTo.id,
        name: card.assignedTo.name,
        avatar: card.assignedTo.avatar
      } : undefined,
    });
    setActiveTab('geral');
    setShowCardDetailModal(true);
  };

  const handleUpdateOpportunity = async () => {
    if (!editOpportunityForm.title.trim() || !editOpportunityForm.company.trim()) {
      toast.error('Preencha pelo menos o nome da empresa e empresa');
      return;
    }


    if (editOpportunityForm.email && !validateEmail(editOpportunityForm.email)) {
      toast.error('Email inválido');
      return;
    }

    if (editOpportunityForm.phone && !validatePhone(editOpportunityForm.phone)) {
      toast.error('Telefone inválido');
      return;
    }

    try {

      const targetColumn = columns.find(col => col.stage === editOpportunityForm.stage);
      if (!targetColumn) {
        toast.error('Estágio não encontrado');
        return;
      }


      const priorityMap: Record<string, 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> = {
        'baixa': 'LOW',
        'media': 'MEDIUM',
        'alta': 'HIGH',
        'urgente': 'URGENT',
      };


      const updatedOpportunity = await api.sales.updateOpportunity(editOpportunityForm.id, {
        title: editOpportunityForm.title,
        description: editOpportunityForm.description,
        company: editOpportunityForm.company,
        contact: editOpportunityForm.contact,
        email: editOpportunityForm.email,
        phone: editOpportunityForm.phone,
        value: editOpportunityForm.value,
        stageId: targetColumn.id,
        priority: priorityMap[editOpportunityForm.priority],
        assignedToId: editOpportunityForm.assignedTo?.id,
      });


      const updatedCard = convertOpportunityToCard(updatedOpportunity);
      updatedCard.stage = editOpportunityForm.stage;


      setColumns(prev =>
        prev.map(column => ({
          ...column,
          cards: column.cards.filter(card => card.id !== editOpportunityForm.id)
        }))
      );


      setColumns(prev =>
        prev.map(column =>
          column.stage === editOpportunityForm.stage
            ? { ...column, cards: [...column.cards, updatedCard] }
            : column
        )
      );

      toast.success('Oportunidade atualizada com sucesso!');
      setShowCardDetailModal(false);
    } catch (error) {
      console.error('Erro ao atualizar oportunidade:', error);
      toast.error('Erro ao atualizar oportunidade');
    }
  };


  const handleCreateColumn = async () => {
    if (!newColumnForm.name.trim()) {
      toast.error('Digite um nome para a coluna');
      return;
    }

    if (!pipelineId) {
      toast.error('Pipeline não encontrado. Recarregue a página.');
      return;
    }

    try {

      const newStage = await api.sales.createStage(pipelineId, {
        name: newColumnForm.name,
        position: columns.length,
        color: newColumnForm.color,
      });


      const newColumn: ISalesColumn = {
        id: newStage.id,
        title: newStage.name,
        stage: newStage.name.toLowerCase().replace(/\s+/g, '_') as any,
        color: newStage.color,
        cards: [],
      };

      setColumns(prev => [...prev, newColumn]);
      setNewColumnForm({ name: '', color: '#3B82F6', position: 0 });
      setShowNewColumnModal(false);
      toast.success('Coluna criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar coluna:', error);
      toast.error('Erro ao criar coluna');
    }
  };


  const handleCreateActivity = () => {
    if (!newActivityForm.title.trim() || !newActivityForm.scheduledDate || !newActivityForm.scheduledTime) {
      toast.error('Preencha pelo menos o título, data e horário');
      return;
    }

    const newActivity = {
      id: Date.now().toString(),
      ...newActivityForm,
      status: 'scheduled' as const,
      assignedTo: 'João Silva', // Usuário atual
      createdAt: new Date().toISOString(),
    };

    setActivities(prev => [newActivity, ...prev]);
    setNewActivityForm({
      type: 'call',
      title: '',
      description: '',
      scheduledDate: '',
      scheduledTime: '',
    });
    toast.success('Atividade agendada com sucesso!');
  };

  const handleCompleteActivity = (activityId: string) => {
    const now = new Date();
    const completedDate = now.toISOString().split('T')[0];
    const completedTime = now.toTimeString().slice(0, 5);

    setActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? {
              ...activity,
              status: 'completed' as const,
              completedDate,
              completedTime,
            }
          : activity
      )
    );
    toast.success('Atividade marcada como concluída!');
  };


  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error('Digite um comentário');
      return;
    }

    const comment = {
      id: Date.now().toString(),
      content: newComment,
      author: 'João Silva',
      createdAt: new Date().toISOString(),
      isPinned: false,
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    toast.success('Comentário adicionado!');
  };

  const handlePinComment = (commentId: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, isPinned: !comment.isPinned }
          : comment
      )
    );
    toast.success('Status do comentário atualizado!');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <Video className="w-4 h-4" />;
      case 'task': return <Target className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-blue-500';
      case 'email': return 'bg-green-500';
      case 'meeting': return 'bg-purple-500';
      case 'task': return 'bg-orange-500';
      case 'note': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };


  const handleCreateOpportunity = async () => {
    if (!newOpportunityForm.title.trim() || !newOpportunityForm.company.trim()) {
      toast.error('Preencha pelo menos o nome da empresa e empresa');
      return;
    }


    if (newOpportunityForm.email && !validateEmail(newOpportunityForm.email)) {
      toast.error('Email inválido');
      return;
    }

    if (newOpportunityForm.phone && !validatePhone(newOpportunityForm.phone)) {
      toast.error('Telefone inválido');
      return;
    }

    try {

      const column = columns.find(col => col.stage === newOpportunityForm.stage);
      if (!column) {
        toast.error('Estágio não encontrado');
        return;
      }


      const priorityMap: Record<string, 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> = {
        'baixa': 'LOW',
        'media': 'MEDIUM',
        'alta': 'HIGH',
        'urgente': 'URGENT',
      };


      const opportunity = await api.sales.createOpportunity({
        title: newOpportunityForm.title,
        description: newOpportunityForm.description,
        company: newOpportunityForm.company,
        contact: newOpportunityForm.contact,
        email: newOpportunityForm.email,
        phone: newOpportunityForm.phone,
        value: newOpportunityForm.value,
        stageId: column.id,
        priority: priorityMap[newOpportunityForm.priority],
        assignedToId: newOpportunityForm.assignedTo,
      });


      const newCard = convertOpportunityToCard(opportunity);
      newCard.stage = newOpportunityForm.stage;

      setColumns(prev =>
        prev.map(col =>
          col.stage === newOpportunityForm.stage
            ? { ...col, cards: [...col.cards, newCard] }
            : col
        )
      );

      setNewOpportunityForm({
        title: '',
        description: '',
        company: '',
        contact: '',
        email: '',
        phone: '',
        value: 0,
        stage: 'lead',
        priority: 'media',
      });
      setShowNewOpportunityModal(false);
      toast.success('Oportunidade criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar oportunidade:', error);
      toast.error('Erro ao criar oportunidade');
    }
  };

  const COLUMN_COLORS = [
    { name: 'Azul', value: '#3B82F6', class: 'bg-blue-500' },
    { name: 'Verde', value: '#10B981', class: 'bg-green-500' },
    { name: 'Amarelo', value: '#F59E0B', class: 'bg-yellow-500' },
    { name: 'Vermelho', value: '#EF4444', class: 'bg-red-500' },
    { name: 'Roxo', value: '#8B5CF6', class: 'bg-purple-500' },
    { name: 'Rosa', value: '#EC4899', class: 'bg-pink-500' },
    { name: 'Indigo', value: '#6366F1', class: 'bg-indigo-500' },
    { name: 'Cinza', value: '#6B7280', class: 'bg-gray-500' },
    { name: 'Laranja', value: '#F97316', class: 'bg-orange-500' },
    { name: 'Teal', value: '#14B8A6', class: 'bg-teal-500' },
  ];


  if (loading) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 -m-6 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Carregando pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 -m-6 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-8 shadow-lg shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-600 rounded-2xl shadow-xl shadow-blue-500/30">
                  <Workflow className="w-7 h-7 text-white" />
                </div>
              <div>
                  <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                  Pipeline de Vendas
                </h1>
                  <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                  Gerencie suas oportunidades de vendas
                </p>
              </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Relatórios
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setShowNewOpportunityModal(true)}
                  className="group bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30 rounded-xl transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Nova Oportunidade
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max relative">
              {columns.map((column) => (
                <SortableSalesColumn
                  key={column.id}
                  column={column}
                  onAddCard={handleAddCard}
                  onDeleteCard={handleDeleteCard}
                onOpenActivity={handleOpenCardDetail}
                />
              ))}
              
              {/* Botão Central para Criar Nova Coluna */}
              <div className="flex items-center justify-center min-w-[340px]">
                <Button
                  onClick={() => setShowNewColumnModal(true)}
                  className="group w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-110"
                  title="Adicionar nova etapa do pipeline"
                >
                  <PlusCircle className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
                </Button>
              </div>
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
                        <p className="text-sm text-slate-600">{activeCard.company}</p>
                        <p className="text-sm text-emerald-600 font-bold mt-1">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(activeCard.value)}
                        </p>
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

        {/* Modal: Criar Nova Coluna do Pipeline */}
        <Dialog open={showNewColumnModal} onOpenChange={setShowNewColumnModal}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Columns3 className="w-5 h-5 text-blue-500" />
                Nova Coluna do Pipeline
              </DialogTitle>
              <DialogDescription>
                Adicione uma nova etapa ao seu pipeline de vendas
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="columnName" className="text-sm font-semibold text-slate-700">Nome da Coluna *</Label>
                <Input
                  id="columnName"
                  value={newColumnForm.name}
                  onChange={(e) => setNewColumnForm({ ...newColumnForm, name: e.target.value })}
                  placeholder="Ex: Qualificação, Apresentação, Fechamento..."
                  className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-700">Cor de Identificação</Label>
                <div className="grid grid-cols-5 gap-2.5 mt-2.5">
                  {COLUMN_COLORS.map((colorOption) => (
                    <button
                      key={colorOption.value}
                      type="button"
                      className={`w-10 h-10 rounded-xl ${colorOption.class} border-2 ${
                        newColumnForm.color === colorOption.value 
                          ? 'border-slate-900 ring-2 ring-slate-400/50 scale-110' 
                          : 'border-slate-200 hover:border-slate-400 hover:scale-105'
                      } transition-all duration-200 shadow-sm hover:shadow-md`}
                      onClick={() => setNewColumnForm({ ...newColumnForm, color: colorOption.value })}
                      title={colorOption.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowNewColumnModal(false)} className="rounded-xl">
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateColumn}
                disabled={!newColumnForm.name.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
              >
                <Check className="w-4 h-4 mr-2" />
                Criar Coluna
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal: Nova Oportunidade */}
        <Dialog open={showNewOpportunityModal} onOpenChange={setShowNewOpportunityModal}>
          <DialogContent className="max-w-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Nova Oportunidade</DialogTitle>
            <DialogDescription>
              Crie uma nova oportunidade de vendas no pipeline
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4 py-2">
              <div>
                <Label htmlFor="opportunityTitle" className="text-sm font-semibold text-slate-700">Nome da Empresa *</Label>
                <Input
                  id="opportunityTitle"
                  value={newOpportunityForm.title}
                  onChange={(e) => setNewOpportunityForm({ ...newOpportunityForm, title: e.target.value })}
                  placeholder="Ex: Venda de Software"
                  className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="opportunityCompany" className="text-sm font-semibold text-slate-700">Empresa *</Label>
                <Input
                  id="opportunityCompany"
                  value={newOpportunityForm.company}
                  onChange={(e) => setNewOpportunityForm({ ...newOpportunityForm, company: e.target.value })}
                  placeholder="Nome da empresa"
                  className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="opportunityContact" className="text-sm font-semibold text-slate-700">Contato *</Label>
                <Input
                  id="opportunityContact"
                  value={newOpportunityForm.contact}
                  onChange={(e) => setNewOpportunityForm({ ...newOpportunityForm, contact: e.target.value })}
                  placeholder="Nome do contato"
                  className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="opportunityEmail" className="text-sm font-semibold text-slate-700">Email</Label>
                <Input
                  id="opportunityEmail"
                  type="email"
                  value={newOpportunityForm.email}
                  onChange={(e) => {
                    const formattedEmail = formatEmail(e.target.value);
                    setNewOpportunityForm({ ...newOpportunityForm, email: formattedEmail });
                  }}
                  placeholder="email@empresa.com"
                  className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {newOpportunityForm.email && !validateEmail(newOpportunityForm.email) && (
                  <p className="text-xs text-red-500 mt-1">Email inválido</p>
                )}
              </div>
              <div>
                <Label htmlFor="opportunityPhone" className="text-sm font-semibold text-slate-700">Telefone</Label>
                <Input
                  id="opportunityPhone"
                  value={newOpportunityForm.phone}
                  onChange={(e) => {
                    const formattedPhone = formatPhone(e.target.value);
                    setNewOpportunityForm({ ...newOpportunityForm, phone: formattedPhone });
                  }}
                  placeholder="(11) 99999-9999"
                  className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {newOpportunityForm.phone && !validatePhone(newOpportunityForm.phone) && (
                  <p className="text-xs text-red-500 mt-1">Telefone deve ter 10 ou 11 dígitos</p>
                )}
              </div>
              <div>
                <Label htmlFor="opportunityValue" className="text-sm font-semibold text-slate-700">Valor Estimado</Label>
                <Input
                  id="opportunityValue"
                  value={newOpportunityForm.value === 0 ? '' : formatCurrency(newOpportunityForm.value.toString())}
                  onChange={(e) => {
                    const numbers = e.target.value.replace(/\D/g, '');
                    const numericValue = parseFloat(numbers) / 100;
                    setNewOpportunityForm({ ...newOpportunityForm, value: numericValue || 0 });
                  }}
                  placeholder="R$ 0,00"
                  className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="opportunityPriority" className="text-sm font-semibold text-slate-700">Prioridade</Label>
                <Select
                  value={newOpportunityForm.priority}
                  onValueChange={(value: any) => setNewOpportunityForm({ ...newOpportunityForm, priority: value })}
                >
                  <SelectTrigger className="mt-1.5 rounded-xl border-slate-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="baixa" className="rounded-lg">🟢 Baixa</SelectItem>
                    <SelectItem value="media" className="rounded-lg">🔵 Média</SelectItem>
                    <SelectItem value="alta" className="rounded-lg">🟠 Alta</SelectItem>
                    <SelectItem value="urgente" className="rounded-lg">🔴 Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="opportunityStage" className="text-sm font-semibold text-slate-700">Etapa Inicial</Label>
                <Select
                  value={newOpportunityForm.stage}
                  onValueChange={(value: any) => setNewOpportunityForm({ ...newOpportunityForm, stage: value })}
                >
                  <SelectTrigger className="mt-1.5 rounded-xl border-slate-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {columns.map((column) => (
                      <SelectItem key={column.id} value={column.stage} className="rounded-lg">
                        {column.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Label htmlFor="opportunityDescription" className="text-sm font-semibold text-slate-700">Descrição</Label>
                <Textarea
                  id="opportunityDescription"
                  value={newOpportunityForm.description}
                  onChange={(e) => setNewOpportunityForm({ ...newOpportunityForm, description: e.target.value })}
                  placeholder="Detalhes da oportunidade..."
                  rows={3}
                  className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowNewOpportunityModal(false)} className="rounded-xl">
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateOpportunity}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
              >
                <Check className="w-4 h-4 mr-2" />
                Criar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        {/* Modal: Confirmar Exclusão */}
        <Dialog open={showDeleteConfirmModal} onOpenChange={setShowDeleteConfirmModal}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Excluir Oportunidade
              </DialogTitle>
              <DialogDescription>
                Esta ação não pode ser desfeita. Tem certeza que deseja excluir esta oportunidade?
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-xl">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {cardToDelete?.title || 'Oportunidade'}
                    </p>
                    <p className="text-sm text-slate-600">
                      Esta oportunidade será permanentemente removida do pipeline.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirmModal(false)} 
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button 
                onClick={confirmDeleteCard}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Oportunidade
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal Lateral Completo: Detalhes da Oportunidade */}
        {showCardDetailModal && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCardDetailModal(false)}
            />
            
            {/* Modal Content */}
            <div className="fixed right-0 top-0 h-full w-[800px] max-w-[90vw] bg-white shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Workflow className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedCard?.title}</h2>
                    <p className="text-sm text-slate-500">{selectedCard?.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Relatórios
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCardDetailModal(false)}
                    className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Pipeline Stages */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {columns.map((column) => (
                    <div
                      key={column.id}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                        column.id === selectedCard?.stage
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: column.color }} />
                      {column.title}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('geral')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'geral'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Geral
                </button>
                <button
                  onClick={() => setActiveTab('atividades')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'atividades'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Atividades
                </button>
                <button
                  onClick={() => setActiveTab('comentarios')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'comentarios'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Comentários
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === 'geral' && (
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Informações Básicas */}
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-semibold text-slate-700">Nome da Empresa *</Label>
                          <Input
                            value={editOpportunityForm.title}
                            onChange={(e) => setEditOpportunityForm({ ...editOpportunityForm, title: e.target.value })}
                            placeholder="Ex: Venda de Software"
                            className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-slate-700">Empresa *</Label>
                          <Input
                            value={editOpportunityForm.company}
                            onChange={(e) => setEditOpportunityForm({ ...editOpportunityForm, company: e.target.value })}
                            placeholder="Nome da empresa"
                            className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-slate-700">Contato *</Label>
                          <Input
                            value={editOpportunityForm.contact}
                            onChange={(e) => setEditOpportunityForm({ ...editOpportunityForm, contact: e.target.value })}
                            placeholder="Nome do contato"
                            className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-slate-700">Email</Label>
                          <Input
                            type="email"
                            value={editOpportunityForm.email}
                            onChange={(e) => {
                              const formattedEmail = formatEmail(e.target.value);
                              setEditOpportunityForm({ ...editOpportunityForm, email: formattedEmail });
                            }}
                            placeholder="email@empresa.com"
                            className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          {editOpportunityForm.email && !validateEmail(editOpportunityForm.email) && (
                            <p className="text-xs text-red-500 mt-1">Email inválido</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-semibold text-slate-700">Telefone</Label>
                          <Input
                            value={editOpportunityForm.phone}
                            onChange={(e) => {
                              const formattedPhone = formatPhone(e.target.value);
                              setEditOpportunityForm({ ...editOpportunityForm, phone: formattedPhone });
                            }}
                            placeholder="(11) 99999-9999"
                            className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          {editOpportunityForm.phone && !validatePhone(editOpportunityForm.phone) && (
                            <p className="text-xs text-red-500 mt-1">Telefone deve ter 10 ou 11 dígitos</p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-slate-700">Valor Estimado</Label>
                          <Input
                            value={editOpportunityForm.value === 0 ? '' : formatCurrency(editOpportunityForm.value.toString())}
                            onChange={(e) => {
                              const numbers = e.target.value.replace(/\D/g, '');
                              const numericValue = parseFloat(numbers) / 100;
                              setEditOpportunityForm({ ...editOpportunityForm, value: numericValue || 0 });
                            }}
                            placeholder="R$ 0,00"
                            className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-slate-700">Prioridade</Label>
                          <Select
                            value={editOpportunityForm.priority}
                            onValueChange={(value: any) => setEditOpportunityForm({ ...editOpportunityForm, priority: value })}
                          >
                            <SelectTrigger className="mt-1.5 rounded-xl border-slate-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="baixa" className="rounded-lg">🟢 Baixa</SelectItem>
                              <SelectItem value="media" className="rounded-lg">🔵 Média</SelectItem>
                              <SelectItem value="alta" className="rounded-lg">🟠 Alta</SelectItem>
                              <SelectItem value="urgente" className="rounded-lg">🔴 Urgente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-slate-700">Etapa Atual</Label>
                          <Select
                            value={editOpportunityForm.stage}
                            onValueChange={(value: any) => setEditOpportunityForm({ ...editOpportunityForm, stage: value })}
                          >
                            <SelectTrigger className="mt-1.5 rounded-xl border-slate-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {columns.map((column) => (
                                <SelectItem key={column.id} value={column.stage} className="rounded-lg">
                                  {column.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Label className="text-sm font-semibold text-slate-700">Descrição</Label>
                      <Textarea
                        value={editOpportunityForm.description}
                        onChange={(e) => setEditOpportunityForm({ ...editOpportunityForm, description: e.target.value })}
                        placeholder="Detalhes da oportunidade..."
                        rows={4}
                        className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setShowCardDetailModal(false)}
                        className="rounded-xl"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleUpdateOpportunity}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Salvar Alterações
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'atividades' && (
                  <div className="p-6">
                    {/* Formulário de Nova Atividade */}
                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Nova Atividade</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-semibold text-slate-700">Tipo de Atividade</Label>
                          <Select
                            value={newActivityForm.type}
                            onValueChange={(value: any) => setNewActivityForm({ ...newActivityForm, type: value })}
                          >
                            <SelectTrigger className="mt-1.5 rounded-xl border-slate-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="call" className="rounded-lg">📞 Ligação</SelectItem>
                              <SelectItem value="email" className="rounded-lg">📧 Email</SelectItem>
                              <SelectItem value="meeting" className="rounded-lg">🎥 Reunião</SelectItem>
                              <SelectItem value="task" className="rounded-lg">✅ Tarefa</SelectItem>
                              <SelectItem value="note" className="rounded-lg">📝 Anotação</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-slate-700">Título *</Label>
                          <Input
                            value={newActivityForm.title}
                            onChange={(e) => setNewActivityForm({ ...newActivityForm, title: e.target.value })}
                            placeholder="Ex: Ligar para cliente"
                            className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-slate-700">Data *</Label>
                          <Input
                            type="date"
                            value={newActivityForm.scheduledDate}
                            onChange={(e) => setNewActivityForm({ ...newActivityForm, scheduledDate: e.target.value })}
                            className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-slate-700">Horário *</Label>
                          <Input
                            type="time"
                            value={newActivityForm.scheduledTime}
                            onChange={(e) => setNewActivityForm({ ...newActivityForm, scheduledTime: e.target.value })}
                            className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label className="text-sm font-semibold text-slate-700">Descrição</Label>
                        <Textarea
                          value={newActivityForm.description}
                          onChange={(e) => setNewActivityForm({ ...newActivityForm, description: e.target.value })}
                          placeholder="Descreva o que será feito..."
                          rows={3}
                          className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <Button
                        onClick={handleCreateActivity}
                        className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agendar Atividade
                      </Button>
                    </div>

                    {/* Lista de Atividades */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Atividades Agendadas</h3>
                      
                      {activities.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Calendar className="w-8 h-8 text-slate-400" />
                          </div>
                          <p className="text-slate-500">Nenhuma atividade agendada</p>
                          <p className="text-sm text-slate-400">Crie sua primeira atividade acima</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {activities.map((activity) => (
                            <div
                              key={activity.id}
                              className={`p-4 rounded-xl border transition-all duration-200 ${
                                activity.status === 'completed'
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                                  {getActivityIcon(activity.type)}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-slate-900 truncate">{activity.title}</h4>
                                    <Badge
                                      variant={activity.status === 'completed' ? 'default' : 'secondary'}
                                      className={`text-xs px-2 py-0.5 rounded-lg ${
                                        activity.status === 'completed'
                                          ? 'bg-green-100 text-green-700 border-green-200'
                                          : 'bg-blue-100 text-blue-700 border-blue-200'
                                      }`}
                                    >
                                      {activity.status === 'completed' ? 'Concluída' : 'Agendada'}
                                    </Badge>
                                  </div>
                                  
                                  <p className="text-sm text-slate-600 mb-2">{activity.description}</p>
                                  
                                  <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-1">
                                      <CalendarIcon className="w-3 h-3" />
                                      {new Date(activity.scheduledDate).toLocaleDateString('pt-BR')}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {activity.scheduledTime}
                                    </div>
                                    {activity.status === 'completed' && activity.completedDate && (
                                      <div className="flex items-center gap-1 text-green-600">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Concluída em {new Date(activity.completedDate).toLocaleDateString('pt-BR')} às {activity.completedTime}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {activity.status === 'scheduled' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleCompleteActivity(activity.id)}
                                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg text-xs px-3 py-1"
                                  >
                                    <Check className="w-3 h-3 mr-1" />
                                    Concluir
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'comentarios' && (
                  <div className="p-6">
                    {/* Formulário de Novo Comentário */}
                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Novo Comentário</h3>
                      
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Digite seu comentário..."
                        rows={3}
                        className="rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      
                      <Button
                        onClick={handleAddComment}
                        className="mt-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Adicionar Comentário
                      </Button>
                    </div>

                    {/* Lista de Comentários */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Comentários</h3>
                      
                      {comments.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <MessageSquare className="w-8 h-8 text-slate-400" />
                          </div>
                          <p className="text-slate-500">Nenhum comentário ainda</p>
                          <p className="text-sm text-slate-400">Seja o primeiro a comentar</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {comments.map((comment) => (
                            <div
                              key={comment.id}
                              className={`p-4 rounded-xl border ${
                                comment.isPinned
                                  ? 'bg-blue-50 border-blue-200'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                  <User className="w-4 h-4 text-white" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-semibold text-slate-900">{comment.author}</span>
                                    <span className="text-xs text-slate-500">
                                      {new Date(comment.createdAt).toLocaleDateString('pt-BR')} às{' '}
                                      {new Date(comment.createdAt).toLocaleTimeString('pt-BR', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </span>
                                    {comment.isPinned && (
                                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-0.5">
                                        Fixado
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <p className="text-slate-700 leading-relaxed">{comment.content}</p>
                                </div>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePinComment(comment.id)}
                                  className="text-slate-400 hover:text-slate-600"
                                >
                                  {comment.isPinned ? 'Desafixar' : 'Fixar'}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
