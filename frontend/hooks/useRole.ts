import { useMemo } from 'react';
import { UserRole } from '@/types/user';

interface UseRoleOptions {
    userRole?: UserRole;
    allowedRoles?: UserRole[];
}

export const useRole = ({ userRole, allowedRoles }: UseRoleOptions) => {
    const hasAccess = useMemo(() => {
        if (!userRole || !allowedRoles || allowedRoles.length === 0) {
            return false;
        }
        return allowedRoles.includes(userRole);
    }, [userRole, allowedRoles]);

    const isSuperAdmin = useMemo(() => userRole === 'SUPER_ADMIN' as any, [userRole]);
    const isAdmin = useMemo(() => userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' as any, [userRole]);
    const isTeacher = useMemo(() => userRole === 'TEACHER', [userRole]);
    const isStudent = useMemo(() => userRole === 'STUDENT', [userRole]);
    const isParent = useMemo(() => userRole === 'PARENT', [userRole]);
    const isAccountant = useMemo(() => userRole === 'ACCOUNTANT' as any, [userRole]);
    const isStaff = useMemo(() => userRole === 'STAFF' as any, [userRole]);

    return {
        hasAccess,
        isSuperAdmin,
        isAdmin,
        isTeacher,
        isStudent,
        isParent,
        isAccountant,
        isStaff,
    };
};
