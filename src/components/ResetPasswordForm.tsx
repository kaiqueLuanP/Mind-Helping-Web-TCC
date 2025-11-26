"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PasswordResetService from "@/services/passwordResetService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const schema = z.object({
  code: z.string().min(4, "Código inválido"),
  newPassword: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export default function ResetPasswordForm({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      await PasswordResetService.verifyResetCode(email, data.code);
      await PasswordResetService.resetPassword(email, data.code, data.newPassword);

      alert("Senha redefinida com sucesso!");
      window.location.href = "/login";
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código recebido no e-mail</FormLabel>
              <FormControl>
                <Input placeholder="Código de verificação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Digite sua nova senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Confirmando..." : "Redefinir senha"}
        </Button>
      </form>
    </Form>
  );
}
