import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"


export interface CardsProps {
    title: string
    indicator: string
    description: string
    icon: LucideIcon
    dataInicio?: string
    dataFim?: string
}

export function CardIndicatorDashboard({ 
    title, 
    indicator, 
    description, 
    icon: Icon,
    dataInicio,
    dataFim
}: CardsProps) {
    return (
        <Card className="@container/card shadow border border-zinc-100 h-46">
            <CardHeader>
                <CardDescription className="flex items-center w-full justify-between font-medium text-base text-foreground">{title} {Icon && <Icon />}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {indicator}
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {description}
                </div>
            </CardFooter>
        </Card>
    )
}