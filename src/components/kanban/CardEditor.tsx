import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ICard, CardPriority } from '@/types/kanban';

interface CardEditorProps {
  card: ICard | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; priority: CardPriority }) => void;
  mode: 'create' | 'edit';
}

export const CardEditor = ({ card, isOpen, onClose, onSave, mode }: CardEditorProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<CardPriority>('MEDIUM');

  useEffect(() => {
    if (card && mode === 'edit') {
      setTitle(card.title || '');
      setDescription(card.description || '');
      setPriority(card.priority || 'MEDIUM');
    } else {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
    }
  }, [card, mode, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
    });
    
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    onClose();
  };

  const handleClose = () => {
    if (mode === 'edit' && card) {
      setTitle(card.title || '');
      setDescription(card.description || '');
      setPriority(card.priority || 'MEDIUM');
    } else {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
    }
    onClose();
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === 'create' ? 'Novo Card' : 'Editar Card'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Crie um novo card para esta coluna'
              : 'Edite as informações do card'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="cardTitle" className="text-sm font-semibold text-slate-700">Título *</Label>
            <Input
              id="cardTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do card"
              className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="cardDescription" className="text-sm font-semibold text-slate-700">Descrição</Label>
            <Textarea
              id="cardDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva os detalhes do card..."
              rows={4}
              className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="cardPriority" className="text-sm font-semibold text-slate-700">Prioridade</Label>
            <Select
              value={priority}
              onValueChange={(value: CardPriority) => setPriority(value)}
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
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} className="rounded-xl">
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!title.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
          >
            {mode === 'create' ? 'Criar Card' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
