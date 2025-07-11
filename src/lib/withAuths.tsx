'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
    const AuthenticatedComponent = (props: P) => {
        const router = useRouter();
        const [isChecking, setIsChecking] = useState(true);

        useEffect(() => {
            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/auth/signin');
            } else {
                setIsChecking(false);
            }
        }, [router]);

        if (isChecking) {
            return <div className='min-h-screen flex items-center justify-center'>Loading...</div>;
        }

        return <WrappedComponent {...props} />;
    };

    return AuthenticatedComponent;
}
