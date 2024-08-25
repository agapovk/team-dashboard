'use client'

import React from 'react'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { athlete } from '@repo/db'
import { Row } from '@tanstack/react-table'

import { AthleteForm } from './athlete-form'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui'

interface DataTableRowActionsProps {
  row: Row<athlete>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const data = row.original

  return (
    <div className="flex items-center gap-3 text-sm">
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
          </DialogHeader>
          <AthleteForm data={data} />
        </DialogContent>
      </Dialog>
    </div>
  )
}