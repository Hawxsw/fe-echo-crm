import { TrendingUp, Users, MessageCircle, Calendar, DollarSign, Target, Phone, Mail } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useState, useRef, MouseEvent } from 'react';

export default function LoginVisualization3D() {
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
    
    const x = ((e.clientX - centerX) / rect.width) * 25;
    const y = ((e.clientY - centerY) / rect.height) * 25;
    
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
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1200px' }}
    >
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          rotateX: rotateX,
          rotateY: rotateY,
          willChange: 'transform',
        }}
      >
        <motion.div
          className="absolute w-72 h-80 bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl shadow-2xl p-6 border-2 border-white/80"
          initial={{ rotateY: 0, rotateX: 0, scale: 1, z: 180 }}
          animate={!isHovering ? { 
            rotateY: [0, 5, 0, -5, 0],
            rotateX: [0, -3, 0, 3, 0],
            scale: [1, 1.03, 1],
            z: [180, 200, 180]
          } : {}}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.06, z: 230, transition: { duration: 0.2 } }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Seu CRM</h3>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-white rounded-xl p-3 shadow-sm border border-blue-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Clientes</p>
                      <p className="text-lg font-bold text-gray-800">2,547</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="bg-white rounded-xl p-3 shadow-sm border border-purple-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Vendas Hoje</p>
                      <p className="text-lg font-bold text-gray-800">R$ 89k</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-purple-600 font-semibold">+23%</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="bg-white rounded-xl p-3 shadow-sm border border-orange-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Conversas</p>
                      <p className="text-lg font-bold text-gray-800">143</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 bg-orange-500 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.3
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-4 left-8 w-48 h-44 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
          initial={{ rotateY: -30, rotateX: 12, z: -30 }}
          animate={!isHovering ? { 
            rotateY: [-30, -25, -30],
            rotateX: [12, 17, 12],
            y: [0, -18, 0]
          } : {}}
          transition={{ 
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.05, z: 20, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Clientes Recentes</span>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="absolute top-12 right-12 w-44 h-40 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
          initial={{ rotateY: 28, rotateX: -12, z: 40 }}
          animate={!isHovering ? { 
            rotateY: [28, 33, 28],
            rotateX: [-12, -7, -12],
            y: [0, 14, 0]
          } : {}}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.05, z: 90, transition: { duration: 0.2 } }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Agenda</span>
            </div>
            <div className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-2">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                  <div className="h-1.5 bg-indigo-200 rounded flex-1"></div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <div className="h-1.5 bg-purple-200 rounded flex-1"></div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                  <div className="h-1.5 bg-pink-200 rounded flex-1"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-12 w-52 h-48 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
          initial={{ rotateY: -22, rotateX: 16, z: 90 }}
          animate={!isHovering ? { 
            rotateY: [-22, -17, -22],
            rotateX: [16, 21, 16],
            y: [0, -12, 0]
          } : {}}
          transition={{ 
            duration: 4.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.05, z: 140, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700">WhatsApp</span>
          </div>
          <div className="space-y-2">
            <motion.div
              animate={{ x: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-blue-50 rounded-xl p-2.5 max-w-[85%]"
            >
              <p className="text-xs text-gray-700">Olá! Como posso ajudar?</p>
              <p className="text-[10px] text-gray-400 mt-1">10:30</p>
            </motion.div>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="bg-emerald-500 text-white rounded-xl p-2.5 max-w-[85%] ml-auto"
            >
              <p className="text-xs">Gostaria de mais info</p>
              <p className="text-[10px] text-emerald-100 mt-1 text-right">10:32</p>
            </motion.div>
            <div className="flex items-center gap-1.5 px-2">
              <Mail className="w-3 h-3 text-gray-400" />
              <div className="h-1.5 bg-gray-200 rounded flex-1"></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-4 right-8 w-48 h-44 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
          initial={{ rotateY: 26, rotateX: -14, z: -10 }}
          animate={!isHovering ? { 
            rotateY: [26, 31, 26],
            rotateX: [-14, -9, -14],
            y: [0, 16, 0]
          } : {}}
          transition={{ 
            duration: 4.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.05, z: 40, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Performance</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Meta Mensal</span>
              <span className="text-amber-600 font-semibold">87%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                initial={{ width: '0%' }}
                animate={{ width: '87%' }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-amber-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-500">Hoje</p>
                <p className="text-sm font-bold text-amber-600">15</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-500">Mês</p>
                <p className="text-sm font-bold text-orange-600">342</p>
              </div>
            </div>
          </div>
        </motion.div>

        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${
                ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'][i % 4]
              }, ${['#60A5FA', '#A78BFA', '#34D399', '#FBBF24'][i % 4]})`,
              transformStyle: 'preserve-3d'
            }}
            initial={{
              x: Math.random() * 500 - 250,
              y: Math.random() * 500 - 250,
              z: Math.random() * 250 - 125,
            }}
            animate={{
              y: [
                Math.random() * 500 - 250,
                Math.random() * 500 - 250,
                Math.random() * 500 - 250,
              ],
              x: [
                Math.random() * 500 - 250,
                Math.random() * 500 - 250,
              ],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15
            }}
          />
        ))}

      </motion.div>

      {!isHovering && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg border border-white/60"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-xs text-gray-700 font-medium">
            🖱️ Explore seu painel CRM
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

