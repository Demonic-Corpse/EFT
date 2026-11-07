import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Video,
  Upload,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Edit2,
  ShieldCheck,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { GalleryMediaItem } from '../types';

export const AlbumPage: React.FC = () => {
  const { authFetch } = useAuth();
  const { success, error } = useToast();

  const [mediaItems, setMediaItems] = useState<GalleryMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Add / Edit Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryMediaItem | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Training',
    media_type: 'image',
    src: '',
    thumbnail: '',
    caption: '',
    date: 'October 2026',
    drill_type: '',
    video_duration: '',
    video_source: '',
    is_published: 1,
    parental_consent_verified: 1
  });

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/gallery');
      if (!res.ok) throw new Error('Failed to load gallery items.');
      const data = await res.json();
      setMediaItems(data);
    } catch (err: any) {
      error(err.message || 'Error loading gallery items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('media', file);

    setUploadingFile(true);
    try {
      const res = await authFetch('/api/gallery/upload', {
        method: 'POST',
        body: uploadData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload file.');

      const isVideo = data.mediaType === 'video';
      setFormData((prev) => ({
        ...prev,
        media_type: isVideo ? 'video' : 'image',
        category: isVideo ? 'Videos' : (prev.category === 'Videos' ? 'Training' : prev.category),
        src: isVideo ? (prev.thumbnail || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80') : data.url,
        video_source: isVideo ? data.url : prev.video_source,
        thumbnail: isVideo ? (prev.thumbnail || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80') : data.url,
      }));
      success(`Uploaded ${file.name} successfully!`);
    } catch (err: any) {
      error(err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isVideo = formData.media_type === 'video';

    if (!formData.title) {
      error('Title is required.');
      return;
    }

    if (isVideo && !formData.video_source && !formData.src) {
      error('Please provide a Video URL or upload a video file.');
      return;
    }

    if (!isVideo && !formData.src) {
      error('Please provide an image URL or upload a photo.');
      return;
    }

    const payload = {
      ...formData,
      media_type: isVideo ? 'video' : 'image',
      video_source: isVideo ? (formData.video_source || formData.src) : '',
      src: isVideo ? (formData.thumbnail || formData.src || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80') : formData.src,
      thumbnail: isVideo ? (formData.thumbnail || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80') : (formData.thumbnail || formData.src),
    };

    try {
      if (editingItem) {
        const res = await authFetch(`/api/gallery/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to update media item.');
        success('Media item updated.');
        setEditingItem(null);
      } else {
        const res = await authFetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to create media item.');
        success(isVideo ? 'Video published to academy album!' : 'Photo published to academy album!');
        setShowAddModal(false);
      }
      resetForm();
      fetchGallery();
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleTogglePublish = async (item: GalleryMediaItem) => {
    const newStatus = item.is_published ? 0 : 1;
    if (newStatus === 1 && !item.parental_consent_verified) {
      error('Cannot publish this media: minor parental consent has not been confirmed yet.');
      return;
    }

    try {
      const res = await authFetch(`/api/gallery/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status.');
      success(newStatus ? 'Media published on website.' : 'Media moved to drafts.');
      fetchGallery();
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this media item?')) return;
    try {
      const res = await authFetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete media item.');
      success('Media removed from album.');
      fetchGallery();
    } catch (err: any) {
      error(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Training',
      media_type: 'image',
      src: '',
      thumbnail: '',
      caption: '',
      date: 'October 2026',
      drill_type: '',
      video_duration: '',
      video_source: '',
      is_published: 1,
      parental_consent_verified: 1
    });
  };

  const openEdit = (item: GalleryMediaItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      media_type: item.media_type,
      src: item.src,
      thumbnail: item.thumbnail || '',
      caption: item.caption || '',
      date: item.date || '',
      drill_type: item.drill_type || '',
      video_duration: item.video_duration || '',
      video_source: item.video_source || '',
      is_published: item.is_published,
      parental_consent_verified: item.parental_consent_verified
    });
  };

  const filteredItems = mediaItems.filter((item) => {
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.caption?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-heading font-bold text-amber-500 tracking-wider">
            Public Website Media
          </span>
          <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-white">
            ALBUM &amp; MEDIA MANAGEMENT
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/album"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-heading uppercase font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
            <span>View Public Album</span>
          </a>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-black text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      {/* Categories & Search */}
      <div className="p-4 rounded-2xl bg-[#0f1523] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'Training', 'Matches', 'Events', 'Team Photos', 'Videos'] as const).map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading uppercase font-bold tracking-wider transition-colors ${
                  categoryFilter === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Media' : cat}
              </button>
            )
          )}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search photos &amp; drills..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs font-heading uppercase tracking-widest">Loading Media Gallery...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0f1523] border border-slate-800 text-slate-500 text-xs">
          No media items found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-[#0f1523] border border-slate-800 rounded-3xl overflow-hidden shadow-lg flex flex-col hover:border-slate-700 transition-all duration-300"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-video bg-black/60 overflow-hidden">
                <img
                  src={item.thumbnail || item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Media Type Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-heading uppercase font-bold text-white border border-white/10">
                  {item.media_type === 'video' ? (
                    <>
                      <Video className="w-3 h-3 text-amber-500" />
                      <span>Video</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-3 h-3 text-blue-400" />
                      <span>Photo</span>
                    </>
                  )}
                </div>

                {/* Published / Draft Status */}
                <div className="absolute top-2.5 right-2.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-heading uppercase font-bold backdrop-blur-md ${
                      item.is_published
                        ? 'bg-emerald-500/80 text-white'
                        : 'bg-slate-900/80 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {item.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-amber-500 font-heading uppercase font-bold mb-1">
                    <span>{item.category}</span>
                    <span className="text-slate-500 font-sans font-normal">{item.date}</span>
                  </div>
                  <h4 className="font-heading font-bold uppercase text-white text-xs leading-snug line-clamp-2">
                    {item.title}
                  </h4>
                  {item.caption && (
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans">
                      {item.caption}
                    </p>
                  )}
                </div>

                {/* Consent & Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div
                    className="flex items-center gap-1 text-[10px] text-slate-400"
                    title={
                      item.parental_consent_verified
                        ? 'Minor parental consent verified'
                        : 'Minor consent required before publishing'
                    }
                  >
                    <ShieldCheck
                      className={`w-3.5 h-3.5 ${
                        item.parental_consent_verified ? 'text-emerald-400' : 'text-slate-600'
                      }`}
                    />
                    <span className="text-[10px]">
                      {item.parental_consent_verified ? 'Consent OK' : 'No Consent'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Toggle publish button */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(item)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title={item.is_published ? 'Unpublish to draft' : 'Publish to live website'}
                    >
                      {item.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Edit metadata"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD / EDIT MODAL */}
      {(showAddModal || editingItem) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f1523] border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-heading uppercase tracking-widest text-amber-500 font-bold">
                  {editingItem ? 'Edit Media Metadata' : 'Upload Gallery Item'}
                </span>
                <h3 className="text-xl font-display uppercase tracking-tight text-white">
                  {editingItem ? 'UPDATE MEDIA' : 'ADD NEW PHOTO OR VIDEO'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Media Type Switcher */}
              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Media Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        media_type: 'image',
                        category: formData.category === 'Videos' ? 'Training' : formData.category,
                      })
                    }
                    className={`py-2 px-3 rounded-xl border text-xs font-heading uppercase font-bold flex items-center justify-center gap-2 transition-colors ${
                      formData.media_type === 'image'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        media_type: 'video',
                        category: 'Videos',
                      })
                    }
                    className={`py-2 px-3 rounded-xl border text-xs font-heading uppercase font-bold flex items-center justify-center gap-2 transition-colors ${
                      formData.media_type === 'video'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Video</span>
                  </button>
                </div>
              </div>

              {/* File upload or URL selector */}
              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  {formData.media_type === 'video' ? 'Upload Video File (MP4, WebM)' : 'Upload Photo (JPEG, PNG, WEBP)'}
                </label>
                <div className="p-4 rounded-2xl bg-slate-900 border border-dashed border-slate-700 text-center space-y-2">
                  <Upload className="w-6 h-6 text-amber-500 mx-auto" />
                  <p className="text-xs text-slate-300">
                    {uploadingFile
                      ? 'Uploading file to academy storage...'
                      : formData.media_type === 'video'
                      ? 'Select video from computer (MP4, WebM)'
                      : 'Select photo from computer (JPEG, PNG, WEBP)'}
                  </p>
                  <input
                    type="file"
                    accept={formData.media_type === 'video' ? 'video/*' : 'image/*'}
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                    className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-heading file:uppercase file:bg-amber-500 file:text-slate-950 file:font-bold hover:file:bg-amber-400 cursor-pointer"
                  />
                </div>

                <div className="mt-2">
                  <span className="text-[11px] text-slate-500 block mb-1">
                    {formData.media_type === 'video'
                      ? 'Or enter Video URL (YouTube, Vimeo, MP4 link):'
                      : 'Or enter Photo URL:'}
                  </span>
                  <input
                    type="url"
                    value={formData.media_type === 'video' ? (formData.video_source || formData.src) : formData.src}
                    onChange={(e) => {
                      if (formData.media_type === 'video') {
                        setFormData({
                          ...formData,
                          video_source: e.target.value,
                          src: formData.src || e.target.value,
                        });
                      } else {
                        setFormData({
                          ...formData,
                          src: e.target.value,
                          thumbnail: e.target.value,
                        });
                      }
                    }}
                    placeholder={
                      formData.media_type === 'video'
                        ? 'https://www.youtube.com/watch?v=... or /uploads/video.mp4'
                        : 'https://images.unsplash.com/... or /uploads/photo.jpg'
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {formData.media_type === 'video' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                      Video Duration (MM:SS)
                    </label>
                    <input
                      type="text"
                      value={formData.video_duration}
                      onChange={(e) => setFormData({ ...formData, video_duration: e.target.value })}
                      placeholder="e.g. 01:45"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                      Custom Thumbnail / Poster URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value, src: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. U-14 Rondo Conditioning"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Training">Training</option>
                    <option value="Matches">Matches</option>
                    <option value="Events">Events</option>
                    <option value="Team Photos">Team Photos</option>
                    <option value="Videos">Videos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading uppercase font-semibold text-slate-300 tracking-wider mb-1.5">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Short description displayed on public website..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Minor Student Privacy Consent Checkbox */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.parental_consent_verified === 1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        parental_consent_verified: e.target.checked ? 1 : 0
                      })
                    }
                    className="mt-0.5 rounded text-amber-500 focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-heading uppercase font-bold text-white block">
                      Parental / Guardian Consent Confirmed
                    </span>
                    <span className="text-[11px] text-slate-400 block leading-relaxed">
                      Necessary parent/guardian media release consent has been verified for all identifiable minor players in this photo/video.
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-heading uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-heading font-black uppercase tracking-wider"
                >
                  {editingItem ? 'Save Updates' : 'Publish to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
