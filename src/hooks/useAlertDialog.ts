import { useState } from 'react';

interface AlertDialogState {
    isOpen: boolean;
    title: string;
    description: string;
    type: 'alert' | 'confirm';
    onConfirm?: () => void;
}

export function useAlertDialog() {
    const [dialogState, setDialogState] = useState<AlertDialogState>({
        isOpen: false,
        title: '',
        description: '',
        type: 'alert',
    });

    const showAlert = (title: string, description: string) => {
        setDialogState({
            isOpen: true,
            title,
            description,
            type: 'alert',
        });
    };

    const showConfirm = (
        title: string,
        description: string,
        onConfirm: () => void
    ) => {
        setDialogState({
            isOpen: true,
            title,
            description,
            type: 'confirm',
            onConfirm,
        });
    };

    const handleConfirm = () => {
        if (dialogState.onConfirm) {
            dialogState.onConfirm();
        }
        setDialogState((prev) => ({ ...prev, isOpen: false }));
    };

    const handleCancel = () => {
        setDialogState((prev) => ({ ...prev, isOpen: false }));
    };

    return {
        dialogState,
        showAlert,
        showConfirm,
        handleConfirm,
        handleCancel,
    };
}
