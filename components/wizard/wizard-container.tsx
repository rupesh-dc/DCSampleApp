'use client';

import { usePipelineStore } from '@/store/pipeline-store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface WizardContainerProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    onNext?: () => void;
    onBack?: () => void;
    isNextDisabled?: boolean;
    isSubmitting?: boolean;
    nextLabel?: string;
    backLabel?: string;
    showFooter?: boolean;
}

export function WizardContainer({
    children,
    title,
    description,
    onNext,
    onBack,
    isNextDisabled = false,
    isSubmitting = false,
    nextLabel = 'Next',
    backLabel = 'Back',
    showFooter = true,
}: WizardContainerProps) {
    const { steps, currentStep } = usePipelineStore();

    const currentStepIndex = steps.indexOf(currentStep);
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-8">
                {steps.map((step, index) => {
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;
                    const label = step.charAt(0).toUpperCase() + step.slice(1);

                    return (
                        <div key={step} className="flex flex-col items-center flex-1 relative">
                            {/* Connecting Line */}
                            {index !== 0 && (
                                <div
                                    className={cn(
                                        "absolute top-5 -left-[50%] right-[50%] h-[2px] transition-colors duration-300",
                                        index <= currentStepIndex ? "bg-primary" : "bg-secondary"
                                    )}
                                />
                            )}

                            <div
                                className={cn(
                                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 bg-background",
                                    isActive ? "border-primary text-primary" :
                                        isCompleted ? "border-primary bg-primary text-primary-foreground" : "border-muted text-muted-foreground"
                                )}
                            >
                                {isCompleted ? (
                                    <CheckCircle2 className="h-6 w-6" />
                                ) : (
                                    <span className="text-sm font-medium">{index + 1}</span>
                                )}
                            </div>
                            <span className={cn(
                                "mt-2 text-xs font-medium uppercase tracking-wider",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <Progress value={progress} className="h-1 mb-6" />

            {/* Main Content Card */}
            <Card className="w-full shadow-lg border-muted/40">
                <CardHeader className="space-y-1 bg-muted/5 border-b pb-6">
                    <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
                    {description && <CardDescription className="text-base">{description}</CardDescription>}
                </CardHeader>

                <CardContent className="pt-6 min-h-[400px]">
                    {children}
                </CardContent>

                {showFooter && (
                    <CardFooter className="flex justify-between border-t py-6 bg-muted/5">
                        <Button
                            variant="outline"
                            onClick={onBack}
                            disabled={currentStepIndex === 0 || isSubmitting}
                        >
                            {backLabel}
                        </Button>

                        <Button
                            onClick={onNext}
                            disabled={isNextDisabled || isSubmitting}
                            className="min-w-[100px]"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Processing...
                                </div>
                            ) : nextLabel}
                        </Button>
                    </CardFooter>
                )}
            </Card>

            {/* Footer Info */}
            <div className="text-center text-xs text-muted-foreground mt-8">
                Datachannel Pipeline Configuration • {new Date().getFullYear()}
            </div>
        </div>
    );
}
