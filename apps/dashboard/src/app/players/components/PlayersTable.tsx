'use client'

import React from 'react'
import Link from 'next/link'
import { UTCDate } from '@date-fns/utc'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { athlete, position } from '@repo/db'
import { differenceInYears } from 'date-fns'

import { AthleteForm } from './athlete-form'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui'

type Props = {
  players: athlete[]
  positions: position[]
}

export default function PlayersTable({ players, positions }: Props) {
  const today = new Date()
  return (
    <Table className="border-collapse">
      <TableHeader>
        <TableRow>
          <TableHead className="h-10 w-4 text-center">Номер</TableHead>
          <TableHead className="h-10 text-center">Игрок</TableHead>
          <TableHead className="h-10 text-center">Возраст</TableHead>
          <TableHead className="h-10 text-center">Позиция</TableHead>
          <TableHead className="sr-only h-10 w-4">Редактировать</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell className="w-4 py-2 text-center">
              {player.number}
            </TableCell>
            <TableCell className="px-4 py-2">
              <Link href={`/players/${player.id}`} className="underline">
                {player.name}
              </Link>
            </TableCell>
            <TableCell className="py-2 text-center">
              {player.birthday &&
                differenceInYears(today, new UTCDate(player.birthday))}
            </TableCell>
            <TableCell className="py-2 text-center">
              {
                positions.find((position) => position.id === player.position_id)
                  ?.title
              }
            </TableCell>
            <TableCell className="w-4 p-2 py-2">
              <Dialog>
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
                    <DialogTitle>Редактировать игрока</DialogTitle>
                    <DialogDescription />
                  </DialogHeader>
                  <AthleteForm data={player} />
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
