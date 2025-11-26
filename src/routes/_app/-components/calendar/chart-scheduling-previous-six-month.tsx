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
import { useDadosGraficoUltimos6Meses } from '@/hooks/useDadosGraficoUltimos6Meses'
import { Input } from '@/components/ui/input'
import { CalendarIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ChartSchedulingPreviousSixMonthsProps {
    dataInicio: string
    dataFim: string
    onDataInicioChange: (data: string) => void
    onDataFimChange: (data: string) => void
}

// Função para formatar o número do mês em nome completo
function formatarMesCompleto(numeroMes: number): string {
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    return meses[numeroMes - 1]
}

// Função para obter o ano atual
function obterAnoAtual(): string {
    return new Date().getFullYear().toString()
}

// Função para converter data YYYY-MM-DD para número do mês
function extrairMesDaData(dataStr: string): number {
    const partes = dataStr.split('-')
    return parseInt(partes[1])
}

export function ChartSchedulingPreviousSixMonths({
    dataInicio,
    dataFim,
    onDataInicioChange,
    onDataFimChange
}: ChartSchedulingPreviousSixMonthsProps) {
    const { data, isLoading, error } = useDadosGraficoUltimos6Meses()
    
    // Estados temporários para as datas
    const [dataInicioTemp, setDataInicioTemp] = useState(dataInicio)
    const [dataFimTemp, setDataFimTemp] = useState(dataFim)

    // Sincroniza os valores temporários quando as props mudarem
    useEffect(() => {
        setDataInicioTemp(dataInicio)
        setDataFimTemp(dataFim)
    }, [dataInicio, dataFim])

    // Formata os dados da API para o formato do gráfico
    let chartData = data?.map(item => ({
        month: formatarMesCompleto(item.month),
        patient: item.count,
        mesNumero: item.month
    })) ?? []

    // Filtra dados baseado no período selecionado
    if (dataInicio && dataFim) {
        const mesInicio = extrairMesDaData(dataInicio)
        const mesFim = extrairMesDaData(dataFim)

        chartData = chartData.filter(item =>
            item.mesNumero >= mesInicio && item.mesNumero <= mesFim
        )
    }

    // Determina o período dinamicamente
    const periodo = chartData.length > 0 && data
        ? `${chartData[0].month} - ${chartData[chartData.length - 1].month} ${obterAnoAtual()}`
        : 'Janeiro - Junho 2025'

    const chartConfig = {
        patient: {
            label: "Pacientes",
            color: "var(--primary)",
        },
    } satisfies ChartConfig

    // Função para aplicar o filtro
    const aplicarFiltro = () => {
        onDataInicioChange(dataInicioTemp)
        onDataFimChange(dataFimTemp)
    }

    // Função para limpar o filtro
    const limparFiltro = () => {
        setDataInicioTemp('')
        setDataFimTemp('')
        onDataInicioChange('')
        onDataFimChange('')
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <CardTitle>Pacientes atendidos no período selecionado</CardTitle>
                        <CardDescription>{periodo}</CardDescription>
                    </div>

                    {/* Filtro de período sutil */}
                    <div className="flex gap-2 items-center flex-wrap md:flex-nowrap">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarIcon className="w-3 h-3" />
                            <span>Filtrar:</span>
                        </div>
                        <Input
                            type="date"
                            value={dataInicioTemp}
                            onChange={(e) => setDataInicioTemp(e.target.value)}
                            className="h-8 w-28 text-xs"
                            placeholder="Data inicial"
                        />
                        <span className="text-xs text-muted-foreground">até</span>
                        <Input
                            type="date"
                            value={dataFimTemp}
                            onChange={(e) => setDataFimTemp(e.target.value)}
                            className="h-8 w-28 text-xs"
                            placeholder="Data final"
                        />
                        <button
                            onClick={aplicarFiltro}
                            disabled={!dataInicioTemp || !dataFimTemp}
                            className="h-8 px-3 text-xs rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Aplicar
                        </button>
                        {(dataInicio || dataFim) && (
                            <button
                                onClick={limparFiltro}
                                className="h-8 px-2 text-xs rounded hover:bg-muted transition-colors"
                            >
                                Limpar
                            </button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="h-[450px] flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-muted-foreground">Carregando dados...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="h-[450px] flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-destructive font-medium mb-1">Erro ao carregar dados do gráfico</p>
                            <p className="text-sm text-muted-foreground">Tente novamente mais tarde</p>
                        </div>
                    </div>
                )}

                {!isLoading && !error && chartData.length > 0 && (
                    <ChartContainer config={chartConfig} className="h-[450px] w-full">
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                                top: 20,
                                bottom: 20,
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
                )}

                {!isLoading && !error && chartData.length === 0 && (
                    <div className="h-[450px] flex items-center justify-center">
                        <p className="text-muted-foreground">Nenhum dado disponível para exibir</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <span className="text-muted-foreground">Mind Helping Profissional &copy; 2025</span>
            </CardFooter>
        </Card>
    )
}