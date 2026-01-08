
'use client';

import { useEffect } from 'react';
import { useHistory } from '@/hooks/useHistory';

export default function ProductHistoryTracker({ productId }: { productId: number }) {
    const { addToHistory } = useHistory();

    useEffect(() => {
        if (productId) {
            addToHistory.mutate(productId);
        }
    }, [productId, addToHistory]);

    return null;
}
