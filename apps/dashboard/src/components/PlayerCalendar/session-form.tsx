'use client'

import * as React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { cn } from '@repo/ui/lib/utils'
import { Calendar as CalendarIcon } from 'lucide-react'
import {
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from '@repo/ui'
import { addSession } from '~/src/app/actions/session'

const formSchema = z.object({
  id: z.number(),
  name: z.string(),
  start_timestamp: z.date(),
  start_time_hours: z.string(),
  start_time_minutes: z.string(),
  total_time: z.string(),
  category_name: z.string(),
})

export type SessionFormData = {
  id: number
  name: string
  start_timestamp: Date
  total_time: number
  category_name: string
}

type Props = {
  date: Date
}

function twoDigitFormat(value: number): string {
  const result = '0' + value.toString()
  return result.substring(result.length - 2)
}

export function SessionForm({ date }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: Number(
        `${twoDigitFormat(date.getDate())}${twoDigitFormat(date.getMonth() + 1)}${date.getFullYear().toString().substring(2)}`
      ),
      name: 'УТЗ',
      start_timestamp: date,
      start_time_hours: '12',
      start_time_minutes: '00',
      total_time: Number(60).toString(),
      category_name: 'БЕЗ ДАТЧИКОВ',
    },
    mode: 'onChange',
  })

  const { toast } = useToast()

  function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      id,
      total_time,
      start_time_hours,
      start_time_minutes,
      start_timestamp,
      ...rest
    } = values
    const newSession = {
      id: Number(`${id}${twoDigitFormat(Number(start_time_hours))}`),
      start_timestamp: new Date(
        new Date(start_timestamp).setHours(
          Number(start_time_hours),
          Number(start_time_minutes)
        )
      ),
      total_time: Number(total_time) * 60,
      ...rest,
    }

    try {
      addSession(newSession)

      toast({
        title: 'OK',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(newSession, null, 2)}
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
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input placeholder="УТЗ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="total_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Длительность, мин</FormLabel>
              <FormControl>
                <Input placeholder="85" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-stretch gap-3">
          <FormField
            control={form.control}
            name="start_timestamp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дата и время начала УТЗ</FormLabel>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'dd.MM.yyyy')
                          ) : (
                            <span>Выберите дату</span>
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
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start_time_hours"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Часы</FormLabel>
                <FormControl>
                  <Input placeholder="12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start_time_minutes"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Минуты</FormLabel>
                <FormControl>
                  <Input placeholder="00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </Form>
  )
}
