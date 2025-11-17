'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { studentSchema, updateStudentSchema } from '@/lib/validation';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';

const StudentForm = ({ studentId, initialData }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enrollmentNo: '',
    dateOfAdmission: '',
    photo: null,
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        enrollmentNo: initialData.enrollmentNo || '',
        dateOfAdmission: initialData.dateOfAdmission
          ? new Date(initialData.dateOfAdmission).toISOString().split('T')[0]
          : '',
        photo: initialData.photo || null,
      });
      if (initialData.photo) {
        setPhotoPreview(
          initialData.photo.startsWith('http')
            ? initialData.photo
            : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${initialData.photo}`
        );
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo size must be less than 5MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async () => {
    if (!photoFile) return null;

    const formData = new FormData();
    formData.append('photo', photoFile);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.photo;
    } catch (error) {
      toast.error('Failed to upload photo');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Upload photo first if there's a new one
    let photoUrl = formData.photo;
    if (photoFile) {
      photoUrl = await uploadPhoto();
      if (!photoUrl) {
        setLoading(false);
        return;
      }
    }

    const submitData = {
      ...formData,
      photo: photoUrl,
    };

    // Validate with Zod
    const schema = studentId ? updateStudentSchema : studentSchema;
    const result = schema.safeParse(submitData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      if (studentId) {
        await api.put(`/students/${studentId}`, submitData);
        toast.success('Student updated successfully');
      } else {
        await api.post('/students', submitData);
        toast.success('Student created successfully');
      }
      router.push('/dashboard/students');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'An error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{studentId ? 'Edit Student' : 'Add New Student'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrollmentNo">Enrollment Number *</Label>
              <Input
                id="enrollmentNo"
                name="enrollmentNo"
                value={formData.enrollmentNo}
                onChange={handleChange}
                required
              />
              {errors.enrollmentNo && (
                <p className="text-sm text-destructive">{errors.enrollmentNo}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfAdmission">Date of Admission *</Label>
              <Input
                id="dateOfAdmission"
                type="date"
                name="dateOfAdmission"
                value={formData.dateOfAdmission}
                onChange={handleChange}
                required
              />
              {errors.dateOfAdmission && (
                <p className="text-sm text-destructive">{errors.dateOfAdmission}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Photo</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="cursor-pointer"
                />
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : studentId ? 'Update' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/students')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;
