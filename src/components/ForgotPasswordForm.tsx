"use client"

import * as z from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const schema = z.object({
  email: z.string().email("Digite um e-mail válido"),
})

type FormSchema = z.infer<typeof schema>

export function ForgotPasswordForm({ className }: { className?: string }) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" }
  })

  const [message, setMessage] = useState("")

  async function onSubmit(values: FormSchema) {
    setMessage("")

    await new Promise(res => setTimeout(res, 1200))

    setMessage("Se o e-mail existir, enviaremos instruções de recuperação.")
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recuperar senha</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seuemail@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {message && (
              <p className="text-sm text-gray-600">{message}</p>
            )}

            <Button type="submit" className="w-full">
              Enviar link de recuperação
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
