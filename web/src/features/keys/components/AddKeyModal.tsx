import { useState, type ChangeEvent, type FormEvent } from 'react';

import Modal from '@/components/ui/Modal';
import type { CreateApiKeyPayload } from '@/types/api-key';
import {
    createEmptyNewKeyFormState,
    type NewKeyFormState,
} from '../types';

type AddKeyModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: CreateApiKeyPayload) => Promise<boolean>;
};

type FormFieldProps = {
    id: keyof NewKeyFormState;
    label: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    required?: boolean;
    step?: string;
    type?: 'number' | 'password' | 'text';
    value: string;
};

const inputClassName =
    'w-full rounded-xl border border-gray-700/50 bg-black/40 px-4 py-2.5 text-white transition-all placeholder:text-gray-600 focus:border-obsidian-accent focus:ring-1 focus:ring-obsidian-accent focus:outline-none';

function FormField({
    id,
    label,
    onChange,
    placeholder,
    required,
    step,
    type = 'text',
    value,
}: FormFieldProps) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor={id}>
                {label}
            </label>
            <input
                className={type === 'password' ? `${inputClassName} font-mono tracking-wider` : inputClassName}
                id={id}
                min={type === 'number' ? '0' : undefined}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                step={step}
                type={type}
                value={value}
            />
        </div>
    );
}

export default function AddKeyModal({ isOpen, onClose, onSubmit }: AddKeyModalProps) {
    const [formState, setFormState] = useState<NewKeyFormState>(createEmptyNewKeyFormState());
    const [localError, setLocalError] = useState<string | null>(null);

    function resetForm() {
        setFormState(createEmptyNewKeyFormState());
        setLocalError(null);
    }

    function handleClose() {
        resetForm();
        onClose();
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target;
        setFormState((currentState) => ({
            ...currentState,
            [id]: value,
        }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLocalError(null);

        const parsedUsageLimit =
            formState.usageLimit.trim() === '' ? undefined : Number(formState.usageLimit);

        if (
            parsedUsageLimit !== undefined &&
            (!Number.isFinite(parsedUsageLimit) || parsedUsageLimit < 0)
        ) {
            setLocalError('Usage limit must be a non-negative number.');
            return;
        }

        const didSave = await onSubmit({
            key: formState.key,
            modelName: formState.modelName.trim() || undefined,
            projectName: formState.projectName,
            service: formState.service,
            usageLimit: parsedUsageLimit,
        });

        if (didSave) {
            handleClose();
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Add New API Key">
            <form className="space-y-4" onSubmit={handleSubmit}>
                {localError ? <p className="text-sm text-red-400">{localError}</p> : null}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        id="service"
                        label="Service Name *"
                        onChange={handleChange}
                        placeholder="e.g., OpenAI"
                        required
                        value={formState.service}
                    />
                    <FormField
                        id="projectName"
                        label="Project Name *"
                        onChange={handleChange}
                        placeholder="e.g., My App"
                        required
                        value={formState.projectName}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        id="modelName"
                        label="Model Name (Optional)"
                        onChange={handleChange}
                        placeholder="e.g., GPT-4"
                        value={formState.modelName}
                    />
                    <FormField
                        id="usageLimit"
                        label="Usage Limit $ (Optional)"
                        onChange={handleChange}
                        placeholder="e.g., 50.00"
                        step="any"
                        type="number"
                        value={formState.usageLimit}
                    />
                </div>

                <FormField
                    id="key"
                    label="API Key *"
                    onChange={handleChange}
                    placeholder="sk-..."
                    required
                    type="password"
                    value={formState.key}
                />

                <button
                    className="mt-6 w-full rounded-xl bg-obsidian-accent py-3 font-semibold text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:bg-purple-600"
                    type="submit"
                >
                    Save API Key
                </button>
            </form>
        </Modal>
    );
}
