export type NewKeyFormState = {
    service: string;
    projectName: string;
    modelName: string;
    usageLimit: string;
    key: string;
};

export function createEmptyNewKeyFormState(): NewKeyFormState {
    return {
        service: '',
        projectName: '',
        modelName: '',
        usageLimit: '',
        key: '',
    };
}
