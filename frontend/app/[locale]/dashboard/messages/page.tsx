'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    MessageSquare,
    Inbox,
    Send,
    Plus,
    Loader2,
    Search,
    User,
    Clock,
    CheckCircle2,
    Trash2,
    Reply
} from 'lucide-react';
import { messageService } from '@/services/message.service';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function MessagesPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [sentMessages, setSentMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('inbox');
    const [selectedMessage, setSelectedMessage] = useState<any>(null);

    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [userSearchResults, setUserSearchResults] = useState<any[]>([]);
    const [searchingUsers, setSearchingUsers] = useState(false);
    const [selectedRecipient, setSelectedRecipient] = useState<any>(null);

    const [composeData, setComposeData] = useState({
        recipientId: '',
        subject: '',
        content: ''
    });

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const [inbox, sent] = await Promise.all([
                messageService.getMessages(),
                messageService.getSentMessages()
            ]);
            setMessages(inbox || []);
            setSentMessages(sent || []);
        } catch (error) {
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query: string) => {
        setUserSearchQuery(query);
        if (query.length < 2) {
            setUserSearchResults([]);
            return;
        }

        try {
            setSearchingUsers(true);
            const results = await messageService.searchUsers(query);
            setUserSearchResults(results || []);
        } catch (error) {
            console.error('Search failed');
        } finally {
            setSearchingUsers(false);
        }
    };

    const selectRecipient = (u: any) => {
        setSelectedRecipient(u);
        setComposeData(prev => ({ ...prev, recipientId: u.id }));
        setUserSearchQuery('');
        setUserSearchResults([]);
    };

    const handleReply = () => {
        if (!selectedMessage) return;
        const recipient = activeTab === 'inbox' ? selectedMessage.sender : selectedMessage.recipient;
        setSelectedRecipient(recipient);
        setComposeData({
            recipientId: recipient.id,
            subject: `Re: ${selectedMessage.subject}`,
            content: `\n\n-------------------\nOn ${format(new Date(selectedMessage.createdAt), 'PPpp')}, ${recipient.firstName} wrote:\n${selectedMessage.content}`
        });
        setIsComposeOpen(true);
    };

    const getFullAvatarUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${url}`;
    };

    const handleSend = async () => {
        if (!composeData.recipientId || !composeData.subject || !composeData.content) {
            toast.error('Please select a recipient and fill in all fields');
            return;
        }

        try {
            setSubmitting(true);
            await messageService.sendMessage(composeData);
            toast.success('Message sent successfully');
            setIsComposeOpen(false);
            setComposeData({ recipientId: '', subject: '', content: '' });
            setSelectedRecipient(null);
            fetchMessages();
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRead = async (msg: any) => {
        setSelectedMessage(msg);
        if (activeTab === 'inbox' && !msg.readAt) {
            try {
                const now = new Date().toISOString();
                // Optimistic update
                setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, readAt: now } : m));
                await messageService.markAsRead(msg.id);
            } catch (error) {
                console.error('Failed to mark as read');
                // Revert if failed
                setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, readAt: null } : m));
            }
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await messageService.deleteMessage(id);
            toast.success('Message deleted');
            if (activeTab === 'inbox') {
                setMessages(prev => prev.filter(m => m.id !== id));
            } else {
                setSentMessages(prev => prev.filter(m => m.id !== id));
            }
            setSelectedMessage(null);
        } catch (error) {
            toast.error('Failed to delete message');
        }
    }

    const displayedMessages = activeTab === 'inbox' ? messages : sentMessages;

    return (
        <div className="p-6 h-[calc(100vh-4rem)] flex flex-col max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                    <p className="text-muted-foreground mt-1">Direct communication with students, teachers, and admins.</p>
                </div>
                <Button onClick={() => setIsComposeOpen(true)} className="shadow-lg shadow-primary/20 gap-2">
                    <Plus className="h-4 w-4" /> Compose
                </Button>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                {/* Sidebar / List */}
                <Card className="col-span-12 md:col-span-5 lg:col-span-4 glass-card border-none flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                        <Tabs defaultValue="inbox" onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="inbox" className="gap-2">
                                    <Inbox className="h-4 w-4" /> Inbox
                                </TabsTrigger>
                                <TabsTrigger value="sent" className="gap-2">
                                    <Send className="h-4 w-4" /> Sent
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : displayedMessages.length > 0 ? (
                            displayedMessages.map((msg) => {
                                const participant = activeTab === 'inbox' ? msg.sender : msg.recipient;
                                return (
                                    <div
                                        key={msg.id}
                                        onClick={() => handleRead(msg)}
                                        className={cn(
                                            "p-4 rounded-xl cursor-pointer transition-all hover:bg-white/5 border border-transparent",
                                            selectedMessage?.id === msg.id ? "bg-primary/10 border-primary/20" : "",
                                            activeTab === 'inbox' && !msg.readAt ? "bg-secondary/20 font-medium" : "opacity-80"
                                        )}
                                    >
                                        <div className="flex gap-3">
                                            <Avatar className="h-10 w-10 border border-white/10 shrink-0">
                                                <AvatarImage src={getFullAvatarUrl(participant?.avatarUrl) || undefined} />
                                                <AvatarFallback className="bg-primary/5 text-primary text-xs uppercase">
                                                    {participant?.firstName?.[0]}{participant?.lastName?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-sm font-bold truncate pr-2">
                                                        {participant?.firstName} {participant?.lastName}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                        {format(new Date(msg.createdAt), 'MMM d')}
                                                    </span>
                                                </div>
                                                <p className="text-sm truncate text-foreground/90">{msg.subject}</p>
                                                <p className="text-xs text-muted-foreground truncate line-clamp-1">{msg.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                <p>No messages found</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Message Detail View */}
                <Card className="col-span-12 md:col-span-7 lg:col-span-8 glass-card border-none flex flex-col overflow-hidden h-full">
                    {selectedMessage ? (
                        <div className="flex flex-col h-full">
                            <CardHeader className="border-b border-white/5 pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-xl mb-4 truncate">{selectedMessage.subject}</CardTitle>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-white/10">
                                                    <AvatarImage src={getFullAvatarUrl(activeTab === 'inbox' ? selectedMessage.sender?.avatarUrl : selectedMessage.recipient?.avatarUrl) || undefined} />
                                                    <AvatarFallback className="bg-primary/5 text-primary text-xs">
                                                        {(activeTab === 'inbox' ? selectedMessage.sender?.firstName : selectedMessage.recipient?.firstName)?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-bold text-foreground">
                                                        {activeTab === 'inbox'
                                                            ? `${selectedMessage.sender?.firstName} ${selectedMessage.sender?.lastName}`
                                                            : `${selectedMessage.recipient?.firstName} ${selectedMessage.recipient?.lastName}`
                                                        }
                                                    </p>
                                                    <p className="text-[10px] uppercase tracking-wider opacity-60">
                                                        {activeTab === 'inbox' ? 'From' : 'To'} • {activeTab === 'inbox' ? selectedMessage.sender?.role : selectedMessage.recipient?.role}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 ml-auto">
                                                <span className="text-xs flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                                    {format(new Date(selectedMessage.createdAt), 'PPpp')}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {activeTab === 'inbox' && (
                                                        <Button variant="outline" size="sm" onClick={handleReply} className="h-8 gap-2 border-white/10 hover:bg-white/5">
                                                            <Reply className="h-3.5 w-3.5" /> Reply
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleDelete(selectedMessage.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-8">
                                <div className="max-w-none prose prose-invert">
                                    <p className="whitespace-pre-wrap leading-relaxed text-base text-foreground/90">
                                        {selectedMessage.content}
                                    </p>
                                </div>
                            </CardContent>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <div className="h-20 w-20 rounded-full bg-secondary/20 flex items-center justify-center mb-6">
                                <MessageSquare className="h-10 w-10 opacity-30" />
                            </div>
                            <h3 className="text-lg font-medium mb-1">Select a message</h3>
                            <p className="text-sm opacity-60">Choose a message from the list to view details</p>
                        </div>
                    )}
                </Card>
            </div>

            <Dialog open={isComposeOpen} onOpenChange={(open) => {
                setIsComposeOpen(open);
                if (!open) {
                    setUserSearchQuery('');
                    setUserSearchResults([]);
                    if (!composeData.content.includes('---')) { // Only reset if not a reply
                        setSelectedRecipient(null);
                        setComposeData({ recipientId: '', subject: '', content: '' });
                    }
                }
            }}>
                <DialogContent className="glass-card border-none sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>New Message</DialogTitle>
                        <DialogDescription>Direct and private communication.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Recipient</Label>
                            {selectedRecipient ? (
                                <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20 animate-in zoom-in duration-200">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={getFullAvatarUrl(selectedRecipient.avatarUrl) || undefined} />
                                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                                {selectedRecipient.firstName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-bold">{selectedRecipient.firstName} {selectedRecipient.lastName}</p>
                                            <p className="text-[10px] opacity-60">{selectedRecipient.role}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedRecipient(null)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name or email..."
                                        className="glass border-white/10 pl-9"
                                        value={userSearchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                    {searchingUsers && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <Loader2 className="h-4 w-4 animate-spin opacity-50" />
                                        </div>
                                    )}

                                    {userSearchResults.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1c1e] border border-white/10 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 max-h-[250px] overflow-y-auto">
                                            {userSearchResults.map((u) => (
                                                <div
                                                    key={u.id}
                                                    className="p-3 flex items-center gap-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                                                    onClick={() => selectRecipient(u)}
                                                >
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={getFullAvatarUrl(u.avatarUrl) || undefined} />
                                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                            {u.firstName?.[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-bold truncate">{u.firstName} {u.lastName}</p>
                                                        <p className="text-[10px] opacity-60 truncate">{u.role} • {u.email}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Subject</Label>
                            <Input
                                placeholder="What is this about?"
                                className="glass border-white/10"
                                value={composeData.subject}
                                onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Message</Label>
                            <Textarea
                                placeholder="Write your message here..."
                                className="glass border-white/10 min-h-[150px] resize-none"
                                value={composeData.content}
                                onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" className="h-11 px-6 rounded-xl" onClick={() => setIsComposeOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleSend}
                            disabled={submitting}
                            className="h-11 px-8 rounded-xl shadow-lg shadow-primary/20 min-w-[140px]"
                        >
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                <span className="flex items-center gap-2">
                                    <Send className="h-4 w-4" /> Send Message
                                </span>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
