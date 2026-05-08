import { useMutation } from '@tanstack/react-query';
import { bankAccountApi } from '@/api/me';


export const useBankAccounts = () => {
    return useMutation({
        mutationFn: () => bankAccountApi.getBankAccounts(),
        onSuccess: (data) => {
            console.log('useBankAccounts data.message:', data.message);
            console.log('useBankAccounts data', data);
        },
    });
}

export const useAddBankAccount = () => {
    return useMutation({
        mutationFn: (payload) => bankAccountApi.postBankAccount(payload),
        onSuccess: (data) => {
            console.log('useAddBankAccount data.message:', data.message);
            console.log('useAddBankAccount data', data);
        }
    });
}

export const useDeleteBankAccount = () => {
    return useMutation({
        mutationFn: (payload) => bankAccountApi.deleteBankAccount(payload),
        onSuccess: (data) => {
            console.log('useDeleteBankAccount data.message:', data.message);
            console.log('useDeleteBankAccount data', data);
        }
    });
}