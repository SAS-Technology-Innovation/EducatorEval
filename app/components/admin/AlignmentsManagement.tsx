import { useState } from 'react';
import {
  Link2,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  AlertCircle,
  Settings,
  RefreshCw,
  Filter
} from 'lucide-react';
import {
  useAlignments,
  useAlignmentCategories,
  useCreateAlignment,
  useUpdateAlignment,
  useDeleteAlignment,
  useSeedAlignments
} from '../../hooks/useAlignments';
import DataTable, { type Column } from '../common/DataTable';
import type { FrameworkAlignment, DivisionType } from '../../types';

// Available colors for alignments
const ALIGNMENT_COLORS = [
  { value: 'green', label: 'Green', bg: 'bg-green-100', text: 'text-green-700' },
  { value: 'blue', label: 'Blue', bg: 'bg-blue-100', text: 'text-blue-700' },
  { value: 'purple', label: 'Purple', bg: 'bg-purple-100', text: 'text-purple-700' },
  { value: 'pink', label: 'Pink', bg: 'bg-pink-100', text: 'text-pink-700' },
  { value: 'yellow', label: 'Yellow', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  { value: 'orange', label: 'Orange', bg: 'bg-orange-100', text: 'text-orange-700' },
  { value: 'red', label: 'Red', bg: 'bg-red-100', text: 'text-red-700' },
  { value: 'indigo', label: 'Indigo', bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { value: 'teal', label: 'Teal', bg: 'bg-teal-100', text: 'text-teal-700' },
  { value: 'gray', label: 'Gray', bg: 'bg-gray-100', text: 'text-gray-700' },
];

const DIVISION_OPTIONS: { value: DivisionType; label: string }[] = [
  { value: 'elementary', label: 'Elementary' },
  { value: 'middle', label: 'Middle School' },
  { value: 'high', label: 'High School' },
  { value: 'early_learning_center', label: 'Early Learning Center' },
];

const TYPE_OPTIONS = [
  { value: 'observation', label: 'Observation' },
  { value: 'evaluation', label: 'Evaluation' },
  { value: 'self_assessment', label: 'Self Assessment' },
];

export default function AlignmentsManagement() {
  const { data: alignments = [], isLoading, error, refetch } = useAlignments();
  const { data: categories = [] } = useAlignmentCategories();
  const createAlignment = useCreateAlignment();
  const updateAlignment = useUpdateAlignment();
  const deleteAlignment = useDeleteAlignment();
  const seedAlignments = useSeedAlignments();

  const [selectedAlignment, setSelectedAlignment] = useState<FrameworkAlignment | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState<Partial<FrameworkAlignment>>({
    name: '',
    category: '',
    description: '',
    color: 'blue',
    applicableTypes: ['observation'],
    applicableDivisions: ['elementary', 'middle', 'high'],
  });

  // Filter alignments by category
  const filteredAlignments = filterCategory
    ? alignments.filter(a => a.category === filterCategory)
    : alignments;

  // Get color config
  const getColorConfig = (color: string) => {
    return ALIGNMENT_COLORS.find(c => c.value === color) || ALIGNMENT_COLORS[0];
  };

  // Handle create
  const handleCreate = async () => {
    if (!formData.name || !formData.category || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createAlignment.mutateAsync(formData as Omit<FrameworkAlignment, 'id'>);
      setIsCreating(false);
      resetForm();
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to create alignment:', err);
      }
      alert('Failed to create alignment');
    }
  };

  // Handle update
  const handleUpdate = async () => {
    if (!selectedAlignment) return;

    try {
      await updateAlignment.mutateAsync({
        id: selectedAlignment.id,
        data: formData,
      });
      setIsEditing(false);
      setSelectedAlignment(null);
      resetForm();
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to update alignment:', err);
      }
      alert('Failed to update alignment');
    }
  };

  // Handle delete
  const handleDelete = async (alignment: FrameworkAlignment) => {
    if (!confirm(`Delete alignment "${alignment.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteAlignment.mutateAsync(alignment.id);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to delete alignment:', err);
      }
      alert('Failed to delete alignment');
    }
  };

  // Handle seed
  const handleSeed = async () => {
    if (alignments.length > 0) {
      if (!confirm('Alignments already exist. Seeding will only add defaults if the collection is empty. Continue?')) {
        return;
      }
    }

    try {
      const result = await seedAlignments.mutateAsync();
      if (result.seeded) {
        alert(`Successfully seeded ${result.count} default alignments`);
      } else {
        alert(`Alignments already exist (${result.count} found). No seeding needed.`);
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to seed alignments:', err);
      }
      alert('Failed to seed alignments');
    }
  };

  // Start editing
  const startEditing = (alignment: FrameworkAlignment) => {
    setSelectedAlignment(alignment);
    setFormData({
      name: alignment.name,
      category: alignment.category,
      subcategory: alignment.subcategory,
      description: alignment.description,
      color: alignment.color,
      icon: alignment.icon,
      weight: alignment.weight,
      applicableTypes: alignment.applicableTypes,
      applicableDivisions: alignment.applicableDivisions,
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  // Start creating
  const startCreating = () => {
    resetForm();
    setIsCreating(true);
    setIsEditing(false);
    setSelectedAlignment(null);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      color: 'blue',
      applicableTypes: ['observation'],
      applicableDivisions: ['elementary', 'middle', 'high'],
    });
  };

  // Cancel editing/creating
  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedAlignment(null);
    resetForm();
  };

  // Table columns
  const columns: Column<FrameworkAlignment>[] = [
    {
      id: 'name',
      header: 'Alignment',
      accessor: (alignment: FrameworkAlignment) => {
        const colorConfig = getColorConfig(alignment.color);
        return (
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${colorConfig.bg} border ${colorConfig.text.replace('text', 'border')}`} />
            <div>
              <div className="font-medium text-gray-900">{alignment.name}</div>
              <div className="text-sm text-gray-500 line-clamp-1">{alignment.description}</div>
            </div>
          </div>
        );
      },
      sortable: true,
    },
    {
      id: 'category',
      header: 'Category',
      accessor: (alignment: FrameworkAlignment) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
          {alignment.category}
        </span>
      ),
      sortable: true,
    },
    {
      id: 'applicableDivisions',
      header: 'Divisions',
      accessor: (alignment: FrameworkAlignment) => (
        <div className="flex flex-wrap gap-1">
          {alignment.applicableDivisions.map((div: DivisionType) => (
            <span key={div} className="px-1.5 py-0.5 text-xs bg-blue-50 text-blue-700 rounded">
              {div.split('_').map((w: string) => w.charAt(0).toUpperCase()).join('')}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'applicableTypes',
      header: 'Types',
      accessor: (alignment: FrameworkAlignment) => (
        <div className="flex flex-wrap gap-1">
          {alignment.applicableTypes.map((type: string) => (
            <span key={type} className="px-1.5 py-0.5 text-xs bg-purple-50 text-purple-700 rounded capitalize">
              {type}
            </span>
          ))}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-sas-navy-600 mr-3" />
        <p className="text-gray-600">Loading alignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Alignments</h3>
            <p className="text-red-700 mt-1">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sas-navy-100 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-sas-navy-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Framework Alignments</h1>
            <p className="text-gray-600">Manage alignment categories for observation frameworks</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {alignments.length === 0 && (
            <button
              onClick={handleSeed}
              disabled={seedAlignments.isPending}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {seedAlignments.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Settings className="w-4 h-4" />
              )}
              Seed Defaults
            </button>
          )}
          <button
            onClick={startCreating}
            className="px-4 py-2 bg-sas-navy-600 text-white rounded-lg hover:bg-sas-navy-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Alignment
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <span className="text-sm text-gray-500">
          {filteredAlignments.length} alignment{filteredAlignments.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || isEditing) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {isCreating ? 'Create New Alignment' : 'Edit Alignment'}
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., CRP (General)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Culturally Responsive Practices"
                list="category-suggestions"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              />
              <datalist id="category-suggestions">
                {categories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this alignment represents..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <div className="flex flex-wrap gap-2">
                {ALIGNMENT_COLORS.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`w-8 h-8 rounded-lg ${color.bg} border-2 transition-all ${
                      formData.color === color.value ? 'border-gray-800 scale-110' : 'border-transparent'
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory (optional)</label>
              <input
                type="text"
                value={formData.subcategory || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                placeholder="e.g., Student Engagement"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
              />
            </div>

            {/* Applicable Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Types</label>
              <div className="flex flex-wrap gap-2">
                {TYPE_OPTIONS.map(type => (
                  <label key={type.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.applicableTypes?.includes(type.value) || false}
                      onChange={(e) => {
                        const current = formData.applicableTypes || [];
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, applicableTypes: [...current, type.value] }));
                        } else {
                          setFormData(prev => ({ ...prev, applicableTypes: current.filter(t => t !== type.value) }));
                        }
                      }}
                      className="rounded border-gray-300 text-sas-navy-600 focus:ring-sas-navy-500"
                    />
                    <span className="text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Applicable Divisions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Divisions</label>
              <div className="flex flex-wrap gap-2">
                {DIVISION_OPTIONS.map(div => (
                  <label key={div.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.applicableDivisions?.includes(div.value) || false}
                      onChange={(e) => {
                        const current = formData.applicableDivisions || [];
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, applicableDivisions: [...current, div.value] }));
                        } else {
                          setFormData(prev => ({ ...prev, applicableDivisions: current.filter(d => d !== div.value) }));
                        }
                      }}
                      className="rounded border-gray-300 text-sas-navy-600 focus:ring-sas-navy-500"
                    />
                    <span className="text-sm text-gray-700">{div.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={isCreating ? handleCreate : handleUpdate}
              disabled={createAlignment.isPending || updateAlignment.isPending}
              className="px-4 py-2 bg-sas-navy-600 text-white rounded-lg hover:bg-sas-navy-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {(createAlignment.isPending || updateAlignment.isPending) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isCreating ? 'Create' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Alignments Table */}
      {alignments.length === 0 && !isCreating ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Link2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Alignments Yet</h3>
          <p className="text-gray-600 mb-6">
            Create alignment categories or seed the default CRP alignments to get started.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleSeed}
              disabled={seedAlignments.isPending}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {seedAlignments.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
              Seed Default Alignments
            </button>
            <button
              onClick={startCreating}
              className="px-4 py-2 bg-sas-navy-600 text-white rounded-lg hover:bg-sas-navy-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Custom
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <DataTable
            data={filteredAlignments}
            columns={columns}
            searchPlaceholder="Search alignments..."
            actions={(alignment: FrameworkAlignment) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEditing(alignment)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => handleDelete(alignment)}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            )}
          />
        </div>
      )}

      {/* Stats */}
      {alignments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{alignments.length}</div>
            <div className="text-sm text-gray-600">Total Alignments</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">
              {alignments.filter(a => a.applicableTypes.includes('observation')).length}
            </div>
            <div className="text-sm text-gray-600">Observation Alignments</div>
          </div>
        </div>
      )}
    </div>
  );
}
