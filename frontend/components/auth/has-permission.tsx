import React from 'react';
import { useAuthStore } from '@/store/auth.store';

interface HasPermissionProps {
    module: string;
    action: 'view' | 'create' | 'edit' | 'delete';
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const HasPermission: React.FC<HasPermissionProps> = ({
    module,
    action,
    children,
    fallback = null,
}) => {
    const { user } = useAuthStore();

    if (!user) return <>{fallback}</>;

    // Super Admin and Admin have all permissions
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
        return <>{children}</>;
    }

    // Check granular permissions for other roles
    const permissions = user.permissions || [];
    const permission = permissions.find((p: any) => p.module === module);

    if (!permission) return <>{fallback}</>;

    const hasAction = (function () {
        switch (action) {
            case 'view': return permission.canView;
            case 'create': return permission.canCreate;
            case 'edit': return permission.canEdit;
            case 'delete': return permission.canDelete;
            default: return false;
        }
    })();

    return hasAction ? <>{children}</> : <>{fallback}</>;
};
