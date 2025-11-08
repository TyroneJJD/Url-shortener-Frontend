import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CustomAlertDialogProps {
    isOpen: boolean;
    title: string;
    description: string;
    type: 'alert' | 'confirm';
    onConfirm: () => void;
    onCancel: () => void;
}

export function CustomAlertDialog({
    isOpen,
    title,
    description,
    type,
    onConfirm,
    onCancel,
}: CustomAlertDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {type === 'confirm' && (
                        <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
                    )}
                    <AlertDialogAction onClick={onConfirm}>
                        {type === 'confirm' ? 'Continue' : 'OK'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
