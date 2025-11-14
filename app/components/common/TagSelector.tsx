import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface Tag {
  id: string;
  label: string;
  color: string;
}

interface TagSelectorProps {
  label: string;
  availableTags: Tag[];
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowCustomTags?: boolean;
}

// Predefined color palette for tags
const TAG_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-green-100 text-green-800 border-green-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-pink-100 text-pink-800 border-pink-200',
  'bg-yellow-100 text-yellow-800 border-yellow-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-red-100 text-red-800 border-red-200',
  'bg-orange-100 text-orange-800 border-orange-200',
  'bg-teal-100 text-teal-800 border-teal-200',
  'bg-cyan-100 text-cyan-800 border-cyan-200',
];

const TagSelector: React.FC<TagSelectorProps> = ({
  label,
  availableTags,
  selectedTags,
  onTagsChange,
  placeholder = "Select tags...",
  maxTags,
  allowCustomTags = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTagName, setCustomTagName] = useState('');

  // Filter available tags based on search and exclude already selected
  const filteredTags = availableTags.filter(tag => 
    !selectedTags.some(selected => selected.id === tag.id) &&
    tag.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTagSelect = (tag: Tag) => {
    if (maxTags && selectedTags.length >= maxTags) return;
    onTagsChange([...selectedTags, tag]);
    setSearchTerm('');
  };

  const handleTagRemove = (tagId: string) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagId));
  };

  const handleCustomTagAdd = () => {
    if (!customTagName.trim()) return;
    
    const customTag: Tag = {
      id: `custom-${Date.now()}`,
      label: customTagName.trim(),
      color: TAG_COLORS[selectedTags.length % TAG_COLORS.length]
    };
    
    handleTagSelect(customTag);
    setCustomTagName('');
    setShowCustomInput(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && showCustomInput) {
      e.preventDefault();
      handleCustomTagAdd();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-sas-gray-700">
        {label}
      </label>
      
      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 border border-sas-gray-300 rounded-lg bg-white">
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${tag.color}`}
          >
            {tag.label}
            <button
              type="button"
              onClick={() => handleTagRemove(tag.id)}
              className="ml-2 -mr-1 hover:text-current"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        
        {/* Add Tag Button */}
        {(!maxTags || selectedTags.length < maxTags) && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-dashed border-sas-gray-400 text-sas-gray-600 hover:border-sas-blue-400 hover:text-sas-blue-600 transition-colors"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add {label.toLowerCase()}
          </button>
        )}
      </div>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="relative">
          <div className="absolute z-10 w-full mt-1 bg-white border border-sas-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-sas-gray-200">
              <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            {/* Available Tags */}
            <div className="max-h-40 overflow-y-auto">
              {filteredTags.length > 0 ? (
                <div className="py-2">
                  {filteredTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagSelect(tag)}
                      className="w-full text-left px-3 py-2 hover:bg-sas-gray-50 flex items-center justify-between"
                    >
                      <span className="text-sm text-sas-gray-900">{tag.label}</span>
                      <span className={`inline-block w-3 h-3 rounded-full ${tag.color.split(' ')[0]}`}></span>
                    </button>
                  ))}
                </div>
              ) : searchTerm && !showCustomInput ? (
                <div className="p-3 text-sm text-sas-gray-500 text-center">
                  No tags found for "{searchTerm}"
                  {allowCustomTags && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomInput(true);
                        setCustomTagName(searchTerm);
                      }}
                      className="block w-full mt-2 px-3 py-2 text-sas-blue-600 hover:bg-sas-blue-50 rounded transition-colors"
                    >
                      Create "{searchTerm}" as new tag
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-3 text-sm text-sas-gray-500 text-center">
                  No available tags
                </div>
              )}
            </div>
            
            {/* Custom Tag Input */}
            {showCustomInput && allowCustomTags && (
              <div className="p-3 border-t border-sas-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter new tag name"
                    value={customTagName}
                    onChange={(e) => setCustomTagName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent text-sm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleCustomTagAdd}
                    disabled={!customTagName.trim()}
                    className="px-3 py-2 bg-sas-green-600 text-white rounded-md hover:bg-sas-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomTagName('');
                    }}
                    className="px-3 py-2 text-sas-gray-600 hover:text-sas-gray-800 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {/* Add Custom Tag Option */}
            {allowCustomTags && !showCustomInput && (
              <div className="border-t border-sas-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full px-3 py-2 text-left text-sm text-sas-blue-600 hover:bg-sas-blue-50 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Create new tag
                </button>
              </div>
            )}
          </div>
          
          {/* Overlay to close dropdown */}
          <div
            className="fixed inset-0 z-0"
            onClick={() => {
              setIsOpen(false);
              setShowCustomInput(false);
              setCustomTagName('');
              setSearchTerm('');
            }}
          />
        </div>
      )}
      
      {/* Helper Text */}
      {maxTags && (
        <p className="text-xs text-sas-gray-500">
          {selectedTags.length} of {maxTags} {label.toLowerCase()} selected
        </p>
      )}
    </div>
  );
};

export default TagSelector;