import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './card';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <Card className="w-full border-dashed bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                {Icon && <Icon className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />}
                <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>

                {action && (
                    <div className="mt-2">
                        {action}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
