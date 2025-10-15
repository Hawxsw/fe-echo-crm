import { BarChart3, Users, MessageSquare, LayoutGrid, Sparkles } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useRef, MouseEvent } from 'react';

export default function CRMVisualization3D() {
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(mouseY, { stiffness: 150, damping: 30 });
  const rotateY = useSpring(mouseX, { stiffness: 150, damping: 30 });
  
  // Adiciona profundidade baseada na posição do mouse
  const depth = useTransform(mouseX, [-30, 30], [-50, 50]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = ((e.clientX - centerX) / rect.width) * 40; // Aumentado de 30 para 40
    const y = ((e.clientY - centerY) / rect.height) * 40;
    
    mouseX.set(x);
    mouseY.set(-y);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-96 lg:h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1200px' }} // Aumentado de 1000px
    >
      {/* Efeito de brilho de fundo */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-blue-200/30 via-transparent to-transparent"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          rotateX: rotateX,
          rotateY: rotateY,
          willChange: 'transform',
        }}
      >
        {/* Card Analytics - Melhorado */}
        <motion.div
          className="absolute top-8 left-8 w-48 h-32 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 border border-gray-200/50"
          initial={{ rotateY: -30, rotateX: 10, z: -100 }}
          animate={!isHovering ? { 
            rotateY: [-30, -25, -30],
            rotateX: [10, 15, 10],
            y: [0, -10, 0],
            z: [-100, -80, -100]
          } : {}}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ 
            scale: 1.08, 
            z: 80,
            boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.35)",
            transition: { duration: 0.2 } 
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div 
              className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </motion.div>
            <span className="text-xs font-semibold text-gray-700">Analytics</span>
          </div>
          <div className="space-y-1">
            <motion.div 
              className="h-2 bg-gradient-to-r from-blue-200 to-blue-300 rounded w-full"
              animate={{ scaleX: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="h-2 bg-gradient-to-r from-blue-200 to-blue-300 rounded w-3/4"
              animate={{ scaleX: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div 
              className="h-2 bg-gradient-to-r from-blue-200 to-blue-300 rounded w-1/2"
              animate={{ scaleX: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>

        {/* Card Clientes - Melhorado */}
        <motion.div
          className="absolute top-24 right-12 w-52 h-36 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 border border-gray-200/50"
          initial={{ rotateY: 30, rotateX: -10, z: 50 }}
          animate={!isHovering ? { 
            rotateY: [30, 35, 30],
            rotateX: [-10, -5, -10],
            y: [0, 10, 0],
            z: [50, 70, 50]
          } : {}}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ 
            scale: 1.08, 
            z: 120,
            boxShadow: "0 25px 50px -12px rgba(34, 197, 94, 0.35)",
            transition: { duration: 0.2 } 
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <motion.div 
              className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Users className="w-5 h-5 text-green-600" />
            </motion.div>
            <span className="text-xs font-semibold text-gray-700">Clientes</span>
          </div>
          <div className="space-y-2">
            {[0, 1].map((i) => (
              <motion.div 
                key={i}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full" />
                <div className="h-2 bg-gray-100 rounded" style={{ width: i === 0 ? '80px' : '64px' }} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Card WhatsApp - Melhorado */}
        <motion.div
          className="absolute bottom-20 left-16 w-56 h-40 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 border border-gray-200/50"
          initial={{ rotateY: -20, rotateX: 15, z: 100 }}
          animate={!isHovering ? { 
            rotateY: [-20, -15, -20],
            rotateX: [15, 20, 15],
            y: [0, -15, 0],
            z: [100, 120, 100]
          } : {}}
          transition={{ 
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ 
            scale: 1.08, 
            z: 180,
            boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.35)",
            transition: { duration: 0.2 } 
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <motion.div 
              className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </motion.div>
            <span className="text-xs font-semibold text-gray-700">WhatsApp</span>
          </div>
          <div className="space-y-2">
            <motion.div 
              className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-2 text-xs text-gray-600"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Mensagem recebida
            </motion.div>
            <motion.div 
              className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-2 text-xs text-gray-600 ml-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Resposta enviada
            </motion.div>
          </div>
        </motion.div>

        {/* Card Kanban - Melhorado */}
        <motion.div
          className="absolute bottom-12 right-8 w-48 h-32 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 border border-gray-200/50"
          initial={{ rotateY: 25, rotateX: -15, z: 0 }}
          animate={!isHovering ? { 
            rotateY: [25, 30, 25],
            rotateX: [-15, -10, -15],
            y: [0, 12, 0],
            z: [0, 20, 0]
          } : {}}
          transition={{ 
            duration: 4.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ 
            scale: 1.08, 
            z: 80,
            boxShadow: "0 25px 50px -12px rgba(249, 115, 22, 0.35)",
            transition: { duration: 0.2 } 
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div 
              className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <LayoutGrid className="w-5 h-5 text-orange-600" />
            </motion.div>
            <span className="text-xs font-semibold text-gray-700">Kanban</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <div className="h-1.5 bg-gray-200 rounded"></div>
              <motion.div 
                className="h-8 bg-gradient-to-b from-orange-100 to-orange-200 rounded"
                whileHover={{ scale: 1.05 }}
              />
              <motion.div 
                className="h-6 bg-gradient-to-b from-orange-50 to-orange-100 rounded"
                whileHover={{ scale: 1.05 }}
              />
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-1.5 bg-gray-200 rounded"></div>
              <motion.div 
                className="h-10 bg-gradient-to-b from-blue-100 to-blue-200 rounded"
                whileHover={{ scale: 1.05 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Card Central - Dashboard CRM - MUITO Melhorado */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-48 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-2xl p-5 text-white overflow-hidden"
          initial={{ rotateY: 0, rotateX: 0, scale: 1, z: 200 }}
          animate={!isHovering ? { 
            rotateY: [0, 5, 0, -5, 0],
            rotateX: [0, -5, 0, 5, 0],
            scale: [1, 1.05, 1],
            z: [200, 240, 200]
          } : {}}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ 
            scale: 1.12, 
            z: 280,
            boxShadow: "0 30px 60px -15px rgba(79, 70, 229, 0.5)",
            transition: { duration: 0.2 } 
          }}
        >
          {/* Efeito de brilho animado no fundo */}
          <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold">Dashboard CRM</h3>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </div>
            
            <div className="space-y-3">
              {[
                { label: 'Total Clientes', value: '1,247' },
                { label: 'Conversas Ativas', value: '89' },
                { label: 'Projetos', value: '34' }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    x: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <span className="text-xs opacity-90">{item.label}</span>
                  <motion.span 
                    className="text-lg font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 * i, type: "spring", stiffness: 200 }}
                  >
                    {item.value}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Tooltip - Melhorado */}
      {!isHovering && (
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full shadow-xl border border-gray-200/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-xs text-gray-700 font-medium flex items-center gap-2">
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🖱️
            </motion.span>
            Mova o mouse para interagir
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
