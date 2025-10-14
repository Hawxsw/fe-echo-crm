import { z } from 'zod';

/**
 * Schema de validação para login
 */
export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'O e-mail é obrigatório.',
    })
    .email({ message: 'Informe um e-mail válido.' }),
  password: z
    .string({
      required_error: 'A senha é obrigatória.',
    })
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
});

/**
 * Schema de validação para registro
 */
export const registerSchema = z.object({
  email: z
    .string({
      required_error: 'O e-mail é obrigatório.',
    })
    .email({ message: 'Informe um e-mail válido.' }),
  password: z
    .string({
      required_error: 'A senha é obrigatória.',
    })
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
  firstName: z
    .string({
      required_error: 'O primeiro nome é obrigatório.',
    })
    .min(2, { message: 'O primeiro nome deve ter no mínimo 2 caracteres.' }),
  lastName: z
    .string({
      required_error: 'O último nome é obrigatório.',
    })
    .min(2, { message: 'O último nome deve ter no mínimo 2 caracteres.' }),
  phone: z.string().optional(),
  companyId: z
    .string({
      required_error: 'A empresa é obrigatória.',
    })
    .uuid({ message: 'ID da empresa inválido.' }),
  departmentId: z.string().uuid({ message: 'ID do departamento inválido.' }).optional(),
  roleId: z.string().uuid({ message: 'ID do role inválido.' }).optional(),
});


export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;

