import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate } from '../chunks/astro/server_BoYrjx9A.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_DOpggxVl.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
import { Copy, Eye, Save, Edit, Plus, ArrowUp, ArrowDown, Trash2, FileText, X } from 'lucide-react';
export { renderers } from '../renderers.mjs';

function FrameworkEditor() {
  const [selectedFramework, setSelectedFramework] = useState("crp-in-action");
  const [editMode, setEditMode] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showEditQuestion, setShowEditQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [selectedSection, setSelectedSection] = useState(0);
  const [showEditFramework, setShowEditFramework] = useState(false);
  const [editingFramework, setEditingFramework] = useState(null);
  const [frameworkTagInput, setFrameworkTagInput] = useState("");
  const [showEditSection, setShowEditSection] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [frameworks, setFrameworks] = useState({
    "crp-in-action": {
      id: "crp-in-action",
      name: "CRP in Action: Integrated Observation Tool",
      description: "Comprehensive evaluation framework integrating Culturally Responsive Practices",
      version: "1.0",
      status: "active",
      lastModified: "2025-08-15",
      tags: ["crp", "culturally-responsive", "assessment"],
      sections: [
        {
          id: "integrated-lookfors",
          title: "10 Look-Fors: Integrated Observation",
          description: "Evidence-based look-fors aligned to multiple frameworks",
          weight: 100,
          questions: [
            {
              id: "lookfor1",
              text: "The learning target is clearly communicated and relevant to students.",
              type: "rating",
              required: true,
              scale: 4,
              weight: 10,
              tags: ["learning-targets", "clarity"],
              helpText: "Look for visible learning targets and student understanding",
              frameworkAlignments: ["5-daily-assessment", "crp-curriculum", "tripod-clarify"]
            },
            {
              id: "lookfor2",
              text: "Teacher fosters an inclusive environment where all students feel belonging.",
              type: "rating",
              required: true,
              scale: 4,
              weight: 10,
              tags: ["belonging", "inclusive"],
              helpText: "Observe inclusive language and cultural affirmation",
              frameworkAlignments: ["crp-general", "casel-social-awareness", "panorama", "tripod-care"]
            },
            {
              id: "lookfor3",
              text: "Teacher checks for understanding and adjusts instruction.",
              type: "rating",
              required: true,
              scale: 4,
              weight: 10,
              tags: ["formative-assessment", "responsive-teaching"],
              helpText: "Look for checks for understanding and instructional adjustments",
              frameworkAlignments: ["5-daily-assessment", "tripod-clarify", "inclusive-practices"]
            }
          ]
        }
      ]
    }
  });
  const frameworkOptions = [
    { id: "crp-general", label: "CRP (General)", category: "Culturally Responsive Practices", color: "green" },
    { id: "crp-curriculum", label: "CRP (Curriculum Relevance)", category: "Culturally Responsive Practices", color: "green" },
    { id: "crp-high-expectations", label: "CRP (High Expectations)", category: "Culturally Responsive Practices", color: "green" },
    { id: "crp-learning-partnerships", label: "CRP (Learning Partnerships)", category: "Culturally Responsive Practices", color: "green" },
    { id: "casel-self-awareness", label: "CASEL (Self-Awareness)", category: "Social-Emotional Learning", color: "pink" },
    { id: "casel-social-awareness", label: "CASEL (Social Awareness)", category: "Social-Emotional Learning", color: "pink" },
    { id: "casel-relationship-skills", label: "CASEL (Relationship Skills)", category: "Social-Emotional Learning", color: "pink" },
    { id: "casel-self-management", label: "CASEL (Self-Management)", category: "Social-Emotional Learning", color: "pink" },
    { id: "casel-responsible-decision", label: "CASEL (Responsible Decision-Making)", category: "Social-Emotional Learning", color: "pink" },
    { id: "tripod-care", label: "Tripod: Care", category: "7Cs of Learning", color: "blue" },
    { id: "tripod-challenge", label: "Tripod: Challenge", category: "7Cs of Learning", color: "blue" },
    { id: "tripod-clarify", label: "Tripod: Clarify", category: "7Cs of Learning", color: "blue" },
    { id: "tripod-captivate", label: "Tripod: Captivate", category: "7Cs of Learning", color: "blue" },
    { id: "tripod-confer", label: "Tripod: Confer", category: "7Cs of Learning", color: "blue" },
    { id: "tripod-consolidate", label: "Tripod: Consolidate", category: "7Cs of Learning", color: "blue" },
    { id: "tripod-control", label: "Tripod: Control", category: "7Cs of Learning", color: "blue" },
    { id: "5-daily-assessment", label: "5 Daily Assessment Practices", category: "Assessment", color: "yellow" },
    { id: "panorama", label: "Panorama (Student Experience)", category: "Student Experience", color: "purple" },
    { id: "inclusive-practices", label: "Inclusive Practices", category: "Inclusion & Equity", color: "indigo" }
  ];
  const [newQuestion, setNewQuestion] = useState({
    id: "",
    text: "",
    type: "rating",
    required: true,
    scale: 4,
    weight: 10,
    tags: [],
    helpText: "",
    options: [],
    frameworkAlignments: []
  });
  const [tagInput, setTagInput] = useState("");
  const questionTypes = [
    { value: "rating", label: "Rating Scale", description: "1-4 rating scale for observation" },
    { value: "text", label: "Text Response", description: "Open-ended text input" },
    { value: "multiselect", label: "Multiple Choice", description: "Select multiple options" },
    { value: "single-select", label: "Single Choice", description: "Select one option" },
    { value: "yes-no", label: "Yes/No", description: "Binary choice question" }
  ];
  const currentFramework = frameworks[selectedFramework];
  const currentSection = currentFramework?.sections?.[selectedSection];
  const startEditQuestion = (question) => {
    setEditingQuestion({
      ...question,
      frameworkAlignments: question.frameworkAlignments || []
    });
    setTagInput("");
    setShowEditQuestion(true);
  };
  const saveEditQuestion = () => {
    if (!editingQuestion?.text.trim() || !currentSection) return;
    const updatedFramework = { ...currentFramework };
    const questionIndex = updatedFramework.sections[selectedSection].questions.findIndex((q) => q.id === editingQuestion.id);
    if (questionIndex !== -1) {
      updatedFramework.sections[selectedSection].questions[questionIndex] = {
        ...editingQuestion,
        tags: editingQuestion.tags.filter((tag) => tag.trim())
      };
      setFrameworks((prev) => ({
        ...prev,
        [selectedFramework]: updatedFramework
      }));
    }
    setEditingQuestion(null);
    setTagInput("");
    setShowEditQuestion(false);
  };
  const getFrameworkColorClasses = (color) => {
    const colorMap = {
      green: "bg-green-100 text-green-800 border-green-200",
      pink: "bg-pink-100 text-pink-800 border-pink-200",
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      indigo: "bg-indigo-100 text-indigo-800 border-indigo-200"
    };
    return colorMap[color] || "bg-gray-100 text-gray-800 border-gray-200";
  };
  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag) {
      if (showEditQuestion && editingQuestion) {
        if (!editingQuestion.tags.includes(trimmedTag)) {
          setEditingQuestion((prev) => prev ? {
            ...prev,
            tags: [...prev.tags, trimmedTag]
          } : null);
          setTagInput("");
        }
      } else if (showAddQuestion) {
        if (!newQuestion.tags.includes(trimmedTag)) {
          setNewQuestion((prev) => ({
            ...prev,
            tags: [...prev.tags, trimmedTag]
          }));
          setTagInput("");
        }
      }
    }
  };
  const removeTag = (tagToRemove) => {
    if (showEditQuestion && editingQuestion) {
      setEditingQuestion((prev) => prev ? {
        ...prev,
        tags: prev.tags.filter((tag) => tag !== tagToRemove)
      } : null);
    } else if (showAddQuestion) {
      setNewQuestion((prev) => ({
        ...prev,
        tags: prev.tags.filter((tag) => tag !== tagToRemove)
      }));
    }
  };
  const handleTagInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };
  const addQuestion = () => {
    if (!newQuestion.text.trim() || !currentSection) return;
    const questionId = `q${Date.now()}`;
    const updatedFramework = { ...currentFramework };
    updatedFramework.sections[selectedSection].questions.push({
      ...newQuestion,
      id: questionId,
      tags: newQuestion.tags.filter((tag) => tag.trim())
    });
    setFrameworks((prev) => ({
      ...prev,
      [selectedFramework]: updatedFramework
    }));
    setNewQuestion({
      id: "",
      text: "",
      type: "rating",
      required: true,
      scale: 4,
      weight: 10,
      tags: [],
      helpText: "",
      options: [],
      frameworkAlignments: []
    });
    setTagInput("");
    setShowAddQuestion(false);
  };
  const removeQuestion = (questionId) => {
    if (!currentSection) return;
    const updatedFramework = { ...currentFramework };
    updatedFramework.sections[selectedSection].questions = updatedFramework.sections[selectedSection].questions.filter((q) => q.id !== questionId);
    setFrameworks((prev) => ({
      ...prev,
      [selectedFramework]: updatedFramework
    }));
  };
  const moveQuestion = (questionId, direction) => {
    if (!currentSection) return;
    const updatedFramework = { ...currentFramework };
    const questions = updatedFramework.sections[selectedSection].questions;
    const index = questions.findIndex((q) => q.id === questionId);
    if (direction === "up" && index > 0) {
      [questions[index], questions[index - 1]] = [questions[index - 1], questions[index]];
    } else if (direction === "down" && index < questions.length - 1) {
      [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
    }
    setFrameworks((prev) => ({
      ...prev,
      [selectedFramework]: updatedFramework
    }));
  };
  const startEditFramework = () => {
    setEditingFramework({ ...currentFramework });
    setFrameworkTagInput("");
    setShowEditFramework(true);
  };
  const saveEditFramework = () => {
    if (!editingFramework) return;
    const updatedFramework = {
      ...editingFramework,
      lastModified: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      // Update last modified date
      tags: editingFramework.tags.filter((tag) => tag.trim())
    };
    setFrameworks((prev) => ({
      ...prev,
      [selectedFramework]: updatedFramework
    }));
    setEditingFramework(null);
    setFrameworkTagInput("");
    setShowEditFramework(false);
  };
  const addFrameworkTag = () => {
    const trimmedTag = frameworkTagInput.trim().toLowerCase();
    if (trimmedTag && editingFramework && !editingFramework.tags.includes(trimmedTag)) {
      setEditingFramework((prev) => prev ? {
        ...prev,
        tags: [...prev.tags, trimmedTag]
      } : null);
      setFrameworkTagInput("");
    }
  };
  const removeFrameworkTag = (tagToRemove) => {
    if (editingFramework) {
      setEditingFramework((prev) => prev ? {
        ...prev,
        tags: prev.tags.filter((tag) => tag !== tagToRemove)
      } : null);
    }
  };
  const handleFrameworkTagInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFrameworkTag();
    }
  };
  const startEditSection = () => {
    if (currentSection) {
      setEditingSection({ ...currentSection });
      setShowEditSection(true);
    }
  };
  const saveEditSection = () => {
    if (!editingSection || !currentFramework) return;
    const updatedFramework = { ...currentFramework };
    updatedFramework.sections[selectedSection] = {
      ...editingSection
    };
    setFrameworks((prev) => ({
      ...prev,
      [selectedFramework]: updatedFramework
    }));
    setEditingSection(null);
    setShowEditSection(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white shadow-sm border-b", children: /* @__PURE__ */ jsx("div", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "CRP in Action Framework" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Configure the Integrated Observation Tool for culturally responsive practices" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsxs("button", { className: "px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium", children: [
          /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4 inline mr-2" }),
          "Duplicate"
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium", children: [
          /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4 inline mr-2" }),
          "Preview"
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setEditMode(!editMode),
            className: `px-4 py-2 rounded-lg font-medium ${editMode ? "bg-green-500 text-white hover:bg-green-600" : "bg-blue-500 text-white hover:bg-blue-600"}`,
            children: editMode ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Save, { className: "w-4 h-4 inline mr-2" }),
              "Save Changes"
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4 inline mr-2" }),
              "Edit Framework"
            ] })
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "px-6 py-6", children: /* @__PURE__ */ jsxs("div", { className: "mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "CRP in Action Framework Structure" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Goal: 5,000 observations by May 2026 • 70% CRP evidence target" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 text-sm text-gray-700", children: [
        /* @__PURE__ */ jsxs("span", { className: "bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium", children: [
          "📋 ",
          currentFramework?.name || "Framework"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "contains" }),
        /* @__PURE__ */ jsxs("span", { className: "bg-green-100 text-green-800 px-2 py-1 rounded font-medium", children: [
          "📂 ",
          currentFramework?.sections?.length || 0,
          " Section"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "with" }),
        /* @__PURE__ */ jsxs("span", { className: "bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium", children: [
          "❓ ",
          currentFramework?.sections?.reduce((total, section) => total + section.questions.length, 0) || 0,
          " Look-Fors"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "•" }),
        /* @__PURE__ */ jsx("span", { className: "bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-medium", children: "👥 80 Observers" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex h-screen", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-80 bg-white border-r flex flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6 border-b", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Frameworks" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: selectedFramework,
              onChange: (e) => setSelectedFramework(e.target.value),
              className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              children: /* @__PURE__ */ jsx("option", { value: "crp-in-action", children: "CRP in Action: Integrated Observation Tool" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 border-b", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-gray-900 mb-1", children: currentFramework?.name || "Framework" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: currentFramework?.description || "" })
            ] }),
            editMode && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: startEditFramework,
                className: "ml-2 p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded",
                title: "Edit Framework Details",
                children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-500", children: "Status" }),
              /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${currentFramework?.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`, children: currentFramework?.status || "inactive" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-500", children: "Version" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-900", children: currentFramework?.version || "N/A" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-500", children: "Modified" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-900", children: currentFramework?.lastModified || "N/A" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-500", children: "Tags" }),
              editMode && /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: "Click edit to manage tags" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: currentFramework?.tags?.map((tag) => /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs", children: tag }, tag)) || [] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-gray-900", children: "Framework Sections" }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
              currentFramework?.sections?.length || 0,
              " sections"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: currentFramework?.sections?.map((section, index) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setSelectedSection(index),
              className: `w-full text-left p-3 rounded-lg border transition-all ${selectedSection === index ? "bg-blue-50 border-blue-200 text-blue-900" : "border-gray-200 hover:bg-gray-50"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ jsxs("span", { className: `text-xs px-2 py-1 rounded font-medium ${selectedSection === index ? "bg-blue-200 text-blue-800" : "bg-gray-100 text-gray-600"}`, children: [
                      "Section ",
                      index + 1
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium text-sm", children: section.title })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
                    section.questions.length,
                    "Q"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 mb-2", children: section.description }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
                    "Weight: ",
                    section.weight,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-green-600", children: [
                      section.questions.filter((q) => q.required).length,
                      " required"
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: "•" }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-blue-600", children: [
                      section.questions.filter((q) => !q.required).length,
                      " optional"
                    ] })
                  ] })
                ] })
              ]
            },
            section.id
          )) }),
          editMode && /* @__PURE__ */ jsxs("button", { className: "w-full mt-3 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors", children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 inline mr-2" }),
            "Add New Section"
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 flex flex-col", children: currentSection ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white border-b px-6 py-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900", children: currentSection.title }),
              editMode && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: startEditSection,
                  className: "p-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded",
                  title: "Edit Section Details",
                  children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500", children: [
                currentSection.questions.length,
                " look-fors"
              ] }),
              editMode && /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setShowAddQuestion(true),
                  className: "px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium",
                  children: [
                    /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 inline mr-1" }),
                    "Add Look-For"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: currentSection.description })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-6", children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: currentSection.questions.map((question, index) => /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-500", children: [
                "Look-For #",
                index + 1
              ] }),
              question.required && /* @__PURE__ */ jsx("span", { className: "bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium", children: "Required" }),
              /* @__PURE__ */ jsx("span", { className: "bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-medium", children: question.type }),
              /* @__PURE__ */ jsxs("span", { className: "bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium", children: [
                "Weight: ",
                question.weight
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-900 font-medium mb-2", children: question.text }),
            question.helpText && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-2", children: question.helpText }),
            question.tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mb-2", children: question.tags.map((tag) => /* @__PURE__ */ jsxs("span", { className: "bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded", children: [
              "#",
              tag
            ] }, tag)) }),
            question.frameworkAlignments.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-gray-500 block mb-1", children: "Framework Alignments:" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: question.frameworkAlignments.map((alignmentId) => {
                const framework = frameworkOptions.find((f) => f.id === alignmentId);
                return framework ? /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `text-xs px-2 py-1 rounded border ${getFrameworkColorClasses(framework.color)}`,
                    children: framework.label
                  },
                  alignmentId
                ) : null;
              }) })
            ] })
          ] }),
          editMode && /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1 ml-4", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => moveQuestion(question.id, "up"),
                disabled: index === 0,
                className: "p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50",
                children: /* @__PURE__ */ jsx(ArrowUp, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => moveQuestion(question.id, "down"),
                disabled: index === currentSection.questions.length - 1,
                className: "p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50",
                children: /* @__PURE__ */ jsx(ArrowDown, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => startEditQuestion(question),
                className: "p-1 text-blue-500 hover:text-blue-600",
                children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => removeQuestion(question.id),
                className: "p-1 text-red-500 hover:text-red-600",
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
              }
            )
          ] })
        ] }) }, question.id)) }) })
      ] }) : /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ jsx(FileText, { className: "w-12 h-12 mx-auto mb-4 opacity-50" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-2", children: "No Section Selected" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Select a framework section to view its questions" })
      ] }) }) })
    ] }),
    showAddQuestion && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "p-6 border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Add New Look-For" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowAddQuestion(false),
            className: "text-gray-400 hover:text-gray-600",
            children: /* @__PURE__ */ jsx(X, { className: "w-6 h-6" })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Question Text *" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: newQuestion.text,
              onChange: (e) => setNewQuestion((prev) => ({ ...prev, text: e.target.value })),
              rows: 3,
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              placeholder: "Enter the look-for question..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Question Type" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: newQuestion.type,
              onChange: (e) => setNewQuestion((prev) => ({ ...prev, type: e.target.value })),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              children: questionTypes.map((type) => /* @__PURE__ */ jsxs("option", { value: type.value, children: [
                type.label,
                " - ",
                type.description
              ] }, type.value))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Help Text" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: newQuestion.helpText,
              onChange: (e) => setNewQuestion((prev) => ({ ...prev, helpText: e.target.value })),
              rows: 2,
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              placeholder: "Additional guidance for observers..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tags" }),
          /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: tagInput,
                onChange: (e) => setTagInput(e.target.value),
                onKeyPress: handleTagInputKeyPress,
                className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                placeholder: "Add tag and press Enter"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: addTag,
                className: "px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600",
                children: "Add"
              }
            )
          ] }),
          newQuestion.tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: newQuestion.tags.map((tag) => /* @__PURE__ */ jsxs("span", { className: "bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded flex items-center", children: [
            "#",
            tag,
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => removeTag(tag),
                className: "ml-1 text-gray-500 hover:text-gray-700",
                children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
              }
            )
          ] }, tag)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("label", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: newQuestion.required,
                onChange: (e) => setNewQuestion((prev) => ({ ...prev, required: e.target.checked })),
                className: "mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: "Required" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Weight" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: "1",
                max: "100",
                value: newQuestion.weight,
                onChange: (e) => setNewQuestion((prev) => ({ ...prev, weight: parseInt(e.target.value) || 10 })),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowAddQuestion(false),
            className: "px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: addQuestion,
            className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium",
            children: "Add Look-For"
          }
        )
      ] })
    ] }) }),
    showEditQuestion && editingQuestion && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "p-6 border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Edit Look-For" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowEditQuestion(false),
            className: "text-gray-400 hover:text-gray-600",
            children: /* @__PURE__ */ jsx(X, { className: "w-6 h-6" })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Question Text *" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: editingQuestion.text,
              onChange: (e) => setEditingQuestion((prev) => prev ? { ...prev, text: e.target.value } : null),
              rows: 3,
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              placeholder: "Enter the look-for question..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Question Type" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: editingQuestion.type,
              onChange: (e) => setEditingQuestion((prev) => prev ? { ...prev, type: e.target.value } : null),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              children: questionTypes.map((type) => /* @__PURE__ */ jsxs("option", { value: type.value, children: [
                type.label,
                " - ",
                type.description
              ] }, type.value))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Help Text" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: editingQuestion.helpText,
              onChange: (e) => setEditingQuestion((prev) => prev ? { ...prev, helpText: e.target.value } : null),
              rows: 2,
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              placeholder: "Additional guidance for observers..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tags" }),
          /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: tagInput,
                onChange: (e) => setTagInput(e.target.value),
                onKeyPress: handleTagInputKeyPress,
                className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                placeholder: "Add tag and press Enter"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: addTag,
                className: "px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600",
                children: "Add"
              }
            )
          ] }),
          editingQuestion.tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: editingQuestion.tags.map((tag) => /* @__PURE__ */ jsxs("span", { className: "bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded flex items-center", children: [
            "#",
            tag,
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => removeTag(tag),
                className: "ml-1 text-gray-500 hover:text-gray-700",
                children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
              }
            )
          ] }, tag)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("label", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: editingQuestion.required,
                onChange: (e) => setEditingQuestion((prev) => prev ? { ...prev, required: e.target.checked } : null),
                className: "mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: "Required" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Weight" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: "1",
                max: "100",
                value: editingQuestion.weight,
                onChange: (e) => setEditingQuestion((prev) => prev ? { ...prev, weight: parseInt(e.target.value) || 10 } : null),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowEditQuestion(false),
            className: "px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: saveEditQuestion,
            className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium",
            children: "Save Changes"
          }
        )
      ] })
    ] }) }),
    showEditSection && editingSection && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[80vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "p-6 border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Edit Section Details" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowEditSection(false),
            className: "text-gray-400 hover:text-gray-600",
            children: /* @__PURE__ */ jsx(X, { className: "w-6 h-6" })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Section Title *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: editingSection.title,
              onChange: (e) => setEditingSection((prev) => prev ? { ...prev, title: e.target.value } : null),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              placeholder: "Enter section title..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description *" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: editingSection.description,
              onChange: (e) => setEditingSection((prev) => prev ? { ...prev, description: e.target.value } : null),
              rows: 3,
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              placeholder: "Enter section description..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Weight (%)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              min: "1",
              max: "100",
              value: editingSection.weight,
              onChange: (e) => setEditingSection((prev) => prev ? { ...prev, weight: parseInt(e.target.value) || 100 } : null),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Percentage weight of this section in the overall framework assessment." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bg-gray-50 p-3 rounded-lg", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Questions:" }),
          " ",
          editingSection.questions.length,
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Required:" }),
          " ",
          editingSection.questions.filter((q) => q.required).length,
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Optional:" }),
          " ",
          editingSection.questions.filter((q) => !q.required).length
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowEditSection(false),
            className: "px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: saveEditSection,
            disabled: !editingSection?.title.trim() || !editingSection?.description.trim(),
            className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed",
            children: "Save Section"
          }
        )
      ] })
    ] }) }),
    showEditFramework && editingFramework && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "p-6 border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Edit Framework Details" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowEditFramework(false),
            className: "text-gray-400 hover:text-gray-600",
            children: /* @__PURE__ */ jsx(X, { className: "w-6 h-6" })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Framework Name *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: editingFramework.name,
              onChange: (e) => setEditingFramework((prev) => prev ? { ...prev, name: e.target.value } : null),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              placeholder: "Enter framework name..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description *" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: editingFramework.description,
              onChange: (e) => setEditingFramework((prev) => prev ? { ...prev, description: e.target.value } : null),
              rows: 3,
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              placeholder: "Enter framework description..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Status" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: editingFramework.status,
                onChange: (e) => setEditingFramework((prev) => prev ? { ...prev, status: e.target.value } : null),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "active", children: "Active" }),
                  /* @__PURE__ */ jsx("option", { value: "inactive", children: "Inactive" }),
                  /* @__PURE__ */ jsx("option", { value: "draft", children: "Draft" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Version" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: editingFramework.version,
                onChange: (e) => setEditingFramework((prev) => prev ? { ...prev, version: e.target.value } : null),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                placeholder: "e.g., 1.0, 2.1"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tags" }),
          /* @__PURE__ */ jsxs("div", { className: "flex space-x-2 mb-3", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: frameworkTagInput,
                onChange: (e) => setFrameworkTagInput(e.target.value),
                onKeyPress: handleFrameworkTagInputKeyPress,
                className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                placeholder: "Add tag and press Enter"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: addFrameworkTag,
                className: "px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600",
                children: "Add"
              }
            )
          ] }),
          editingFramework.tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: editingFramework.tags.map((tag) => /* @__PURE__ */ jsxs("span", { className: "bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded flex items-center", children: [
            tag,
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => removeFrameworkTag(tag),
                className: "ml-1 text-blue-500 hover:text-blue-700",
                children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
              }
            )
          ] }, tag)) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Tags help categorize and organize frameworks for easier searching and filtering." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bg-gray-50 p-3 rounded-lg", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Last Modified:" }),
          " ",
          editingFramework.lastModified,
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "This will be updated automatically when you save changes." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowEditFramework(false),
            className: "px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: saveEditFramework,
            disabled: !editingFramework?.name.trim() || !editingFramework?.description.trim(),
            className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed",
            children: "Save Framework"
          }
        )
      ] })
    ] }) })
  ] });
}

const $$Astro = createAstro();
const $$Framework = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Framework;
  const pathname = Astro2.url.pathname;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "pathname": pathname }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "FrameworkEditor", FrameworkEditor, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "/home/user/EducatorEval/src/components/FrameworkEditor.tsx", "client:component-export": "default" })} ` })}`;
}, "/home/user/EducatorEval/src/pages/framework.astro", void 0);

const $$file = "/home/user/EducatorEval/src/pages/framework.astro";
const $$url = "/framework";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Framework,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
