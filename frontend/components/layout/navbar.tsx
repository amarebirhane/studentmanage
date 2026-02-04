import { Bell, LogOut, Search, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
    const { user, logout } = useAuth();

    const getAvatarUrl = () => {
        if (user?.avatarUrl) {
            return user.avatarUrl.startsWith('http')
                ? user.avatarUrl
                : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${user.avatarUrl}`;
        }
        return user?.email ? `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}` : '';
    };

    return (
        <header className="h-20 glass border-b px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full bg-secondary/50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full border-2 border-background" />
                </button>

                <div className="h-8 w-[1px] bg-border mx-2" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 p-1 rounded-xl hover:bg-secondary/80 transition-all">
                            <Avatar className="h-10 w-10 border border-primary/20">
                                <AvatarImage src={getAvatarUrl()} alt={user?.firstName || 'User'} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-left hidden sm:block">
                                <p className="text-sm font-semibold leading-none">{user?.firstName} {user?.lastName}</p>
                                <p className="text-xs text-muted-foreground mt-1 capitalize">{user?.role?.toLowerCase()}</p>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 glass-card border-none mt-2">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile" className="flex items-center cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <Bell className="mr-2 h-4 w-4" />
                            <span>Notifications</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => logout()}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
