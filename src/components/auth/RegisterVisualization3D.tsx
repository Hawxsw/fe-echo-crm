import { Rocket, Star, Sparkles, TrendingUp, Crown, Award, Gift, Zap } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useState, useRef, MouseEvent } from 'react';

export default function RegisterVisualization3D() {
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
          className="absolute w-80 h-[22rem] bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl shadow-2xl p-6 border-2 border-white/80"
          initial={{ rotateY: 0, rotateX: 0, scale: 1, z: 180 }}
          animate={!isHovering ? { 
            rotateY: [0, -5, 0, 5, 0],
            rotateX: [0, 3, 0, -3, 0],
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
          <div className="flex flex-col h-full items-center justify-center">
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative mb-6"
            >
              <div className="w-28 h-28 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Rocket className="w-16 h-16 text-white" />
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 0, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                className="absolute inset-0 bg-purple-400 rounded-3xl blur-2xl"
              />
              <motion.div
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </motion.div>
            </motion.div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Comece Sua Jornada
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6 px-4">
              Junte-se a milhares de empresas que crescem com o Echo CRM
            </p>

            <div className="grid grid-cols-2 gap-3 w-full">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    "0 10px 15px -3px rgba(139, 92, 246, 0.3)",
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-3 border border-purple-200"
              >
                <Crown className="w-6 h-6 text-purple-600 mb-2" />
                <p className="text-xs font-semibold text-gray-700">Plano Premium</p>
                <p className="text-xs text-gray-500">Recursos ilimitados</p>
              </motion.div>

              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    "0 10px 15px -3px rgba(236, 72, 153, 0.3)",
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl p-3 border border-pink-200"
              >
                <Award className="w-6 h-6 text-pink-600 mb-2" />
                <p className="text-xs font-semibold text-gray-700">Suporte 24/7</p>
                <p className="text-xs text-gray-500">Atendimento premium</p>
              </motion.div>

              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    "0 10px 15px -3px rgba(249, 115, 22, 0.3)",
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl p-3 border border-orange-200"
              >
                <Gift className="w-6 h-6 text-orange-600 mb-2" />
                <p className="text-xs font-semibold text-gray-700">30 Dias Grátis</p>
                <p className="text-xs text-gray-500">Teste sem compromisso</p>
              </motion.div>

              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-3 border border-blue-200"
              >
                <Zap className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-xs font-semibold text-gray-700">Setup Rápido</p>
                <p className="text-xs text-gray-500">Configure em minutos</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-6 left-10 w-44 h-36 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
          initial={{ rotateY: -28, rotateX: 10, z: -40 }}
          animate={!isHovering ? { 
            rotateY: [-28, -23, -28],
            rotateX: [10, 15, 10],
            y: [0, -16, 0]
          } : {}}
          transition={{ 
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.05, z: 10, transition: { duration: 0.2 } }}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mb-3"
            >
              <TrendingUp className="w-8 h-8 text-white" />
            </motion.div>
            <p className="text-sm font-bold text-gray-800">+250%</p>
            <p className="text-xs text-gray-500 text-center">Crescimento médio</p>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-14 right-14 w-40 h-32 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
          initial={{ rotateY: 26, rotateX: -12, z: 30 }}
          animate={!isHovering ? { 
            rotateY: [26, 31, 26],
            rotateX: [-12, -7, -12],
            y: [0, 13, 0]
          } : {}}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.05, z: 80, transition: { duration: 0.2 } }}
        >
          <div className="flex flex-col justify-center h-full">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-sm font-bold text-gray-800">4.9/5.0</p>
            <p className="text-xs text-gray-500">Avaliação de usuários</p>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-14 w-48 h-40 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
          initial={{ rotateY: -24, rotateX: 14, z: 70 }}
          animate={!isHovering ? { 
            rotateY: [-24, -19, -24],
            rotateX: [14, 19, 14],
            y: [0, -14, 0]
          } : {}}
          transition={{ 
            duration: 4.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.05, z: 120, transition: { duration: 0.2 } }}
        >
          <p className="text-sm font-bold text-gray-800 mb-3">Empresas ativas</p>
          <motion.p
            animate={{
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
            className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
          >
            50,000+
          </motion.p>
          <div className="flex gap-1">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full"
                initial={{ height: Math.random() * 30 + 10 }}
                animate={{
                  height: [
                    Math.random() * 30 + 10,
                    Math.random() * 40 + 20,
                    Math.random() * 30 + 10
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-6 right-10 w-44 h-36 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
          initial={{ rotateY: 24, rotateX: -16, z: -15 }}
          animate={!isHovering ? { 
            rotateY: [24, 29, 24],
            rotateX: [-16, -11, -16],
            y: [0, 14, 0]
          } : {}}
          transition={{ 
            duration: 4.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.05, z: 35, transition: { duration: 0.2 } }}
        >
          <div className="flex flex-col justify-center h-full">
            <p className="text-xs text-gray-500 mb-2">Novos usuários hoje</p>
            <motion.div
              className="flex items-baseline gap-2 mb-3"
              animate={{
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              <p className="text-3xl font-bold text-gray-800">+847</p>
              <motion.p
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-sm font-semibold text-green-600"
              >
                ↗ 12%
              </motion.p>
            </motion.div>
            <div className="flex gap-1.5">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white"
                  animate={{
                    scale: [1, 1.2, 1],
                    x: [0, -2, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  style={{ marginLeft: i > 0 ? '-8px' : '0' }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${['#A855F7', '#EC4899', '#F97316', '#3B82F6', '#10B981'][i % 5]}, ${['#C084FC', '#F472B6', '#FB923C', '#60A5FA', '#34D399'][i % 5]})`
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
              opacity: [0.3, 0.9, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1
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
            🚀 Descubra o futuro do seu negócio
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

