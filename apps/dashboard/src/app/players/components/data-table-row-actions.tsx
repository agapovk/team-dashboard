'use client'

import React from 'react'
import { athlete } from '@repo/db'
import { Row } from '@tanstack/react-table'

import { AthleteForm } from './athlete-form'

import '@repo/ui'

interface DataTableRowActionsProps {
  row: Row<athlete>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const data = row.original

  return <AthleteForm data={data} />
}
