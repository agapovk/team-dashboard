import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { cn } from "@repo/ui/lib/utils";

type Props = {
  values: number[];
  min?: number;
  max: number;
  height?: number;
  color?: string;
};

const colors = ["bg-orange-300", "bg-red-500", "bg-blue-300", "bg-green-400"];

const invLerp = (from: number, to: number, value: number) =>
  (value - from) / (to - from);

export default function BarWithAvg(props: Props) {
  const min = props.min ?? 0;
  const values = props.values.map((v, i) => ({
    value: v,
    width: `${invLerp(min, props.max, v) * 100}%`,
  }));
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <div
          className={cn([
            "relative w-full overflow-visible bg-slate-100",
            props.height !== undefined ? `h-[${props.height}px]` : "h-[5px]",
          ])}
        >
          {values.map((v, i) => {
            return (
              <div
                key={`${i}_${v.value}`}
                style={{
                  width: v.width,
                  top: 0,
                  left: i == 0 ? 0 : values.at(i - 1)?.width,
                }}
                className={cn(
                  `absolute h-full transition hover:saturate-150`,
                  props.color !== undefined
                    ? `bg-${props.color}`
                    : colors[i % colors.length],
                )}
              />
            );
          })}

          <TooltipTrigger asChild>
            <div
              style={{
                top: 0,
                bottom: 0,
                margin: "auto 0",
                left: "75%",
              }}
              className={cn(
                "absolute h-[250%] w-[2px] bg-slate-500 dark:bg-slate-200",
              )}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>AVG!</p>
          </TooltipContent>
        </div>
      </Tooltip>
    </TooltipProvider>
  );
}
