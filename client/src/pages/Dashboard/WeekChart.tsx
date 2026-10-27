import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart';
import type { DayTotal } from '@/lib/dashboard';
import { formatDuration } from '@/lib/time';

// Cores do tema direto nos eixos: o seletor de classes do chart.tsx não pega os textos do Recharts 3
const TICK = { fill: 'var(--muted-foreground)', fontSize: 12 };

const chartConfig = {
  hours: { label: 'Horas estudadas', color: 'var(--color-progress)' },
} satisfies ChartConfig;

/** Gráfico de barras: horas estudadas por dia nos últimos 7 dias (DB4). */
export function WeekChart({ days }: { days: DayTotal[] }) {
  const data = days.map((day) => ({ ...day, hours: day.minutes / 60 }));
  const maxHours = Math.max(1, Math.ceil(Math.max(...data.map((day) => day.hours))));
  const total = days.reduce((sum, day) => sum + day.minutes, 0);

  return (
    <>
      <ChartContainer config={chartConfig} aria-hidden="true" className="aspect-auto h-60 w-full">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="label" tick={TICK} tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            domain={[0, maxHours]}
            allowDecimals={false}
            tick={TICK}
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            tickFormatter={(value: number) => `${value}h`}
          />
          <ChartTooltip
            cursor={false}
            content={({ active, payload }) => {
              const day = payload?.[0]?.payload as (DayTotal & { hours: number }) | undefined;
              if (!active || !day) return null;
              return (
                <div className="rounded-lg border bg-popover px-3 py-2 text-sm font-medium text-popover-foreground shadow-md">
                  {day.fullLabel} — {formatDuration(day.minutes)}
                </div>
              );
            }}
          />
          <Bar dataKey="hours" fill="var(--color-hours)" radius={[6, 6, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ChartContainer>

      {/* O gráfico é só visual; o leitor de tela recebe os mesmos dados em lista */}
      <ul className="sr-only">
        {days.map((day) => (
          <li key={day.fullLabel}>
            {day.fullLabel}: {formatDuration(day.minutes)}
          </li>
        ))}
        <li>Total nos 7 dias: {formatDuration(total)}</li>
      </ul>
    </>
  );
}
