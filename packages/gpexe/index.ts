#!/usr/bin/env pnpx ts-node

import { Command } from 'commander'
import fetch from './cmd/fetch'
import create from './cmd/create'
import sheet from './cmd/sheet'
import gameFitness from './cmd/game_fitness'
import gameTtd from './cmd/game_ttd'

const program = new Command()
program
  .command('fetch')
  .description(
    'gets sessions and details for each session, saves into `temp_data`'
  )
  .option('-a --all', 'fetches all data', false)
  .action(async (args) => {
    fetch({ all: args.all })
  })

program
  .command('sheet')
  .description('export data to Google sheet')
  .action(sheet)

program
  .command('create')
  .description('reads `temp_data` and fills all data into database')
  .action(create)

program
  .command('game_fitness')
  .description('reads games data and fill database')
  .action(gameFitness)

program
  .command('game_ttd')
  .description('reads games data and fill database')
  .action(gameTtd)

program
  .option('-a --all', 'fetches all data', false)
  .description('fetch then create')
  .action(async (args) => {
    await fetch({ all: args.all })
    await create()
  })

program.parse()
