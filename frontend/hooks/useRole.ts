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

    const isAdmin = useMemo(() => userRole === 'ADMIN', [userRole]);
    const isTeacher = useMemo(() => userRole === 'TEACHER', [userRole]);
    const isStudent = useMemo(() => userRole === 'STUDENT', [userRole]);
    const isParent = useMemo(() => userRole === 'PARENT', [userRole]);

    return {
        hasAccess,
        isAdmin,
        isTeacher,
        isStudent,
        isParent,
    };
};
