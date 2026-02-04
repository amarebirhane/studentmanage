'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { studentSchema, updateStudentSchema } from '@/lib/validation';
import toast from 'react-hot-toast';
import { Upload, User, Phone, Mail, Hash, MapPin, Shield, BookOpen, Layers, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StudentFormProps {
  studentId?: string;
  initialData?: any;
}

const StudentForm = ({ studentId, initialData }: StudentFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    enrollmentNo: '',
    age: '',
    gender: 'MALE',
    dateOfBirth: '',
    contactAddress: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    classId: '',
    sectionId: '',
    avatarUrl: null,
    password: '',
  });

  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [classesRes, sectionsRes] = await Promise.all([
        api.get('/classes'),
        api.get('/classes/sections')
      ]);
      setClasses(classesRes.data.data || []);
      setSections(sectionsRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch classes/sections');
    }
  };

  useEffect(() => {
    if (initialData) {
      const { user, ...profile } = initialData;
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        enrollmentNo: profile.enrollmentNo || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || 'MALE',
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        contactAddress: profile.contactAddress || '',
        guardianName: profile.guardianName || '',
        guardianPhone: profile.guardianPhone || '',
        guardianEmail: profile.guardianEmail || '',
        classId: profile.classId || '',
        sectionId: profile.sectionId || '',
        avatarUrl: profile.avatarUrl || null,
        password: '',
      });
      if (profile.avatarUrl) {
        setAvatarPreview(profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${profile.avatarUrl}`);
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Avatar size must be less than 2MB');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;
    const data = new FormData();
    data.append('file', avatarFile);
    try {
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.url;
    } catch (error) {
      toast.error('Avatar upload failed');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    let avatarUrl = formData.avatarUrl;
    if (avatarFile) {
      const uploaded = await uploadAvatar();
      if (!uploaded) {
        setLoading(false);
        return;
      }
      avatarUrl = uploaded;
    }

    const { age, password, ...rest } = formData;
    const submitData: any = {
      ...rest,
      age: age ? parseInt(age) : undefined,
      classId: rest.classId && rest.classId.trim() !== '' ? rest.classId : undefined,
      sectionId: rest.sectionId && rest.sectionId.trim() !== '' ? rest.sectionId : undefined,
      avatarUrl
    };

    if (!studentId) {
      submitData.password = password;
    }

    const schema = studentId ? updateStudentSchema : studentSchema;
    const result = schema.safeParse(submitData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      if (studentId) {
        await api.put(`/students/${studentId}`, submitData);
        toast.success('Student record updated');
      } else {
        await api.post('/students', submitData);
        toast.success('New student added successfully');
      }
      router.push('/dashboard/admin/students');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Essential Info */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Personal Information
              </CardTitle>
              <CardDescription>Basic details of the student</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>First Name <span className="text-destructive">*</span></Label>
                <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" />
                {errors['firstName'] && <p className="text-xs text-destructive">{errors['firstName']}</p>}
              </div>
              <div className="space-y-2">
                <Label>Last Name <span className="text-destructive">*</span></Label>
                <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" />
                {errors['lastName'] && <p className="text-xs text-destructive">{errors['lastName']}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email Address <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} className="pl-9" placeholder="john.doe@example.com" />
                </div>
                {errors['email'] && <p className="text-xs text-destructive">{errors['email']}</p>}
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input name="phone" value={formData.phone} onChange={handleChange} className="pl-9" placeholder="+1 234 567 890" />
                </div>
              </div>
              {!studentId && (
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-9"
                      placeholder="Default: Student@123"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={formData.gender} onValueChange={(v) => handleSelectChange('gender', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Guardian Details
              </CardTitle>
              <CardDescription>Emergency contact information</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Guardian Name</Label>
                <Input name="guardianName" value={formData.guardianName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Guardian Phone</Label>
                <Input name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <textarea
                    name="contactAddress"
                    value={formData.contactAddress}
                    onChange={handleChange}
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Residential address..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Academic & Photo */}
        <div className="space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" /> Academic Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Enrollment Number <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input name="enrollmentNo" value={formData.enrollmentNo} onChange={handleChange} className="pl-9 font-mono" placeholder="STU-2026-001" />
                </div>
                {errors['enrollmentNo'] && <p className="text-xs text-destructive">{errors['enrollmentNo']}</p>}
              </div>

              <div className="space-y-2">
                <Label>Class</Label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Select value={formData.classId} onValueChange={(v) => handleSelectChange('classId', v)}>
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="Assign class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Section</Label>
                <Select value={formData.sectionId} onValueChange={(v) => handleSelectChange('sectionId', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" /> Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="h-32 w-32 rounded-2xl bg-secondary flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/25 group-hover:border-primary/50 transition-colors">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-muted-foreground/50" />
                  )}
                </div>
                <Label htmlFor="avatar-upload" className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                  <Upload className="h-6 w-6" />
                </Label>
                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </div>
              <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest font-bold">Recommended: 400x400 JPG/PNG</p>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button type="submit" className="h-12 shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? 'Processing...' : studentId ? 'Update Record' : 'Enroll Student'}
            </Button>
            <Button type="button" variant="ghost" className="h-12" onClick={() => router.push('/dashboard/students')}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default StudentForm;
