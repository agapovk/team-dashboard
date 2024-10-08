import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { cn } from '@repo/ui/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui'

type Props = {
  value?: number
  values: number[]
  min?: number
  max: number
  team_avg?: number
  position_avg?: number
  height?: number
  color?: string
  description?: string
}

const colors = ['bg-orange-300', 'bg-red-300', 'bg-blue-300', 'bg-green-300']

const invLerp = (from: number, to: number, value: number): number =>
  (value - from) / (to - from)

export function NewBar(props: Props) {
  const min = props.min ?? 0
  const values = props.values.map((v) => ({
    value: v,
    width: `${invLerp(min, props.max, v) * 100}%`,
  }))
  return (
    <div
      className={cn([
        'relative w-full overflow-visible rounded-full bg-slate-100',
        props.height !== undefined ? `h-[${props.height}px]` : 'h-4',
      ])}
    >
      {values.map((v, i) => {
        return (
          <div
            key={
              uuidv4()
              // `${i}_${v.value}`
            }
            style={{
              width: v.width,
              top: 0,
              left: i == 0 ? 0 : values.at(i - 1)?.width,
            }}
            className={cn(
              `absolute h-full rounded-s-full transition hover:saturate-150`,
              props.color !== undefined
                ? `bg-${props.color}`
                : colors[i % colors.length]
            )}
          >
            <span className="ml-2">
              {Number(props.value?.toFixed(0)).toLocaleString()}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function Bar(props: Props) {
  const min = props.min ?? 0
  const values = props.values.map((v) => ({
    value: v,
    width: `${invLerp(min, props.max, v) * 100}%`,
  }))
  return (
    <div
      className={cn([
        'relative w-full overflow-visible bg-slate-100',
        props.height !== undefined ? `h-[${props.height}px]` : 'h-[5px]',
      ])}
    >
      {values.map((v, i) => {
        return (
          <div
            key={
              uuidv4()
              // `${i}_${v.value}`
            }
            style={{
              width: v.width,
              top: 0,
              left: i == 0 ? 0 : values.at(i - 1)?.width,
            }}
            className={cn(
              `absolute h-full transition hover:saturate-150`,
              props.color !== undefined
                ? `bg-${props.color}`
                : colors[i % colors.length]
            )}
          />
        )
      })}
    </div>
  )
}

export function BarWithAvg(props: Props) {
  const min = props.min ?? 0
  const values = props.values.map((v) => ({
    value: v,
    width: `${invLerp(min, props.max, v) * 100}%`,
    team_avg: `${invLerp(min, props.max, props.team_avg ?? 0) * 100}%`,
  }))

  return (
    <div
      className={cn([
        'relative w-full overflow-visible bg-slate-100',
        props.height !== undefined ? `h-[${props.height}px]` : 'h-[5px]',
      ])}
    >
      {values.map((v, i) => {
        return (
          <>
            <div
              key={uuidv4()}
              style={{
                width: v.width,
                top: 0,
                left: i == 0 ? 0 : values.at(i - 1)?.width,
              }}
              className={cn(
                `absolute h-full transition hover:saturate-150`,
                props.color !== undefined
                  ? `bg-${props.color}`
                  : colors[i % colors.length]
              )}
            />
            <TooltipProvider key={uuidv4()} delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    style={{
                      top: 0,
                      bottom: 0,
                      margin: 'auto 0',
                      left: v.team_avg,
                    }}
                    className={cn(
                      'absolute h-[250%] w-[2px] bg-slate-500 dark:bg-slate-200'
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {`Среднее по команде: ${Number(props.team_avg?.toFixed(0)).toLocaleString()}`}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )
      })}
    </div>
  )
}

export function BarWithTooltip(props: Props) {
  const min = props.min ?? 0
  const values = props.values.map((v) => ({
    value: v,
    width: `${invLerp(min, props.max, v) * 100}%`,
  }))
  return (
    <TooltipProvider delayDuration={100}>
      <div
        className={cn([
          'relative w-full overflow-visible bg-slate-100',
          props.height !== undefined ? `h-[${props.height}px]` : 'h-[5px]',
        ])}
      >
        {values.map((v, i) => {
          return (
            <Tooltip key={v.value}>
              <TooltipTrigger asChild>
                <div
                  key={
                    uuidv4()
                    // `${i}_${v.value}`
                  }
                  style={{
                    width: v.width,
                    top: 0,
                    left: i == 0 ? 0 : values.at(i - 1)?.width,
                  }}
                  className={cn(
                    `absolute h-full transition hover:saturate-150`,
                    props.color !== undefined
                      ? `bg-${props.color}`
                      : colors[i % colors.length]
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{props.description}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}

type ProgressBarProps = {
  value: number
  minValue: number
  maxValue: number
  backgroundColor?: string
  average: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  minValue,
  maxValue,
  backgroundColor,
  average,
}) => {
  const clampedValue = Math.max(minValue, Math.min(value, maxValue))
  const clampedAverage = Math.max(minValue, Math.min(average, maxValue))

  // Calculate percentages for value and average
  const percentage = ((clampedValue - minValue) / (maxValue - minValue)) * 100
  const averagePercentage =
    ((clampedAverage - minValue) / (maxValue - minValue)) * 100

  return (
    <div className="relative h-4 overflow-hidden rounded-md border border-sky-500 bg-slate-50 text-left">
      {/* Value Bar */}
      <div
        className={cn('h-full', backgroundColor)}
        style={{
          width: `${percentage}%`,
        }}
      >
        <span className="ml-2">
          {Number(value.toFixed(0)).toLocaleString()}
        </span>
      </div>

      {/* Average Marker */}
      <div
        className={`absolute bottom-0 top-0 w-[2px] bg-slate-500`}
        style={{
          left: `${averagePercentage}%`,
        }}
      />
    </div>
  )
}
