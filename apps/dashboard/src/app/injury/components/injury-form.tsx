'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { athlete, injury } from '@repo/db'
import { format } from 'date-fns'
import { CalendarIcon, MonitorCheck, SquareX } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { updateInjury } from '../../actions/injury'
import { cn } from '@repo/ui/lib/utils'
import {
  Button,
  Calendar,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useToast,
} from '@repo/ui'

const formSchema = z.object({
  start_date: z.date(),
  end_date: z.date().nullable(),
  place: z.string().optional(),
  diagnosis: z.string().optional(),
  estimated_recovery: z.string().optional(),
  athlete_id: z.string(),
})

export type InjuryFormData = {
  start_date: Date
  end_date: Date | null
  place: string | null
  diagnosis: string | null
  estimated_recovery: string | null
  athlete_id: string
}

type Props = {
  data: injury & { athlete: athlete }
}

export function InjuryForm({ data }: Props) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [open, setOpen] = React.useState(false)

  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      start_date: data.start_date,
      end_date: data.end_date || null,
      place: data.place || undefined,
      diagnosis: data.diagnosis || undefined,
      estimated_recovery: data.estimated_recovery || undefined,
      athlete_id: data.athlete_id,
    },
    mode: 'onChange',
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newValues: InjuryFormData = {
      start_date: values.start_date,
      end_date: values.end_date || null,
      place: values.place || null,
      diagnosis: values.diagnosis || null,
      estimated_recovery: values.estimated_recovery || null,
      athlete_id: values.athlete_id,
    }

    setLoading(true)
    const result = await updateInjury(data.id, newValues)
    if (!result) {
      setError('Error')
      return
    } else {
      toast({
        duration: 2000,
        description: (
          <span className="flex items-center gap-2">
            <MonitorCheck />
            Данные изменены
          </span>
        ),
      })
      setOpen(false)
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <DotsVerticalIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data.athlete.name}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <div>{error}</div>
            <FormField
              control={form.control}
              name="place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Место травмы</FormLabel>
                  <FormControl>
                    <Input placeholder="УТЗ / Матч" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Диагноз</FormLabel>
                  <FormControl>
                    <Input placeholder="Поврерждение..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estimated_recovery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Прогнозируемый срок восстановления</FormLabel>
                  <FormControl>
                    <Input placeholder="2-3 недели" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Дата травмы</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd.MM.yy')
                            ) : (
                              <span>Выбрать дату</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('2020-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Дата восстановления</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd.MM.yy')
                            ) : (
                              <span>Выбрать дату</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('2020-01-01')
                          }
                          initialFocus
                          footer={
                            <Button
                              variant="ghost"
                              className="w-full"
                              onClick={() =>
                                form.setValue('end_date', null, {
                                  shouldDirty: true,
                                })
                              }
                            >
                              <SquareX />
                            </Button>
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button type="submit" disabled={loading}>
                Сохранить
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
