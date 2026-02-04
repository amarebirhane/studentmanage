'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { useTransition } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const onSelectChange = (nextLocale: string) => {
        startTransition(() => {
            // @ts-ignore
            router.replace(pathname, { locale: nextLocale });
        });
    };

    const languages = {
        en: 'English',
        am: 'Amharic',
        or: 'Oromo',
        ti: 'Tigrigna'
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary transition-colors h-10 w-10">
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Switch Language</span>
                    <span className="absolute bottom-1 right-1 text-[8px] font-bold uppercase bg-primary text-white px-1 rounded-[4px] leading-tight min-w-[18px] text-center border border-background">{locale}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-none">
                {Object.entries(languages).map(([key, label]) => (
                    <DropdownMenuItem
                        key={key}
                        onClick={() => onSelectChange(key)}
                        className={locale === key ? 'bg-primary/10 font-bold text-primary' : ''}
                    >
                        {label} <span className="ml-auto text-xs opacity-50 uppercase">{key}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
