'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    Trash2
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

export default function MessagesPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [sentMessages, setSentMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('inbox');
    const [selectedMessage, setSelectedMessage] = useState<any>(null);

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

    const handleSend = async () => {
        if (!composeData.recipientId || !composeData.subject || !composeData.content) {
            toast.error('Please fill in all fields (Recipient ID required for now)');
            return;
        }

        try {
            setSubmitting(true);
            await messageService.sendMessage(composeData);
            toast.success('Message sent successfully');
            setIsComposeOpen(false);
            setComposeData({ recipientId: '', subject: '', content: '' });
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
                await messageService.markAsRead(msg.id);
                setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, readAt: new Date().toISOString() } : m));
            } catch (error) {
                console.error('Failed to mark as read');
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
                            displayedMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    onClick={() => handleRead(msg)}
                                    className={cn(
                                        "p-4 rounded-xl cursor-pointer transition-all hover:bg-white/5 border border-transparent",
                                        selectedMessage?.id === msg.id ? "bg-primary/10 border-primary/20" : "",
                                        activeTab === 'inbox' && !msg.readAt ? "bg-secondary/20 font-medium" : "opacity-80"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-bold truncate pr-2">
                                            {activeTab === 'inbox'
                                                ? `${msg.sender?.firstName} ${msg.sender?.lastName}`
                                                : `${msg.recipient?.firstName} ${msg.recipient?.lastName}`
                                            }
                                        </span>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                            {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                                        </span>
                                    </div>
                                    <p className="text-sm truncate text-foreground/90">{msg.subject}</p>
                                    <p className="text-xs text-muted-foreground truncate line-clamp-1">{msg.content}</p>
                                </div>
                            ))
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
                                    <div>
                                        <CardTitle className="text-xl mb-2">{selectedMessage.subject}</CardTitle>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground">
                                                        {activeTab === 'inbox'
                                                            ? `${selectedMessage.sender?.firstName} ${selectedMessage.sender?.lastName}`
                                                            : `${selectedMessage.recipient?.firstName} ${selectedMessage.recipient?.lastName}`
                                                        }
                                                    </p>
                                                    <p className="text-xs">{activeTab === 'inbox' ? 'Sender' : 'Recipient'}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs flex items-center gap-1 ml-auto">
                                                <Clock className="h-3 w-3" />
                                                {format(new Date(selectedMessage.createdAt), 'PPpp')}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(selectedMessage.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-6">
                                <p className="whitespace-pre-wrap leading-relaxed text-sm">
                                    {selectedMessage.content}
                                </p>
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

            <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
                <DialogContent className="glass-card border-none sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>New Message</DialogTitle>
                        <DialogDescription>Send a private message.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Recipient ID</Label>
                            <Input
                                placeholder="Enter User ID"
                                className="glass border-white/10"
                                value={composeData.recipientId}
                                onChange={(e) => setComposeData(prev => ({ ...prev, recipientId: e.target.value }))}
                            />
                            <p className="text-[10px] text-muted-foreground">Enter the unique ID of the user you want to message.</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Input
                                placeholder="Message Subject"
                                className="glass border-white/10"
                                value={composeData.subject}
                                onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Content</Label>
                            <Textarea
                                placeholder="Type your message..."
                                className="glass border-white/10 min-h-[150px]"
                                value={composeData.content}
                                onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsComposeOpen(false)}>Cancel</Button>
                        <Button onClick={handleSend} disabled={submitting}>
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Message'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
