'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { athlete } from '@repo/db'

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from '@repo/ui'
import { updateAthlete } from '@dashboard/actions/athlete'

const formSchema = z.object({
  name: z.string().min(2).max(50),
  number: z.string(),
  day: z.string(),
  month: z.string(),
  year: z.string(),
  position_id: z.string().optional(),
  isInjured: z.boolean(),
})

export type AthleteFormData = {
  number?: number
  name?: string
  position_id?: number
  isInjured: boolean
  birthday?: Date | null
}

type Props = {
  data: athlete
}

export function AthleteForm({ data }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name ?? '',
      number: data.number ? data.number.toString() : undefined,
      day: data.birthday?.getDate().toString() ?? undefined,
      month: data.birthday?.getMonth().toString() ?? undefined,
      year: data.birthday?.getFullYear().toString() ?? undefined,
      position_id: data.position_id ? data.position_id.toString() : undefined,
      isInjured: data.isInjured,
    },
    mode: 'onChange',
  })

  const { toast } = useToast()

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newValues: AthleteFormData = {
      number: Number(values.number) ?? null,
      position_id: Number(values.position_id) ?? null,
      birthday:
        new Date(`${values.year}-${values.month}-${values.day}`) ?? null,
      isInjured: values.isInjured,
    }

    try {
      updateAthlete(data.id, newValues)

      toast({
        title: 'OK',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(newValues, null, 2)}
            </code>
          </pre>
        ),
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(error, null, 2)}</code>
          </pre>
        ),
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ФИО</FormLabel>
              <FormControl>
                <Input placeholder="ФИО" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Номер</FormLabel>
              <FormControl>
                <Input placeholder="Игровой номер" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormLabel>Дата рождения</FormLabel>
        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="day"
            render={({ field }) => (
              <FormItem>
                <FormLabel>День</FormLabel>
                <FormControl>
                  <Input placeholder="18" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Месяц</FormLabel>
                <FormControl>
                  <Input placeholder="12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Год</FormLabel>
                <FormControl>
                  <Input placeholder="1990" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="position_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Позиция</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выбрать позицию" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Защитник</SelectItem>
                  <SelectItem value="2">Полузащитник</SelectItem>
                  <SelectItem value="3">Нападющий</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isInjured"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Травма</FormLabel>
              <FormControl>
                <Switch
                  className="block"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </Form>
  )
}
