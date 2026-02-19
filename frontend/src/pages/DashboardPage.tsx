import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { useAuthStore } from '../store/authStore';
import { useLeadStore } from '../store/leadStore';
import { LeadStatus, type Lead, type LeadStatusType } from '../types';
import {
  LogOut,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
} from 'lucide-react';

const COURSES = [
  'All Courses',
  'Web Development',
  'Data Science',
  'Machine Learning',
  'Mobile Development',
  'UI/UX Design',
  'Cloud Computing',
  'DevOps',
  'Cybersecurity',
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: LeadStatus.NEW, label: 'New' },
  { value: LeadStatus.CONTACTED, label: 'Contacted' },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { admin, logout } = useAuthStore();
  const { leads, pagination, isLoading, fetchLeads, updateLeadStatus, query, setQuery } = useLeadStore();
  const [searchInput, setSearchInput] = useState(query.search || '');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery({ search: searchInput || undefined });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, setQuery]);

  // Fetch leads when query changes
  useEffect(() => {
    fetchLeads();
  }, [query, fetchLeads]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const handleStatusUpdate = useCallback(async (lead: Lead) => {
    if (lead.status === LeadStatus.CONTACTED) {
      toast.info('Lead is already contacted');
      return;
    }
    setSelectedLead(lead);
    setIsUpdateDialogOpen(true);
  }, []);

  const confirmStatusUpdate = useCallback(async () => {
    if (!selectedLead) return;
    
    try {
      await updateLeadStatus(selectedLead.id, LeadStatus.CONTACTED);
      toast.success(`Marked ${selectedLead.name} as contacted`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setIsUpdateDialogOpen(false);
      setSelectedLead(null);
    }
  }, [selectedLead, updateLeadStatus]);

  const handlePageChange = (page: number) => {
    if (page < 1 || (pagination && page > pagination.totalPages)) return;
    setQuery({ page });
  };

  const handleCourseFilter = (value: string) => {
    setQuery({ course: value === 'All Courses' ? undefined : value });
  };

  const handleStatusFilter = (value: string) => {
    setQuery({ status: value === 'all' ? undefined : (value as LeadStatusType) });
  };

  const getStatusBadge = (status: LeadStatusType) => {
    if (status === LeadStatus.NEW) {
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          New
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="gap-1 bg-green-600">
        <CheckCircle2 className="h-3 w-3" />
        Contacted
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">Lead Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                {admin?.email}
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Lead Management Dashboard</CardTitle>
            <CardDescription>
              View and manage student enrollment leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={query.course || 'All Courses'}
                onValueChange={handleCourseFilter}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={query.status || 'all'}
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Leads Table */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No leads found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>College</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{lead.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3 text-gray-400" />
                                {lead.email}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3 text-gray-400" />
                                {lead.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-gray-400" />
                              {lead.course}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-400" />
                              {lead.college}
                            </div>
                          </TableCell>
                          <TableCell>{lead.year}</TableCell>
                          <TableCell>{getStatusBadge(lead.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              {formatDate(lead.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {lead.status === LeadStatus.NEW ? (
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(lead)}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Mark Contacted
                              </Button>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-500">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                      {pagination.total} leads
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Update Status Dialog */}
      <AlertDialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Contacted?</AlertDialogTitle>
            <AlertDialogDescription>
              This will update the status of <strong>{selectedLead?.name}</strong> to "Contacted".
              This action will also update the Google Sheet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedLead(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusUpdate}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
