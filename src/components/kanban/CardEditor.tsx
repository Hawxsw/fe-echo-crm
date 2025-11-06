import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { useUsers } from '@/hooks/useUsers';
import { IUser } from '@/types/user';
import { extractUsersFromResponse } from '@/utils/typeGuards';
import { UI_CONSTANTS } from '@/constants/ui';

interface CardEditorProps {
  card: ICard | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    priority: CardPriority;
    assignedToId?: string;
  }) => void;
  mode: 'create' | 'edit';
}

interface CardFormData {
  title: string;
  description: string;
  priority: CardPriority;
  assignedToId: string;
}

const DEFAULT_FORM_DATA: CardFormData = {
  title: '',
  description: '',
  priority: 'MEDIUM',
  assignedToId: '',
};

export const CardEditor = ({ card, isOpen, onClose, onSave, mode }: CardEditorProps) => {
  const [formData, setFormData] = useState<CardFormData>(DEFAULT_FORM_DATA);
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const { getAllUsers } = useUsers();

  const loadUsers = useCallback(async () => {
    if (!isOpen) return;

    try {
      setIsLoadingUsers(true);
      const usersData = await getAllUsers();
      const usersArray = extractUsersFromResponse(usersData);
      setUsers(usersArray);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading users:', error);
      }
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [isOpen, getAllUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (card && mode === 'edit' && isOpen) {
      setFormData({
        title: card.title || '',
        description: card.description || '',
        priority: card.priority || 'MEDIUM',
        assignedToId: card.assignedToId || '',
      });
    } else if (isOpen) {
      setFormData(DEFAULT_FORM_DATA);
    }
  }, [card, mode, isOpen]);

  const handleFieldChange = useCallback(
    <K extends keyof CardFormData>(field: K, value: CardFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSave = useCallback(() => {
    if (!formData.title.trim()) return;

    onSave({
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      assignedToId: formData.assignedToId || undefined,
    });

    setFormData(DEFAULT_FORM_DATA);
    onClose();
  }, [formData, onSave, onClose]);

  const handleClose = useCallback(() => {
    if (mode === 'edit' && card) {
      setFormData({
        title: card.title || '',
        description: card.description || '',
        priority: card.priority || 'MEDIUM',
        assignedToId: card.assignedToId || '',
      });
    } else {
      setFormData(DEFAULT_FORM_DATA);
    }
    onClose();
  }, [mode, card, onClose]);

  const isFormValid = useMemo(() => formData.title.trim().length > 0, [formData.title]);

  const dialogTitle = useMemo(
    () => (mode === 'create' ? UI_CONSTANTS.CARD_EDITOR.TITLE_CREATE : UI_CONSTANTS.CARD_EDITOR.TITLE_EDIT),
    [mode]
  );

  const dialogDescription = useMemo(
    () =>
      mode === 'create'
        ? UI_CONSTANTS.CARD_EDITOR.DESCRIPTION_CREATE
        : UI_CONSTANTS.CARD_EDITOR.DESCRIPTION_EDIT,
    [mode]
  );

  const saveButtonText = useMemo(
    () => (mode === 'create' ? UI_CONSTANTS.CARD_EDITOR.BUTTON_CREATE : UI_CONSTANTS.CARD_EDITOR.BUTTON_SAVE),
    [mode]
  );


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="cardTitle" className="text-sm font-semibold text-slate-700">
              {UI_CONSTANTS.CARD_EDITOR.LABEL_TITLE}
            </Label>
            <Input
              id="cardTitle"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder={UI_CONSTANTS.CARD_EDITOR.PLACEHOLDER_TITLE}
              className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="cardDescription" className="text-sm font-semibold text-slate-700">
              {UI_CONSTANTS.CARD_EDITOR.LABEL_DESCRIPTION}
            </Label>
            <Textarea
              id="cardDescription"
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder={UI_CONSTANTS.CARD_EDITOR.PLACEHOLDER_DESCRIPTION}
              rows={4}
              className="mt-1.5 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="cardPriority" className="text-sm font-semibold text-slate-700">
              {UI_CONSTANTS.CARD_EDITOR.LABEL_PRIORITY}
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value: CardPriority) => handleFieldChange('priority', value)}
            >
              <SelectTrigger className="mt-1.5 rounded-xl border-slate-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value={UI_CONSTANTS.PRIORITY.LOW} className="rounded-lg">
                  {UI_CONSTANTS.CARD_EDITOR.PRIORITY_LOW}
                </SelectItem>
                <SelectItem value={UI_CONSTANTS.PRIORITY.MEDIUM} className="rounded-lg">
                  {UI_CONSTANTS.CARD_EDITOR.PRIORITY_MEDIUM}
                </SelectItem>
                <SelectItem value={UI_CONSTANTS.PRIORITY.HIGH} className="rounded-lg">
                  {UI_CONSTANTS.CARD_EDITOR.PRIORITY_HIGH}
                </SelectItem>
                <SelectItem value={UI_CONSTANTS.PRIORITY.URGENT} className="rounded-lg">
                  {UI_CONSTANTS.CARD_EDITOR.PRIORITY_URGENT}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="cardAssignedTo" className="text-sm font-semibold text-slate-700">
              {UI_CONSTANTS.CARD_EDITOR.LABEL_ASSIGNED_TO}
            </Label>
            <Select
              value={formData.assignedToId || 'none'}
              onValueChange={(value) => handleFieldChange('assignedToId', value === 'none' ? '' : value)}
              disabled={isLoadingUsers}
            >
              <SelectTrigger className="mt-1.5 rounded-xl border-slate-300">
                <SelectValue placeholder={UI_CONSTANTS.CARD_EDITOR.PLACEHOLDER_ASSIGNED_TO} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="none" className="rounded-lg">
                  {UI_CONSTANTS.CARD_EDITOR.NONE}
                </SelectItem>
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
          <Button variant="outline" onClick={handleClose} className="rounded-xl">
            {UI_CONSTANTS.CARD_EDITOR.BUTTON_CANCEL}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isFormValid}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
          >
            {saveButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
