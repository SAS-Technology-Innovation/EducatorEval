import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X, Plus } from 'lucide-react';
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
const TagSelector = ({ label, availableTags, selectedTags, onTagsChange, placeholder = "Select tags...", maxTags, allowCustomTags = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customTagName, setCustomTagName] = useState('');
    // Filter available tags based on search and exclude already selected
    const filteredTags = availableTags.filter(tag => !selectedTags.some(selected => selected.id === tag.id) &&
        tag.label.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleTagSelect = (tag) => {
        if (maxTags && selectedTags.length >= maxTags)
            return;
        onTagsChange([...selectedTags, tag]);
        setSearchTerm('');
    };
    const handleTagRemove = (tagId) => {
        onTagsChange(selectedTags.filter(tag => tag.id !== tagId));
    };
    const handleCustomTagAdd = () => {
        if (!customTagName.trim())
            return;
        const customTag = {
            id: `custom-${Date.now()}`,
            label: customTagName.trim(),
            color: TAG_COLORS[selectedTags.length % TAG_COLORS.length]
        };
        handleTagSelect(customTag);
        setCustomTagName('');
        setShowCustomInput(false);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && showCustomInput) {
            e.preventDefault();
            handleCustomTagAdd();
        }
    };
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700", children: label }), _jsxs("div", { className: "flex flex-wrap gap-2 min-h-[2.5rem] p-3 border border-sas-gray-300 rounded-lg bg-white", children: [selectedTags.map((tag) => (_jsxs("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${tag.color}`, children: [tag.label, _jsx("button", { type: "button", onClick: () => handleTagRemove(tag.id), className: "ml-2 -mr-1 hover:text-current", children: _jsx(X, { className: "w-3 h-3" }) })] }, tag.id))), (!maxTags || selectedTags.length < maxTags) && (_jsxs("button", { type: "button", onClick: () => setIsOpen(!isOpen), className: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-dashed border-sas-gray-400 text-sas-gray-600 hover:border-sas-blue-400 hover:text-sas-blue-600 transition-colors", children: [_jsx(Plus, { className: "w-3 h-3 mr-1" }), "Add ", label.toLowerCase()] }))] }), isOpen && (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "absolute z-10 w-full mt-1 bg-white border border-sas-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden", children: [_jsx("div", { className: "p-3 border-b border-sas-gray-200", children: _jsx("input", { type: "text", placeholder: placeholder, value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent text-sm" }) }), _jsx("div", { className: "max-h-40 overflow-y-auto", children: filteredTags.length > 0 ? (_jsx("div", { className: "py-2", children: filteredTags.map((tag) => (_jsxs("button", { type: "button", onClick: () => handleTagSelect(tag), className: "w-full text-left px-3 py-2 hover:bg-sas-gray-50 flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-sas-gray-900", children: tag.label }), _jsx("span", { className: `inline-block w-3 h-3 rounded-full ${tag.color.split(' ')[0]}` })] }, tag.id))) })) : searchTerm && !showCustomInput ? (_jsxs("div", { className: "p-3 text-sm text-sas-gray-500 text-center", children: ["No tags found for \"", searchTerm, "\"", allowCustomTags && (_jsxs("button", { type: "button", onClick: () => {
                                                setShowCustomInput(true);
                                                setCustomTagName(searchTerm);
                                            }, className: "block w-full mt-2 px-3 py-2 text-sas-blue-600 hover:bg-sas-blue-50 rounded transition-colors", children: ["Create \"", searchTerm, "\" as new tag"] }))] })) : (_jsx("div", { className: "p-3 text-sm text-sas-gray-500 text-center", children: "No available tags" })) }), showCustomInput && allowCustomTags && (_jsx("div", { className: "p-3 border-t border-sas-gray-200", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("input", { type: "text", placeholder: "Enter new tag name", value: customTagName, onChange: (e) => setCustomTagName(e.target.value), onKeyDown: handleKeyDown, className: "flex-1 px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent text-sm", autoFocus: true }), _jsx("button", { type: "button", onClick: handleCustomTagAdd, disabled: !customTagName.trim(), className: "px-3 py-2 bg-sas-green-600 text-white rounded-md hover:bg-sas-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm", children: "Add" }), _jsx("button", { type: "button", onClick: () => {
                                                setShowCustomInput(false);
                                                setCustomTagName('');
                                            }, className: "px-3 py-2 text-sas-gray-600 hover:text-sas-gray-800 text-sm", children: "Cancel" })] }) })), allowCustomTags && !showCustomInput && (_jsx("div", { className: "border-t border-sas-gray-200", children: _jsxs("button", { type: "button", onClick: () => setShowCustomInput(true), className: "w-full px-3 py-2 text-left text-sm text-sas-blue-600 hover:bg-sas-blue-50 transition-colors", children: [_jsx(Plus, { className: "w-4 h-4 inline mr-2" }), "Create new tag"] }) }))] }), _jsx("div", { className: "fixed inset-0 z-0", onClick: () => {
                            setIsOpen(false);
                            setShowCustomInput(false);
                            setCustomTagName('');
                            setSearchTerm('');
                        } })] })), maxTags && (_jsxs("p", { className: "text-xs text-sas-gray-500", children: [selectedTags.length, " of ", maxTags, " ", label.toLowerCase(), " selected"] }))] }));
};
export default TagSelector;
