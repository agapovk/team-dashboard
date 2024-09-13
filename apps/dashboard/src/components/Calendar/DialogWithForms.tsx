import React from 'react'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { athlete } from '@repo/db'

import { GameForm } from './game-form'
import { SessionForm } from './session-form'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui'

type Props = {
  date: Date
  players: athlete[]
}

export default function DialogWithForms({ date, players }: Props) {
  const [open, setOpen] = React.useState(false)

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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Добавить</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Tabs defaultValue="session" className="">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="session">Тренировка</TabsTrigger>
            <TabsTrigger value="game">Игра</TabsTrigger>
          </TabsList>
          <TabsContent value="session">
            <SessionForm date={date} players={players} setOpen={setOpen} />
          </TabsContent>
          <TabsContent value="game">
            <GameForm date={date} players={players} setOpen={setOpen} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
