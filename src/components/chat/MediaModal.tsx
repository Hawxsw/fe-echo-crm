import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  name?: string;
  uploadedBy?: string;
  uploadedAt?: Date;
}

interface MediaModalProps {
  open: boolean;
  onClose: () => void;
  media: MediaItem[];
  initialIndex?: number;
}

export const MediaModal = ({
  open,
  onClose,
  media,
  initialIndex = 0,
}: MediaModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const currentMedia = media[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < media.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      setCurrentIndex(prev => prev - 1);
      resetTransforms();
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setCurrentIndex(prev => prev + 1);
      resetTransforms();
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const resetTransforms = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleDownload = async () => {
    if (!currentMedia) return;

    try {
      const response = await fetch(currentMedia.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentMedia.name || `media-${currentMedia.id}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar mídia:', error);
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-black/95 overflow-hidden">
        <div className="relative h-screen w-full flex items-center justify-center">
          {/* Close Button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Media Info */}
          {currentMedia && (
            <div className="absolute top-4 left-4 z-50 max-w-md">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
                {currentMedia.name && (
                  <h3 className="font-semibold mb-1">{currentMedia.name}</h3>
                )}
                {currentMedia.uploadedBy && (
                  <p className="text-sm text-white/70">
                    Enviado por {currentMedia.uploadedBy}
                  </p>
                )}
                {currentMedia.uploadedAt && (
                  <p className="text-xs text-white/50">
                    {formatDate(currentMedia.uploadedAt)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-full p-2">
              {currentMedia?.type === 'image' && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                    className="h-10 w-10 rounded-full text-white hover:bg-white/20"
                  >
                    <ZoomOut className="h-5 w-5" />
                  </Button>
                  
                  <span className="text-white text-sm font-medium px-2 min-w-[60px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="h-10 w-10 rounded-full text-white hover:bg-white/20"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </Button>

                  <div className="w-px h-8 bg-white/20 mx-1" />

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleRotate}
                    className="h-10 w-10 rounded-full text-white hover:bg-white/20"
                  >
                    <RotateCw className="h-5 w-5" />
                  </Button>

                  <div className="w-px h-8 bg-white/20 mx-1" />
                </>
              )}

              <Button
                size="icon"
                variant="ghost"
                onClick={handleDownload}
                className="h-10 w-10 rounded-full text-white hover:bg-white/20"
              >
                <Download className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          {media.length > 1 && (
            <>
              {hasPrevious && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}

              {hasNext && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}

              {/* Counter */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium">
                  {currentIndex + 1} / {media.length}
                </div>
              </div>
            </>
          )}

          {/* Media Content */}
          <AnimatePresence mode="wait">
            {currentMedia && (
              <motion.div
                key={currentMedia.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="max-w-full max-h-full flex items-center justify-center p-4"
              >
                {currentMedia.type === 'image' ? (
                  <motion.img
                    src={currentMedia.url}
                    alt={currentMedia.name || 'Imagem'}
                    className="max-w-full max-h-[90vh] object-contain select-none"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      transition: 'transform 0.2s ease-out',
                    }}
                    draggable={false}
                  />
                ) : (
                  <video
                    src={currentMedia.url}
                    controls
                    autoPlay
                    className="max-w-full max-h-[90vh] rounded-lg"
                  >
                    Seu navegador não suporta reprodução de vídeo.
                  </video>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thumbnail Navigation */}
          {media.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 max-w-[90vw] overflow-x-auto">
              <div className="flex gap-2 p-2 bg-black/50 backdrop-blur-sm rounded-lg">
                {media.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentIndex(index);
                      resetTransforms();
                    }}
                    className={cn(
                      'relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 transition-all',
                      'ring-2 ring-offset-2 ring-offset-black/50',
                      currentIndex === index
                        ? 'ring-white'
                        : 'ring-transparent opacity-50 hover:opacity-75'
                    )}
                  >
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.name || `Thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                        <span className="text-white text-2xl">▶</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

