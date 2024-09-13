'use client'

import * as React from 'react'
import { addGame } from '@dashboard/actions/game'
import { zodResolver } from '@hookform/resolvers/zod'
import { athlete } from '@repo/db'
import { format } from 'date-fns'
import {
  Calendar as CalendarIcon,
  HomeIcon,
  MonitorCheck,
  PlaneIcon,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from '@repo/ui'

const formSchema = z.object({
  start_timestamp: z.date(),
  start_time_hours: z.string().min(2).max(2),
  start_time_minutes: z.string().min(2).max(2),
  vs: z.string().min(3),
  competition: z.string(),
  result: z.string(),
  home: z.string(),
  // total_distance: z.number(),
})
// export type AthleteSelect = { athlete_id: string }

export type GameFormData = {
  date: Date
  vs: string
  result: string
  home: boolean
  competition: string
  // total_distance: undefined,
}

type Props = {
  date: Date
  players: athlete[]
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

// eslint-disable-next-line no-unused-vars
export function GameForm({ date, players, setOpen }: Props) {
  // const playersArray = players.map((player) => {
  //   return { athlete_id: player.id }
  // })

  // const [selected, setSelected] = React.useState(playersArray)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      start_timestamp: date,
      start_time_hours: '18',
      start_time_minutes: '00',
      vs: '',
      competition: 'fnl',
      result: '',
      home: 'home',
      // total_distance: undefined,
    },
    mode: 'onChange',
  })

  const { toast } = useToast()

  function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      start_time_hours,
      start_time_minutes,
      start_timestamp,
      vs,
      competition,
      result,
      home,
      // total_distance,
    } = values

    const date = new Date(
      new Date(
        new Date(start_timestamp).setUTCHours(
          Number(start_time_hours),
          Number(start_time_minutes)
        )
      ).setDate(start_timestamp.getDate())
    )

    const newGame = {
      date,
      vs,
      competition,
      result,
      home: home === 'home',
      // total_distance,
    }

    setLoading(true)
    const actionResult = addGame(newGame)
    if (!actionResult) {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <div>{error}</div>
        <FormField
          control={form.control}
          name="home"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 gap-8 pt-2"
              >
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-secondary">
                    <FormControl>
                      <RadioGroupItem value="home" className="sr-only" />
                    </FormControl>
                    <div className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground flex items-center justify-center rounded-md border p-1">
                      <HomeIcon />
                      <span className="p-2 font-normal">Дома</span>
                    </div>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-secondary">
                    <FormControl>
                      <RadioGroupItem value="away" className="sr-only" />
                    </FormControl>
                    <div className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground flex items-center justify-center rounded-md border p-1">
                      <PlaneIcon />
                      <span className="p-2 font-normal">На выезде</span>
                    </div>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Соперник</FormLabel>
              <FormControl>
                <Input placeholder="Команда" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="result"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Счет матча</FormLabel>
              <FormControl>
                <Input placeholder="3-0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="competition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Соревнование</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип матча" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="fnl">ФНЛ</SelectItem>
                  <SelectItem value="cup">Кубок</SelectItem>
                  <SelectItem value="friendly">Товарищеский матч</SelectItem>
                </SelectContent>
              </Select>
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
                <FormLabel>Дата и время начала матча</FormLabel>
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
                  <Input placeholder="18" {...field} />
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
          <Button type="submit" disabled={loading}>
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  )
}
