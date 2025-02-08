import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { createStudyGroup } from '@/services/studyGroupService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function CreateGroup() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating group...', { currentUser, formData });
    
    if (!currentUser) {
      toast.error("You must be logged in to create a group");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    try {
      setLoading(true);
      const group = await createStudyGroup(
        formData.name.trim(),
        formData.description.trim(),
        currentUser.uid
      );
      console.log('Group created:', group);
      toast.success('Study group created successfully!');
      navigate(`/study-groups/${group.id}`);
    } catch (error) {
      console.error('Error creating study group:', error);
      toast.error('Failed to create study group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="container max-w-2xl py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
        <p>Please sign in to create a study group.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">Create Study Group</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Group Name</label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter group name"
            className="w-full"
            maxLength={50}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your study group..."
            className="w-full h-32"
            maxLength={500}
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !formData.name.trim()}
          className="w-full bg-blue-500 hover:bg-blue-700"
        >
          {loading ? 'Creating...' : 'Create Study Group'}
        </Button>
      </form>
    </div>
  );
}
