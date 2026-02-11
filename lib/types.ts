export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}

export interface PaginationParams {
    order?: 'ASC' | 'DESC';
    order_by?: string;
    page?: number;
    size?: number;
}

export interface Datasource {
    id: number;
    slug: string;
    display_name: string;
    logo_url: string;
    description?: string;
    status?: string;
}

export interface Credential {
    id: number;
    credential_id: number; // Often the same as id, but sometimes distinct in API responses
    name: string;
    datasource_slug: string;
    created_at?: string;
    status?: string;
}

export interface DefaultReportTemplate {
    id: number;
    name: string;
    description?: string;
    category?: string;
}

export interface DefaultReport {
    credential_id: number;
    levels: ReportLevel[];
    client_name: string;
    templates: number[];
    schedules: any[];
}

export interface LevelValue {
    id: string; // The API might return this as string or number, ensuring string for consistency
    name: string;
}

export interface ReportLevel {
    level_id: number;
    level_name: string;
    name: string;
    value?: LevelValue[]; // Pre-populated values or selected values
    is_dynamic?: boolean; // Internal flag to know if we need to fetch values
}

export interface ConfiguredReportPayload {
    credential_id: number;
    levels: {
        level_id: number;
        level_name: string;
        value: LevelValue[];
    }[];
    client_name: string;
    templates: number[];
    schedules: any[];
}
