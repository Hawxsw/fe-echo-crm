import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Zap, ArrowLeft, Mail, Lock, User, Phone, UserCog } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RegisterVisualization3D from '@/components/auth/RegisterVisualization3D';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema, type RegisterSchema } from '@/schemas';
import { AxiosError } from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, currentUser, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser && token) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, token, navigate]);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = useCallback(
    async (data: RegisterSchema) => {
      setIsLoading(true);
      try {
        await registerUser(data);
        toast.success('Conta criada com sucesso!');
        navigate('/dashboard', { replace: true });
      } catch (error) {
        if (error instanceof AxiosError) {
          const message = error.response?.data?.message || 'Erro ao criar conta';
          toast.error(message);
        } else {
          toast.error('Erro ao criar conta. Tente novamente.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [registerUser, navigate],
  );


  if (currentUser && token) {
    return null;
  }


  return (
    <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-tr from-orange-400/20 to-yellow-400/20 blur-3xl"
        />
      </div>

      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600">
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>

          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-20 h-24 w-24 rounded-2xl bg-white/10 backdrop-blur-sm"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 left-24 h-20 w-20 rounded-full bg-white/10 backdrop-blur-sm"
          />

          <div className="relative z-10 h-full">
            <RegisterVisualization3D />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex w-full flex-col px-4 py-4 sm:px-6 lg:w-1/2 lg:px-16 xl:px-20 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto w-full max-w-md my-auto"
        >
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="group mb-4 gap-2 hover:bg-white/50 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Voltar
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-2"
          >
            <div className="mb-1.5 flex items-center gap-3">
              <div className="relative">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(168, 85, 247, 0.3)",
                      "0 0 30px rgba(236, 72, 153, 0.4)",
                      "0 0 20px rgba(168, 85, 247, 0.3)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 p-2"
                >
                  <Zap className="h-4 w-4 text-white" />
                </motion.div>
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
                Echo CRM
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Crie sua conta
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              Comece gratuitamente por 30 dias
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-slate-200/60 bg-white/80 shadow-xl backdrop-blur-sm">
              <CardHeader className="space-y-0.5 pb-2">
                <CardTitle className="text-base font-bold">Criar nova conta</CardTitle>
                <CardDescription className="text-xs">
                  Preencha os dados para começar
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleSubmit(handleRegister)} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <Label htmlFor="firstName" className="text-xs font-medium text-slate-700">
                        Primeiro nome
                      </Label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors ${
                          focusedField === 'firstName' ? 'text-purple-600' : 'text-slate-400'
                        }`} />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="João"
                          {...registerField('firstName')}
                          onFocus={() => setFocusedField('firstName')}
                          onBlur={() => setFocusedField(null)}
                          disabled={isLoading}
                          className="pl-9 h-9 text-sm border-slate-200 bg-white transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      {errors.firstName && (
                        <span className="text-red-500 text-xs">{errors.firstName.message}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="lastName" className="text-xs font-medium text-slate-700">
                        Sobrenome
                      </Label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors ${
                          focusedField === 'lastName' ? 'text-purple-600' : 'text-slate-400'
                        }`} />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Silva"
                          {...registerField('lastName')}
                          onFocus={() => setFocusedField('lastName')}
                          onBlur={() => setFocusedField(null)}
                          disabled={isLoading}
                          className="pl-9 h-9 text-sm border-slate-200 bg-white transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      {errors.lastName && (
                        <span className="text-red-500 text-xs">{errors.lastName.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs font-medium text-slate-700">
                      E-mail
                    </Label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors ${
                        focusedField === 'email' ? 'text-purple-600' : 'text-slate-400'
                      }`} />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        {...registerField('email')}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        disabled={isLoading}
                        className="pl-9 h-9 text-sm border-slate-200 bg-white transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    {errors.email && (
                      <span className="text-red-500 text-xs">{errors.email.message}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-xs font-medium text-slate-700">
                      Telefone <span className="text-slate-400">(opcional)</span>
                    </Label>
                    <div className="relative">
                      <Phone className={`absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors ${
                        focusedField === 'phone' ? 'text-purple-600' : 'text-slate-400'
                      }`} />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(11) 98765-4321"
                        {...registerField('phone')}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        disabled={isLoading}
                        className="pl-9 h-9 text-sm border-slate-200 bg-white transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    {errors.phone && (
                      <span className="text-red-500 text-xs">{errors.phone.message}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">

                    <div className="space-y-1">
                      <Label htmlFor="roleId" className="text-xs font-medium text-slate-700">
                        Role <span className="text-slate-400">(opcional)</span>
                      </Label>
                      <div className="relative">
                        <UserCog className={`absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors ${
                          focusedField === 'roleId' ? 'text-purple-600' : 'text-slate-400'
                        }`} />
                        <Input
                          id="roleId"
                          type="text"
                          placeholder="UUID do role"
                          {...registerField('roleId')}
                          onFocus={() => setFocusedField('roleId')}
                          onBlur={() => setFocusedField(null)}
                          disabled={isLoading}
                          className="pl-9 h-9 text-sm border-slate-200 bg-white transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      {errors.roleId && (
                        <span className="text-red-500 text-xs">{errors.roleId.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-xs font-medium text-slate-700">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors ${
                        focusedField === 'password' ? 'text-purple-600' : 'text-slate-400'
                      }`} />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        {...registerField('password')}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        disabled={isLoading}
                        className="pl-9 h-9 text-sm border-slate-200 bg-white transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    {errors.password && (
                      <span className="text-red-500 text-xs">{errors.password.message}</span>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="h-9 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-semibold shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center"
                        >
                          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                          Criando conta...
                        </motion.div>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Criar minha conta
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </form>

                <div className="mt-2.5 text-center">
                  <p className="text-xs text-slate-600">
                    Já tem uma conta?{' '}
                    <button
                      type="button"
                      className="font-medium text-purple-600 transition-colors hover:text-pink-600"
                      onClick={() => navigate('/login')}
                    >
                      Fazer login
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

