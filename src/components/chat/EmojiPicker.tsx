import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Smile, Coffee, Activity, Globe, Flag, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

const emojiCategories = {
  recent: {
    name: 'Recentes',
    icon: Clock,
    emojis: ['❤️', '👍', '😄', '🎉', '🔥', '👏', '✅', '💯'],
  },
  smileys: {
    name: 'Smileys',
    icon: Smile,
    emojis: [
      '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊',
      '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘',
      '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪',
      '🤨', '🧐', '🤓', '😎', '🥳', '😏', '😒', '😞',
      '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩',
      '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯',
      '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓',
    ],
  },
  gestures: {
    name: 'Gestos',
    icon: Activity,
    emojis: [
      '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏',
      '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
      '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛',
      '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️',
      '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂',
    ],
  },
  objects: {
    name: 'Objetos',
    icon: Coffee,
    emojis: [
      '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️',
      '🖲️', '🕹️', '💽', '💾', '💿', '📀', '📼', '📷',
      '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟',
      '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏰',
      '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️',
      '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰',
    ],
  },
  symbols: {
    name: 'Símbolos',
    icon: Globe,
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
      '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
      '💘', '💝', '⭐', '🌟', '✨', '⚡', '🔥', '💥',
      '✅', '❌', '⭕', '🔴', '🟠', '🟡', '🟢', '🔵',
      '🟣', '⚪', '⚫', '🟤', '🔺', '🔻', '💯', '🔔',
      '🔕', '📢', '📣', '💬', '💭', '🗯️', '♠️', '♥️',
    ],
  },
  flags: {
    name: 'Bandeiras',
    icon: Flag,
    emojis: [
      '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️',
      '🇧🇷', '🇺🇸', '🇬🇧', '🇨🇦', '🇦🇷', '🇲🇽', '🇪🇸', '🇵🇹',
      '🇫🇷', '🇩🇪', '🇮🇹', '🇯🇵', '🇨🇳', '🇰🇷', '🇮🇳', '🇷🇺',
    ],
  },
};

export const EmojiPicker = ({ onEmojiSelect, onClose }: EmojiPickerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('recent');

  const filteredEmojis = useMemo(() => {
    if (!searchQuery) return emojiCategories;

    const filtered: typeof emojiCategories = {
      recent: { ...emojiCategories.recent, emojis: [] },
      smileys: { ...emojiCategories.smileys, emojis: [] },
      gestures: { ...emojiCategories.gestures, emojis: [] },
      objects: { ...emojiCategories.objects, emojis: [] },
      symbols: { ...emojiCategories.symbols, emojis: [] },
      flags: { ...emojiCategories.flags, emojis: [] },
    };

    Object.entries(emojiCategories).forEach(([key, category]) => {
      filtered[key as keyof typeof emojiCategories].emojis = category.emojis.filter(emoji =>
        emoji.includes(searchQuery)
      );
    });

    return filtered;
  }, [searchQuery]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className="w-[360px] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Emojis</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar emoji..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-background"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <div className="border-b border-border bg-accent/30">
          <TabsList className="w-full justify-start h-12 bg-transparent p-0 gap-0">
            {Object.entries(emojiCategories).map(([key, category]) => {
              const Icon = category.icon;
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className={cn(
                    'flex-1 h-full rounded-none border-b-2 border-transparent',
                    'data-[state=active]:border-primary data-[state=active]:bg-transparent',
                    'data-[state=active]:shadow-none'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Emoji Grid */}
        <div className="h-[280px] overflow-y-auto p-3">
          {Object.entries(filteredEmojis).map(([key, category]) => (
            <TabsContent key={key} value={key} className="m-0">
              {category.emojis.length === 0 ? (
                <div className="h-[240px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Nenhum emoji encontrado
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-8 gap-1">
                  {category.emojis.map((emoji, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEmojiClick(emoji)}
                      className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center text-2xl',
                        'hover:bg-accent transition-colors cursor-pointer'
                      )}
                      title={emoji}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border bg-accent/30">
        <p className="text-xs text-muted-foreground text-center">
          Clique para adicionar um emoji
        </p>
      </div>
    </motion.div>
  );
};

