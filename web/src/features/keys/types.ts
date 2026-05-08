export type NewKeyFormState = {
    service: string;
    projectName: string;
    environment: string;
    usageLimit: string;
    key: string;
};

export function createEmptyNewKeyFormState(): NewKeyFormState {
    return {
        service: '',
        projectName: '',
        environment: '',
        usageLimit: '',
        key: '',
    };
}
