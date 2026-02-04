'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, GraduationCap, Calendar, Award, BookOpen } from 'lucide-react';
import { examService } from '@/services/exam.service';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ExamsPage() {
    const [exams, setExams] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [examsData, resultsData] = await Promise.all([
                examService.getExams(),
                examService.getMyResults() // Implements this in exam service if missing, or use existing endpoint
            ]);
            setExams(examsData || []);
            setResults(resultsData || []);
        } catch (error) {
            toast.error('Failed to load exam data');
        } finally {
            setLoading(false);
        }
    };

    const upcomingExams = exams.filter(e => new Date(e.examDate) >= new Date());

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Exams & Results</h1>
                <p className="text-muted-foreground mt-1">View exam schedules and your academic performance.</p>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="upcoming" className="gap-2">
                        <Calendar className="h-4 w-4" /> Upcoming Exams
                    </TabsTrigger>
                    <TabsTrigger value="results" className="gap-2">
                        <Award className="h-4 w-4" /> My Results
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        </div>
                    ) : upcomingExams.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingExams.map((exam) => (
                                <Card key={exam.id} className="glass-card border-none hover:ring-1 hover:ring-primary/20 transition-all">
                                    <div className="absolute top-0 right-0 p-4">
                                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            {format(new Date(exam.examDate), 'MMM d')}
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-xl pr-12">{exam.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <BookOpen className="h-3.5 w-3.5" />
                                            {exam.subject?.name}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between border-b border-white/5 pb-2">
                                                <span className="text-muted-foreground">Date</span>
                                                <span className="font-medium">{format(new Date(exam.examDate), 'PPP')}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-white/5 pb-2">
                                                <span className="text-muted-foreground">Time</span>
                                                <span className="font-medium">{format(new Date(exam.examDate), 'p')}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Max Marks</span>
                                                <span className="font-medium">{exam.maxMarks}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="glass-card border-none p-12 text-center text-muted-foreground">
                            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <h3 className="text-lg font-medium">No upcoming exams</h3>
                            <p>Time to study!</p>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="results" className="space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        </div>
                    ) : results.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {results.map((result) => (
                                <Card key={result.id} className="glass-card border-none p-4 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className={cn(
                                            "h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold border",
                                            (result.scoredMarks / result.totalMarks) >= 0.7 ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                                (result.scoredMarks / result.totalMarks) >= 0.4 ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                                                    "bg-red-500/10 text-red-500 border-red-500/20"
                                        )}>
                                            {result.grade || '?'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{result.exam?.name}</h4>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                <BookOpen className="h-3 w-3" /> {result.subject?.name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-center">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Score</p>
                                            <p className="font-bold text-xl">{result.scoredMarks} <span className="text-muted-foreground text-sm font-normal">/ {result.totalMarks}</span></p>
                                        </div>
                                        <div className="text-center hidden sm:block">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Percentage</p>
                                            <p className="font-bold text-xl">{Math.round((result.scoredMarks / result.totalMarks) * 100)}%</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="glass-card border-none p-12 text-center text-muted-foreground">
                            <Award className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <h3 className="text-lg font-medium">No results published yet</h3>
                            <p>Check back later for your grades.</p>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
