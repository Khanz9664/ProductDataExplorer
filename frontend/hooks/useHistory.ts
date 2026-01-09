
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Simple mock user ID for now - in real app would come from AuthContext
const USER_ID = 'user-123';

export const useHistory = () => {
    const queryClient = useQueryClient();

    const { data: history, isLoading } = useQuery({
        queryKey: ['history', USER_ID],
        queryFn: async () => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const res = await fetch(`${API_URL}/history?userId=${USER_ID}`);
            if (!res.ok) throw new Error('Failed to fetch history');
            return res.json();
        }
    });

    const addToHistory = useMutation({
        mutationFn: async (productId: number) => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            await fetch(`${API_URL}/history`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: USER_ID, productId })
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['history', USER_ID] });
        }
    });

    return { history, isLoading, addToHistory };
};
