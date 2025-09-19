import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

export function ChartSchedulingPreviousSixMonths() {
    const chartData = [
        { month: "Janiero", patient: 20 },
        { month: "Fevereiro", patient: 22 },
        { month: "Março", patient: 17 },
        { month: "Abril", patient: 19 },
        { month: "Maio", patient: 25 },
        { month: "Junho", patient: 35 },
    ]

    const chartConfig = {
        patient: {
            label: "Pacientes",
            color: "var(--primary)",
        },
    } satisfies ChartConfig



    return (
        <Card>
            <CardHeader>
                <CardTitle>Pacientes atendidos nos últimos 6 meses</CardTitle>
                <CardDescription>Janeiro - Junho 2025</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="patient"
                            type="natural"
                            stroke="var(--color-patient)"
                            strokeWidth={2}
                            dot={{
                                fill: "var(--primary-foreground)",
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <span className="text-muted-foreground">Mind Helping Profissional &copy; 2024</span>
            </CardFooter>
        </Card>)
}