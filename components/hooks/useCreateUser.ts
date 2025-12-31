import { createUser, getallUsers } from "@/services/user.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            // Invalidate and refetch users after creating a new one
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error: any) => {
            console.error('Error creating user:', error);
        }
    });
}

// FIX: Use useQuery instead of useMutation for fetching data
export const useGetAllUsers = () => {
    return useQuery({
        queryKey: ['users'], // Important: This must match the key used in invalidateQueries
        queryFn: getallUsers
    });
}