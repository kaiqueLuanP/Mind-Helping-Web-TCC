# Guia React Hook Form

## Índice
1. [Introdução](#introdução)
2. [Instalação](#instalação)
3. [Conceitos Básicos](#conceitos-básicos)
4. [Validação](#validação)
5. [Exemplos Práticos](#exemplos-práticos)
6. [Dicas e Boas Práticas](#dicas-e-boas-práticas)

## Introdução

React Hook Form é uma biblioteca para gerenciamento de formulários em React que prioriza performance e facilidade de uso. Suas principais características são:

- Performance otimizada (rerenderização mínima)
- Validação nativa e personalizada
- Sem dependências externas
- Suporte a TypeScript
- Integração fácil com UI libraries

## Instalação

```bash
npm install react-hook-form
```

Para validação com schema (opcional):
```bash
npm install @hookform/resolvers yup
```

## Conceitos Básicos

### 1. Hook useForm

O hook principal que você vai usar:

```tsx
import { useForm } from "react-hook-form";

function MeuFormulario() {
  const {
    register,          // registra campos
    handleSubmit,      // lida com o envio
    formState,         // estado do formulário
    watch,            // observa campos
    setValue,         // define valores
    reset,            // reseta o form
  } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("nome")} />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

### 2. Registro de Campos

Para cada campo do formulário, use o método `register`:

```tsx
// Registro básico
<input {...register("nome")} />

// Com validação
<input {...register("email", {
  required: "Email é obrigatório",
  pattern: {
    value: /\S+@\S+\.\S+/,
    message: "Email inválido"
  }
})} />
```

### 3. Tratamento de Erros

Acesse erros através do `formState`:

```tsx
const { formState: { errors } } = useForm();

return (
  <form>
    <input {...register("nome", { required: "Nome é obrigatório" })} />
    {errors.nome && <span>{errors.nome.message}</span>}
  </form>
);
```

## Validação

### 1. Validação Básica

```tsx
<input {...register("username", {
  required: "Campo obrigatório",
  minLength: {
    value: 3,
    message: "Mínimo de 3 caracteres"
  },
  maxLength: {
    value: 20,
    message: "Máximo de 20 caracteres"
  }
})} />
```

### 2. Validação com Schema (Yup)

```tsx
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  nome: yup.string().required("Nome é obrigatório"),
  idade: yup.number()
    .positive("Idade deve ser positiva")
    .integer("Idade deve ser um número inteiro")
    .required("Idade é obrigatória"),
  email: yup.string()
    .email("Email inválido")
    .required("Email é obrigatório")
});

function Form() {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema)
  });

  return (
    <form>
      <input {...register("nome")} />
      <input type="number" {...register("idade")} />
      <input {...register("email")} />
    </form>
  );
}
```

## Exemplos Práticos

### 1. Formulário de Login

```tsx
function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Implemente sua lógica de login aqui
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email", {
          required: "Email é obrigatório",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Email inválido"
          }
        })}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}

      <input
        type="password"
        {...register("senha", {
          required: "Senha é obrigatória",
          minLength: {
            value: 6,
            message: "Senha deve ter no mínimo 6 caracteres"
          }
        })}
        placeholder="Senha"
      />
      {errors.senha && <span>{errors.senha.message}</span>}

      <button type="submit">Entrar</button>
    </form>
  );
}
```

### 2. Formulário com Select e Checkbox

```tsx
function FormularioComplexo() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      categoria: "",
      interesses: []
    }
  });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <select {...register("categoria")}>
        <option value="">Selecione...</option>
        <option value="A">Categoria A</option>
        <option value="B">Categoria B</option>
      </select>

      <div>
        <input 
          type="checkbox" 
          {...register("interesses")} 
          value="esportes" 
        />
        <label>Esportes</label>

        <input 
          type="checkbox" 
          {...register("interesses")} 
          value="música" 
        />
        <label>Música</label>
      </div>
    </form>
  );
}
```

## Dicas e Boas Práticas

1. **Use TypeScript para Melhor Tipagem**
```tsx
interface FormInputs {
  email: string;
  senha: string;
}

const { register, handleSubmit } = useForm<FormInputs>();
```

2. **Modo de Validação**
```tsx
const { register } = useForm({
  mode: "onChange" // valida ao mudar
  // ou
  mode: "onBlur"  // valida ao perder foco
  // ou
  mode: "onSubmit" // valida ao submeter (padrão)
});
```

3. **Valores Padrão**
```tsx
const { register } = useForm({
  defaultValues: {
    nome: "",
    email: "",
    aceitaTermos: false
  }
});
```

4. **Observando Campos**
```tsx
const { watch } = useForm();
const valorDoNome = watch("nome"); // observa um campo
const [nome, email] = watch(["nome", "email"]); // observa múltiplos campos
```

5. **Reset do Formulário**
```tsx
const { reset } = useForm();

// Reseta para valores vazios
reset();

// Reseta para valores específicos
reset({
  nome: "João",
  email: "joao@email.com"
});
```

6. **Acessibilidade**
```tsx
<input
  {...register("email")}
  aria-invalid={errors.email ? "true" : "false"}
/>
{errors.email && (
  <span role="alert">{errors.email.message}</span>
)}
```

## Recursos Adicionais

- [Documentação Oficial](https://react-hook-form.com/)
- [Exemplos na Documentação](https://react-hook-form.com/get-started)
- [API Reference](https://react-hook-form.com/docs)