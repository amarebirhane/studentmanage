'use client';

import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/language-switcher';

export default function LandingNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const t = useTranslations('Common');
    const tl = useTranslations('Landing');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
            scrolled ? "bg-background/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                        <GraduationCap className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        EduSmart
                    </span>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                        {tl('moduleSubtitle')}
                    </Link>
                    <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
                        {t('home')}
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    <LanguageSwitcher />
                    <Link href="/login">
                        <Button variant="ghost" className="font-semibold text-muted-foreground hover:text-foreground">
                            {t('login')}
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button className="font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.05] rounded-xl px-6">
                            {tl('getStarted')}
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
