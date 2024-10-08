'use client'

import * as React from 'react'
import { addSession } from '@dashboard/actions/session'
import { zodResolver } from '@hookform/resolvers/zod'
import { athlete } from '@repo/db'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, MonitorCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import SelectPlayers from './SelectPlayers'
import { cn } from '@repo/ui/lib/utils'
import {
  Button,
  Calendar,
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
  name: z.string(),
  start_timestamp: z.date(),
  start_time_hours: z.string().min(2).max(2),
  start_time_minutes: z.string().min(2).max(2),
  total_time: z.string(),
  category_name: z.string(),
  athletes: z
    .object({
      athlete_id: z.string(),
    })
    .array(),
})
export type AthleteSelect = { athlete_id: string }
export type Athlete_Session = AthleteSelect & { start_timestamp: Date }

export type SessionFormData = {
  gpexe_id: null
  name: string
  start_timestamp: Date
  total_time: number
  category_name: string
  athletes: Athlete_Session[]
}

type Props = {
  date: Date
  players: athlete[]
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function SessionForm({ date, players, setOpen }: Props) {
  const playersArray = players.map((player) => {
    return { athlete_id: player.id }
  })

  const [selected, setSelected] = React.useState(playersArray)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: 'УТЗ',
      start_timestamp: date,
      start_time_hours: '12',
      start_time_minutes: '00',
      total_time: Number(60).toString(),
      category_name: 'БЕЗ ДАТЧИКОВ',
      athletes: selected,
    },
    mode: 'onChange',
  })

  const { toast } = useToast()

  function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      // eslint-disable-next-line no-unused-vars
      athletes,
      total_time,
      start_time_hours,
      start_time_minutes,
      start_timestamp,
      ...rest
    } = values

    const timestamp = new Date(
      new Date(start_timestamp).setHours(
        Number(start_time_hours),
        Number(start_time_minutes)
      )
    )

    const newSession = {
      ...rest,
      gpexe_id: null,
      start_timestamp: timestamp,
      total_time: Number(total_time) * 60,
      athletes: selected.map((player) => {
        return {
          athlete_id: player.athlete_id,
          start_timestamp: timestamp,
          average_time: Number(total_time),
        }
      }),
    }

    setLoading(true)
    const result = addSession(newSession)
    if (!result) {
      setError('Error')
      return
    } else {
      toast({
        duration: 2000,
        description: (
          <span className="flex items-center gap-2">
            <MonitorCheck />
            Тренировка сохранена
          </span>
        ),
      })
      setOpen(false)
    }
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <div>{error}</div>
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
        <div className="text-sm font-medium leading-none">Список игроков</div>
        <SelectPlayers
          players={players}
          selected={selected}
          setSelected={setSelected}
        />
        {/* <FormField
          control={form.control}
          name="athletes"
          render={() => (
            <FormItem className="flex flex-col gap-1">
              <div className="text-sm font-medium leading-none">
                Список игроков
              </div>
              <FormControl>
                <SelectPlayers
                  players={players}
                  selected={selected}
                  setSelected={setSelected}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button type="submit" disabled={loading}>
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  )
}
