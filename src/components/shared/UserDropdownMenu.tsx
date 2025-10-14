import { User, LogOut, Settings, Clock, BarChart3, HelpCircle, MessageSquare, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { routes } from '../../routes/routes';
import { useWorkStatus } from '../../hooks/useWorkStatus';
import { Tooltip } from '../ui/tooltip';

interface UserDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string | null;
  } | null;
  onLogout: () => void;
}

export const UserDropdownMenu = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  onLogout 
}: UserDropdownMenuProps) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isWorking, duration, clockIn, clockOut } = useWorkStatus();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onClose();
    onLogout();
  };

  const handleClockToggle = () => {
    if (isWorking) {
      clockOut();
    } else {
      clockIn();
    }
  };

  const menuVariants = {
    hidden: { 
      opacity: 0, 
      y: -12, 
      scale: 0.95,
      filter: 'blur(4px)'
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      y: -8, 
      scale: 0.95,
      filter: 'blur(4px)',
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 }
  };

  const rippleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: [0.3, 0],
      transition: { duration: 0.4 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={menuVariants}
          className="origin-top-right absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl shadow-black/10 bg-white/95 backdrop-blur-xl border border-white/20 overflow-hidden z-[60]"
        >
          <motion.div 
            variants={itemVariants}
            className="relative p-6 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-indigo-50/80 border-b border-slate-200/50 group hover:from-blue-100/80 hover:via-purple-100/60 hover:to-indigo-100/80 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                {currentUser?.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={`${currentUser.firstName} ${currentUser.lastName}`}
                    className="h-12 w-12 rounded-full object-cover ring-4 ring-white/50 shadow-lg"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white text-lg font-bold ring-4 ring-white/50 shadow-lg">
                    {currentUser?.firstName?.charAt(0)}
                    {currentUser?.lastName?.charAt(0)}
                  </div>
                )}
                <motion.div
                  className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white shadow-sm">
                  <motion.div
                    className="h-full w-full bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <motion.p 
                  variants={itemVariants}
                  className="text-lg font-bold text-slate-900 truncate"
                >
                  {currentUser?.firstName} {currentUser?.lastName}
                </motion.p>
                <motion.p 
                  variants={itemVariants}
                  className="text-sm text-slate-600 truncate"
                >
                  {currentUser?.email}
                </motion.p>
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center mt-1"
                >
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  <span className="text-xs text-slate-500 font-medium">Online</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="p-4 bg-gradient-to-r from-slate-50/80 to-slate-100/60 border-b border-slate-200/50"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-semibold text-slate-700">Status do Trabalho</span>
              </div>
              <motion.div
                className="flex items-center space-x-2"
                animate={{ scale: isWorking ? [1, 1.05, 1] : 1 }}
              >
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isWorking 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {isWorking ? 'Trabalhando' : 'Offline'}
                </div>
                <span className="text-xs text-slate-500 font-mono">{duration}</span>
              </motion.div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClockToggle}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isWorking
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25'
              }`}
            >
              <motion.div
                animate={{ rotate: isWorking ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isWorking ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              </motion.div>
              <span>{isWorking ? 'Encerrar Turno' : 'Registrar Entrada'}</span>
            </motion.button>
          </motion.div>

          <div className="py-2" role="menu">
            {[
              { icon: User, label: 'Meu Perfil', path: routes.profile.path, color: 'blue' },
              { icon: Settings, label: 'Configurações', path: routes.dashboard.routes.settings.path, color: 'slate' },
              { icon: BarChart3, label: 'Relatórios', path: routes.dashboard.routes.reports.path, color: 'green' },
              { icon: HelpCircle, label: 'Suporte', path: routes.dashboard.routes.support.path, color: 'purple' },
              { icon: MessageSquare, label: 'Feedback', path: routes.dashboard.routes.feedback.path, color: 'indigo' }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                custom={index}
              >
                <Link
                  to={item.path}
                  className="group relative flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-50/80 transition-all duration-200 hover:translate-x-1"
                  onClick={onClose}
                >
                  <Tooltip content={item.label} side="right" delay={300}>
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon className={`mr-3 h-4 w-4 text-slate-400 group-hover:text-${item.color}-600 transition-colors duration-200`} />
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-blue-500/20"
                        variants={rippleVariants}
                        initial="hidden"
                        whileTap="visible"
                      />
                    </motion.div>
                  </Tooltip>
                  <span className={`group-hover:text-${item.color}-600 transition-colors duration-200 font-medium`}>
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            ))}

            <motion.div 
              variants={itemVariants}
              className="my-2 mx-4 border-t border-slate-200/60"
            />

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="group relative flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-all duration-200"
            >
              <motion.div
                className="relative"
                animate={{ rotate: isLoggingOut ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <LogOut className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-600 transition-colors duration-200" />
                <motion.div
                  className="absolute inset-0 rounded-lg bg-red-500/20"
                  variants={rippleVariants}
                  initial="hidden"
                  whileTap="visible"
                />
              </motion.div>
              <span className="font-medium">
                {isLoggingOut ? 'Saindo...' : 'Sair'}
              </span>
            </motion.button>
          </div>

          <motion.div 
            variants={itemVariants}
            className="px-4 py-3 bg-slate-50/50 border-t border-slate-200/50"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Echo CRM v2.0</span>
              <div className="flex items-center space-x-1">
                <Zap className="h-3 w-3" />
                <span>Premium</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
