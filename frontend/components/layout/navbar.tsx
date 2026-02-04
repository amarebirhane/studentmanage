import { Bell, LogOut, Search, User, Check, X } from 'lucide-react';
import { Link, useRouter } from '@/navigation';
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
import { useEffect, useState, useRef } from 'react';
import { notificationService } from '@/services/notification.service';
import { searchService } from '@/services/search.service';
import { formatDistanceToNow } from 'date-fns';
import LanguageSwitcher from '@/components/language-switcher';
import { useTranslations } from 'next-intl';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const t = useTranslations('Common');
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any>(null);
    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await notificationService.getMyNotifications() || [];
                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !n.readAt).length);
            } catch (error) {
                console.error('Failed to fetch notifications', error);
            }
        };

        if (user) {
            fetchNotifications();
            // Refresh notifications every minute
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        const handleSearch = async () => {
            if (searchQuery.length < 2) {
                setSearchResults(null);
                return;
            }
            try {
                const results = await searchService.globalSearch(searchQuery);
                setSearchResults(results);
                setShowSearch(true);
            } catch (error) {
                console.error('Search failed', error);
            }
        };

        const timeoutId = setTimeout(handleSearch, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearch(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, readAt: new Date() } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date() })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

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
                <div className="relative max-w-md w-full hidden md:block" ref={searchRef}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery.length >= 2 && setShowSearch(true)}
                        className="w-full bg-secondary/50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                    />

                    {showSearch && searchResults && (
                        <div className="absolute top-full left-0 right-0 mt-2 glass-card border rounded-xl shadow-2xl overflow-hidden max-h-[400px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-2 border-b bg-muted/30 flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">{t('searchResults')}</span>
                                <button onClick={() => setShowSearch(false)}><X className="h-3 w-3 text-muted-foreground hover:text-foreground" /></button>
                            </div>

                            {/* Students */}
                            {searchResults.students?.length > 0 && (
                                <div className="p-1">
                                    <div className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase opacity-50">{t('students')}</div>
                                    {searchResults.students.map((res: any) => (
                                        <button
                                            key={res.id}
                                            onClick={() => { router.push(res.link); setShowSearch(false); setSearchQuery(''); }}
                                            className="w-full flex items-center gap-3 p-2 hover:bg-primary/5 rounded-lg transition-colors group text-left"
                                        >
                                            <Avatar className="h-8 w-8 border border-primary/10">
                                                <AvatarImage src={res.avatar} />
                                                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">{res.title[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">{res.title}</p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">{res.subtitle}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Teachers */}
                            {searchResults.teachers?.length > 0 && (
                                <div className="p-1 border-t">
                                    <div className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase opacity-50">{t('teachers')}</div>
                                    {searchResults.teachers.map((res: any) => (
                                        <button
                                            key={res.id}
                                            onClick={() => { router.push(res.link); setShowSearch(false); setSearchQuery(''); }}
                                            className="w-full flex items-center gap-3 p-2 hover:bg-primary/5 rounded-lg transition-colors group text-left"
                                        >
                                            <Avatar className="h-8 w-8 border border-primary/10">
                                                <AvatarImage src={res.avatar} />
                                                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">{res.title[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">{res.title}</p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">{res.subtitle}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* No results */}
                            {(!searchResults.students?.length && !searchResults.teachers?.length && !searchResults.classes?.length) && (
                                <div className="p-8 text-center text-sm text-muted-foreground italic">{t('noMatches')} "{searchQuery}"</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <LanguageSwitcher />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors group">
                            <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 h-4 w-4 bg-primary text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-background animate-in zoom-in duration-300">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 glass-card border-none mt-2 p-0 overflow-hidden">
                        <div className="p-4 border-b bg-primary/5 flex items-center justify-between">
                            <h3 className="font-bold">{t('notifications')}</h3>
                            {unreadCount > 0 && (
                                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-7 text-[10px] font-bold text-primary hover:text-primary/80 hover:bg-primary/10">
                                    {t('markAllRead')}
                                </Button>
                            )}
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div key={notification.id} className={`p-4 border-b last:border-0 hover:bg-muted/50 transition-colors relative group ${!notification.readAt ? 'bg-primary/[0.02]' : ''}`}>
                                        {!notification.readAt && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full" />}
                                        <div className="flex justify-between gap-2">
                                            <div className="space-y-1">
                                                <p className={`text-sm ${!notification.readAt ? 'font-bold' : 'font-medium'}`}>{notification.title}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                                                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">
                                                    {formatDistanceToNow(new Date(notification.sentAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                            {!notification.readAt && (
                                                <button
                                                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                    className="opacity-0 group-hover:opacity-100 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all"
                                                >
                                                    <Check className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-muted-foreground space-y-2">
                                    <Bell className="h-8 w-8 mx-auto opacity-20" />
                                    <p className="text-sm italic">{t('caughtUp')}</p>
                                </div>
                            )}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-8 w-[1px] bg-border mx-2" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 p-1 rounded-xl hover:bg-secondary/80 transition-all group">
                            <Avatar className="h-10 w-10 border-2 border-primary/10 group-hover:border-primary/30 transition-all shadow-sm">
                                <AvatarImage src={getAvatarUrl()} alt={user?.firstName || 'User'} />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-left hidden sm:block">
                                <p className="text-sm font-bold leading-none">{user?.firstName} {user?.lastName}</p>
                                <p className="text-[10px] text-muted-foreground mt-1 capitalize font-medium">{user?.role?.toLowerCase()}</p>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 glass-card border-none mt-2">
                        <DropdownMenuLabel className="flex flex-col gap-1 p-4 bg-muted/30">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t('loggedInAs')}</span>
                            <span className="text-sm font-bold">{user?.email}</span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile" className="flex items-center cursor-pointer p-3 font-medium">
                                <User className="mr-3 h-4 w-4 text-primary" />
                                <span>{t('profileSettings')}</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer p-3 font-medium text-destructive focus:text-destructive focus:bg-destructive/5" onClick={() => logout()}>
                            <LogOut className="mr-3 h-4 w-4" />
                            <span>{t('signOut')}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
