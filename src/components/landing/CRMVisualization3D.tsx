import { BarChart3, Users, MessageSquare, LayoutGrid } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useState, useRef, MouseEvent } from 'react';

export default function CRMVisualization3D() {
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(mouseY, { stiffness: 150, damping: 30 });
  const rotateY = useSpring(mouseX, { stiffness: 150, damping: 30 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = ((e.clientX - centerX) / rect.width) * 30;
    const y = ((e.clientY - centerY) / rect.height) * 30;
    
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
      className="relative w-full h-96 lg:h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative w-full h-full overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          rotateX: rotateX,
          rotateY: rotateY,
          willChange: 'transform',
        }}
      >
        <motion.div
          className="absolute top-8 left-8 w-48 h-32 bg-white rounded-xl shadow-2xl p-4 border border-gray-200"
          initial={{ rotateY: -30, rotateX: 10, z: -100 }}
          animate={!isHovering ? { 
            rotateY: [-30, -25, -30],
            rotateX: [10, 15, 10],
            y: [0, -10, 0]
          } : {}}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.05, z: 50, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Analytics</span>
          </div>
          <div className="space-y-1">
            <div className="h-2 bg-blue-100 rounded w-full"></div>
            <div className="h-2 bg-blue-200 rounded w-3/4"></div>
            <div className="h-2 bg-blue-100 rounded w-1/2"></div>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-24 right-12 w-52 h-36 bg-white rounded-xl shadow-2xl p-4 border border-gray-200"
          initial={{ rotateY: 30, rotateX: -10, z: 50 }}
          animate={!isHovering ? { 
            rotateY: [30, 35, 30],
            rotateX: [-10, -5, -10],
            y: [0, 10, 0]
          } : {}}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.05, z: 100, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Clientes</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="h-2 bg-gray-100 rounded w-20"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="h-2 bg-gray-100 rounded w-16"></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-16 w-56 h-40 bg-white rounded-xl shadow-2xl p-4 border border-gray-200"
          initial={{ rotateY: -20, rotateX: 15, z: 100 }}
          animate={!isHovering ? { 
            rotateY: [-20, -15, -20],
            rotateX: [15, 20, 15],
            y: [0, -15, 0]
          } : {}}
          transition={{ 
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.05, z: 150, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-gray-700">WhatsApp</span>
          </div>
          <div className="space-y-2">
            <div className="bg-blue-50 rounded-lg p-2 text-xs text-gray-600">
              Mensagem recebida
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-xs text-gray-600 ml-4">
              Resposta enviada
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-12 right-8 w-48 h-32 bg-white rounded-xl shadow-2xl p-4 border border-gray-200"
          initial={{ rotateY: 25, rotateX: -15, z: 0 }}
          animate={!isHovering ? { 
            rotateY: [25, 30, 25],
            rotateX: [-15, -10, -15],
            y: [0, 12, 0]
          } : {}}
          transition={{ 
            duration: 4.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.05, z: 50, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Kanban</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <div className="h-1.5 bg-gray-200 rounded"></div>
              <div className="h-8 bg-orange-100 rounded"></div>
              <div className="h-6 bg-orange-50 rounded"></div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-1.5 bg-gray-200 rounded"></div>
              <div className="h-10 bg-blue-100 rounded"></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-48 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-2xl p-5 text-white"
          initial={{ rotateY: 0, rotateX: 0, scale: 1, z: 200 }}
          animate={!isHovering ? { 
            rotateY: [0, 5, 0, -5, 0],
            rotateX: [0, -5, 0, 5, 0],
            scale: [1, 1.05, 1],
            z: [200, 220, 200]
          } : {}}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.1, z: 250, transition: { duration: 0.2 } }}
        >
          <h3 className="text-sm font-bold mb-3">Dashboard CRM</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs opacity-80">Total Clientes</span>
              <span className="text-lg font-bold">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs opacity-80">Conversas Ativas</span>
              <span className="text-lg font-bold">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs opacity-80">Projetos</span>
              <span className="text-lg font-bold">34</span>
            </div>
          </div>
        </motion.div>

      </motion.div>

      {!isHovering && (
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-xs text-gray-600 font-medium">
            🖱️ Mova o mouse para interagir
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

