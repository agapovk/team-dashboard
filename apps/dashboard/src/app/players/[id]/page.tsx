import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import prisma from '@repo/db'
import { ageTitle, calculateAge, dayTitle, foot } from '~/src/utils'
import { differenceInDays, format } from 'date-fns'

import PlayerTabs from './components/PlayerTabs'
import { cn } from '@repo/ui/lib/utils'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui'

export const metadata: Metadata = {
  title: 'Статистика игрока',
  description: 'Игроки команды и их данные',
}

type Props = {
  params: { id: string }
}

export default async function PlayerPage({ params }: Props) {
  const player = await prisma.athlete.findUnique({
    where: {
      id: params.id,
    },
    include: {
      injury: true,
      position: true,
      athlete_games_fitness: {
        include: {
          game: true,
        },
        orderBy: {
          game: {
            date: 'desc',
          },
        },
      },
      athlete_games_ttd: {
        include: {
          game: true,
        },
        orderBy: {
          game: {
            date: 'desc',
          },
        },
      },
      athlete_sessions: {
        include: {
          session: true,
        },
        orderBy: {
          session: {
            start_timestamp: 'desc',
          },
        },
      },
    },
  })

  if (!player)
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Игрок не найден
            </h2>
            <p className="text-muted-foreground">Не нашли игрока {params.id}</p>
          </div>
        </div>
        <Button>
          <Link href="/players">Все игроки</Link>
        </Button>
      </div>
    )

  const age = player.birthday && calculateAge(player.birthday)
  const currentInjury = player.injury.find((inj) => inj.end_date === null)

  return (
    <div className="h-full flex-1 flex-col space-y-2 border p-8 md:flex">
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        <Card className="col-span-4 flex flex-col justify-between space-y-2 md:col-span-1">
          <CardHeader className="pb-0">
            <CardTitle className="text-foreground flex flex-col items-center space-y-3 font-normal">
              {player.photo && (
                <div className="relative w-full rounded-md border">
                  <Image
                    src={player.photo}
                    alt={player.name || ''}
                    width={1000}
                    height={1000}
                    className={cn('h-auto w-full object-cover')}
                  />
                  <span className="absolute left-4 top-4 text-3xl font-bold">
                    {player.number}
                  </span>
                </div>
              )}
              <span className="text-xl font-bold">{player.name}</span>
            </CardTitle>
            <CardDescription />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            {player.birthday && (
              <InfoField title="Возраст:" data={`${ageTitle(Number(age))}`} />
            )}
            {player.position && (
              <InfoField title="Позиция:" data={player.position.title} />
            )}
            <div>
              {player.foot && (
                <InfoField title="Нога:" data={foot(player.foot)} />
              )}
            </div>
            <div>
              {player.height && (
                <InfoField title="Рост:" data={`${player.height} см`} />
              )}
            </div>
            <div>
              {player.weight && (
                <InfoField title="Вес:" data={`${player.weight} кг`} />
              )}
            </div>
            {currentInjury && (
              <div className="pt-6">
                <InfoField
                  title="Текущая травма:"
                  data={`${format(currentInjury.start_date, 'dd.MM.yy')}`}
                />
                <div>
                  <p>{currentInjury.diagnosis}</p>
                  <p>{currentInjury.place}</p>
                  <p>{`Прогноз: ${currentInjury.estimated_recovery}`}</p>
                  <p>
                    {`Пропустил: ${differenceInDays(Date.now(), currentInjury.start_date)} ${dayTitle(differenceInDays(Date.now(), currentInjury.start_date))}`}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <PlayerTabs player={player} />
      </div>
    </div>
  )
}

type InfoProps = {
  title: string
  data: string
}
function InfoField({ title, data }: InfoProps): JSX.Element {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground">{title}</span>
      <span className="font-semibold">{data}</span>
    </div>
  )
}
