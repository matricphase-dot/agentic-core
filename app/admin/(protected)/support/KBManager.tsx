"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Edit, Trash, Check, X, FileText, HelpCircle, Save, RefreshCcw } from "lucide-react";
import styles from "./Support.module.css";
import { useToast } from "@/components/admin/FeedbackUI";

export default function KBManager() {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'faqs' | 'articles'>('faqs');
    const [faqs, setFaqs] = useState<any[]>([]);
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);

    useEffect(() => {
        fetchItems();
    }, [activeTab]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/support/${activeTab}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            if (activeTab === 'faqs') setFaqs(data);
            else setArticles(data);
        } catch (error) {
            console.error("Failed to fetch", error);
            showToast("Error", `Could not load ${activeTab}.`, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This action cannot be undone.")) return;
        try {
            const res = await fetch(`/api/admin/support/${activeTab}?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Delete failed");
            showToast("Item Deleted", "The item has been removed from the knowledge base.", "success");
            fetchItems();
        } catch (error) {
            showToast("Error", "Failed to delete item.", "error");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingItem.id ? 'PUT' : 'POST';

        try {
            const res = await fetch(`/api/admin/support/${activeTab}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingItem),
            });
            if (!res.ok) throw new Error("Save failed");

            showToast("Saved Successfully", `The ${activeTab.slice(0, -1)} has been updated.`, "success");
            setEditingItem(null);
            fetchItems();
        } catch (error) {
            showToast("Error", "Failed to save changes.", "error");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-4 border-b border-gray-100 pb-2 mb-6">
                <button
                    className={`pb-2 px-1 text-sm font-medium transition-all ${activeTab === 'faqs' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('faqs')}
                >
                    <HelpCircle size={16} className="inline mr-2" />
                    FAQs
                </button>
                <button
                    className={`pb-2 px-1 text-sm font-medium transition-all ${activeTab === 'articles' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('articles')}
                >
                    <FileText size={16} className="inline mr-2" />
                    Articles
                </button>
            </div>

            {loading && !editingItem ? (
                <div className="py-12 text-center">
                    <Loader2 className="animate-spin inline text-indigo-600" size={32} />
                    <p className="mt-2 text-sm text-gray-400">Loading {activeTab}...</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={() => setEditingItem(activeTab === 'faqs' ? { question: '', answerMarkdown: '', isPublished: true } : { title: '', slug: '', contentMarkdown: '', isPublished: true })}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors shadow-sm"
                        >
                            <Plus size={16} /> Add New {activeTab === 'faqs' ? 'FAQ' : 'Article'}
                        </button>
                    </div>

                    {editingItem && (
                        <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-lg mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg text-gray-900">{editingItem.id ? 'Edit' : 'New'} {activeTab === 'faqs' ? 'FAQ' : 'Article'}</h3>
                                <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSave} className="space-y-5">
                                {activeTab === 'faqs' ? (
                                    <>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Question</label>
                                            <input
                                                placeholder="Enter the question..."
                                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                                value={editingItem.question}
                                                onChange={e => setEditingItem({ ...editingItem, question: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Answer (Markdown)</label>
                                            <textarea
                                                placeholder="Type the answer using markdown formatting..."
                                                className="w-full p-3 border border-gray-200 rounded-lg h-40 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                                value={editingItem.answerMarkdown}
                                                onChange={e => setEditingItem({ ...editingItem, answerMarkdown: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Article Title</label>
                                                <input
                                                    placeholder="Title"
                                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                                    value={editingItem.title}
                                                    onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Slug</label>
                                                <input
                                                    placeholder="how-to-use"
                                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                                    value={editingItem.slug}
                                                    onChange={e => setEditingItem({ ...editingItem, slug: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Content (Markdown)</label>
                                            <textarea
                                                placeholder="Write article content..."
                                                className="w-full p-3 border border-gray-200 rounded-lg h-60 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                                value={editingItem.contentMarkdown}
                                                onChange={e => setEditingItem({ ...editingItem, contentMarkdown: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="flex items-center justify-between pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${editingItem.isPublished ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'}`}>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={editingItem.isPublished}
                                                onChange={e => setEditingItem({ ...editingItem, isPublished: e.target.checked })}
                                            />
                                            {editingItem.isPublished && <Check size={14} className="text-white" />}
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">Published to Live Knowledge Base</span>
                                    </label>
                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">Cancel</button>
                                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-md flex items-center gap-2">
                                            <Save size={16} />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        {(activeTab === 'faqs' ? faqs : articles).length === 0 ? (
                            <div className="py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                <p className="text-gray-400 font-medium">No {activeTab} matched your filters.</p>
                                <p className="text-xs text-gray-300 mt-1">Start by adding your first {activeTab.slice(0, -1)} above.</p>
                            </div>
                        ) : (
                            (activeTab === 'faqs' ? faqs : articles).map(item => (
                                <div key={item.id} className="p-5 border border-gray-100 rounded-xl bg-white flex justify-between items-start hover:border-indigo-200 hover:shadow-md transition-all group">
                                    <div className="flex-1 pr-8">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-bold text-gray-900">{activeTab === 'faqs' ? item.question : item.title}</h4>
                                            <span className={`text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${item.isPublished ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                {item.isPublished ? 'Live' : 'Draft'}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                                            {activeTab === 'faqs' ? item.answerMarkdown : item.contentMarkdown}
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEditingItem(item)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash size={16} /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
