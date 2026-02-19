import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useLeadStore } from '../store/leadStore';
import { GraduationCap, Loader2, Users } from 'lucide-react';

const COURSES = [
  'Web Development',
  'Data Science',
  'Machine Learning',
  'Mobile Development',
  'UI/UX Design',
  'Cloud Computing',
  'DevOps',
  'Cybersecurity',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year'];

export function LeadFormPage() {
  const navigate = useNavigate();
  const { createLead, isLoading } = useLeadStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    college: '',
    year: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.course) newErrors.course = 'Course is required';
    if (!formData.college.trim()) newErrors.college = 'College is required';
    if (!formData.year) newErrors.year = 'Year is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createLead({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        course: formData.course,
        college: formData.college.trim(),
        year: formData.year,
      });
      
      toast.success('Enrollment submitted successfully!', {
        description: 'We will contact you soon.',
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        course: '',
        college: '',
        year: '',
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit enrollment');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-4">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Enroll Now
          </h1>
          <p className="text-lg text-gray-600">
            Start your learning journey with us today
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Enrollment Form</CardTitle>
            <CardDescription>
              Fill in your details below and we'll get back to you within 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course *</Label>
                  <Select
                    value={formData.course}
                    onValueChange={(value) => handleChange('course', value)}
                  >
                    <SelectTrigger className={errors.course ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {COURSES.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.course && <p className="text-sm text-red-500">{errors.course}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college">College/University *</Label>
                  <Input
                    id="college"
                    placeholder="MIT, Stanford, etc."
                    value={formData.college}
                    onChange={(e) => handleChange('college', e.target.value)}
                    className={errors.college ? 'border-red-500' : ''}
                  />
                  {errors.college && <p className="text-sm text-red-500">{errors.college}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year of Study *</Label>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => handleChange('year', value)}
                  >
                    <SelectTrigger className={errors.year ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Enrollment'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-gray-500">
                Admin?{' '}
                <button
                  onClick={() => navigate('/admin/login')}
                  className="text-primary hover:underline font-medium"
                >
                  Login here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">5000+ Students</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <GraduationCap className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">50+ Courses</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Expert Mentors</p>
          </div>
        </div>
      </div>
    </div>
  );
}
