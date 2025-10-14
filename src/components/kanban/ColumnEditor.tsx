import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { IColumn } from '@/types/kanban';

interface ColumnEditorProps {
  column?: IColumn;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; color: string; description?: string }) => void;
  mode: 'create' | 'edit';
}

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

export const ColumnEditor = ({ column, isOpen, onClose, onSave, mode }: ColumnEditorProps) => {
  const [name, setName] = useState(column?.name || '');
  const [color, setColor] = useState(column?.color || '#3B82F6');
  const [description, setDescription] = useState(column?.description || '');

  const handleSave = () => {
    if (!name.trim()) return;
    
    onSave({
      name: name.trim(),
      color,
      description: description.trim() || undefined,
    });
    
    setName('');
    setColor('#3B82F6');
    setDescription('');
    onClose();
  };

  const handleClose = () => {
    setName(column?.name || '');
    setColor(column?.color || '#3B82F6');
    setDescription(column?.description || '');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === 'create' ? 'Nova Coluna' : 'Editar Coluna'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Crie uma nova coluna para organizar seus cards'
              : 'Edite as informações da coluna'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="columnName" className="text-sm font-semibold text-slate-700">Nome da Coluna *</Label>
            <Input
              id="columnName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: A Fazer, Em Progresso, Concluído..."
              className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="columnDescription" className="text-sm font-semibold text-slate-700">Descrição (opcional)</Label>
            <Input
              id="columnDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o propósito desta coluna..."
              className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-slate-700">Cor da Coluna</Label>
            <div className="grid grid-cols-5 gap-2.5 mt-2.5">
              {COLUMN_COLORS.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  className={`w-10 h-10 rounded-xl ${colorOption.class} border-2 ${
                    color === colorOption.value 
                      ? 'border-slate-900 ring-2 ring-slate-400/50 scale-110' 
                      : 'border-slate-200 hover:border-slate-400 hover:scale-105'
                  } transition-all duration-200 shadow-sm hover:shadow-md`}
                  onClick={() => setColor(colorOption.value)}
                  title={colorOption.name}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} className="rounded-xl">
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
          >
            {mode === 'create' ? 'Criar Coluna' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
