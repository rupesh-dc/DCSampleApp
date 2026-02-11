'use client';

import {
    WizardContainer
} from '@/components/wizard/wizard-container';
import { StepDatasources } from '@/components/wizard/step-datasources';
import { StepCredentials } from '@/components/wizard/step-credentials';
import { StepDefaultReports } from '@/components/wizard/step-default-reports';
import { StepReportLevels } from '@/components/wizard/step-report-levels';
import { StepReview } from '@/components/wizard/step-review';
import { usePipelineStore } from '@/store/pipeline-store';
import { useCreateConfiguredReport } from '@/lib/hooks/use-create-configured-report';
import { toast } from 'sonner';

export default function WizardPage() {
    const {
        currentStep,
        setStep,
        selectedDatasource,
        selectedCredential,
        selectedReportTemplates,
        levelHierarchy,
        selectedLevelValues,
        reset
    } = usePipelineStore();

    const createReportMutation = useCreateConfiguredReport(selectedDatasource?.slug);

    const handleNext = () => {
        switch (currentStep) {
            case 'datasources':
                setStep('credentials');
                break;
            case 'credentials':
                setStep('reports');
                break;
            case 'reports':
                setStep('levels');
                break;
            case 'levels':
                setStep('review');
                break;
            case 'review':
                handleSubmit();
                break;
        }
    };

    const handleBack = () => {
        switch (currentStep) {
            case 'credentials':
                setStep('datasources');
                break;
            case 'reports':
                setStep('credentials');
                break;
            case 'levels':
                setStep('reports');
                break;
            case 'review':
                setStep('levels');
                break;
        }
    };

    const handleSubmit = () => {
        if (!selectedDatasource || !selectedCredential) return;

        // Convert store structure to API payload structure
        const levelsPayload = levelHierarchy.map(l => ({
            level_id: l.level_id,
            level_name: l.level_name,
            value: selectedLevelValues[l.level_id] || []
        })).filter(l => l.value.length > 0); // Only send levels with values? Confirm with API spec if empty levels allowed.

        const payload = {
            credential_id: selectedCredential.id,
            levels: levelsPayload,
            client_name: "My Configured Report", // Ideally this should be an input in the review step
            templates: selectedReportTemplates.map(t => t.id),
            schedules: [] // As per requirement, empty for now or default
        };

        toast.promise(createReportMutation.mutateAsync(payload), {
            loading: 'Creating pipeline configuration...',
            success: () => {
                // Optional: Reset or redirect
                return 'Pipeline created successfully!';
            },
            error: (err) => {
                console.error(err);
                return 'Failed to create pipeline. Please try again.';
            }
        });
    };

    // Validation Logic for "Next" button
    const isNextDisabled = () => {
        switch (currentStep) {
            case 'datasources':
                return !selectedDatasource;
            case 'credentials':
                return !selectedCredential;
            case 'reports':
                return selectedReportTemplates.length === 0;
            case 'levels':
                // Check if all levels in hierarchy have a selection
                // This logic checks if every level in the hierarchy has at least one value selected
                // Note: Edge case if levelHierarchy is empty (no levels needed), then it's valid
                if (levelHierarchy.length === 0) return false;

                // Simple validation: Ensure at least the first level has a selection if hierarchy exists
                // More strict: Ensure ALL levels matching parent/child dependencies are filled
                // For MVP: Check if we have values for the levels that are rendered
                // This can be complex depending on API behavior (some levels optional?)
                // Let's enforce: If there are levels, at least one must be configured? 
                // Or strictly: All levels must be configured.
                return levelHierarchy.some(l => !selectedLevelValues[l.level_id] || selectedLevelValues[l.level_id].length === 0);
            case 'review':
                return false;
            default:
                return false;
        }
    };

    // Dynamic Titles
    const stepTitles = {
        datasources: { title: "Select Datasource", desc: "Choose the source you want to pull data from." },
        credentials: { title: "Select Credential", desc: "Choose an authenticated account." },
        reports: { title: "Select Reports", desc: "Choose the default reports to configure." },
        levels: { title: "Configure Levels", desc: "Set up the report hierarchy." },
        review: { title: "Review Configuration", desc: "Verify your settings before creating." }
    };

    return (
        <WizardContainer
            title={stepTitles[currentStep].title}
            description={stepTitles[currentStep].desc}
            onNext={handleNext}
            onBack={handleBack}
            isNextDisabled={isNextDisabled()}
            isSubmitting={createReportMutation.isPending}
            nextLabel={currentStep === 'review' ? 'Create Pipeline' : 'Next'}
        >
            {currentStep === 'datasources' && <StepDatasources />}
            {currentStep === 'credentials' && <StepCredentials />}
            {currentStep === 'reports' && <StepDefaultReports />}
            {currentStep === 'levels' && <StepReportLevels />}
            {currentStep === 'review' && <StepReview />}
        </WizardContainer>
    );
}
