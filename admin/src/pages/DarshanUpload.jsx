import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Layout from '../components/Layout';
import {
    Button,
    CircularProgress,
    IconButton
} from '@mui/material';
import {
    ArrowBack,
    CloudUpload,
    Image as ImageIcon,
    CheckCircle,
    Close
} from '@mui/icons-material';

const DarshanUpload = () => {
    const { templeId } = useParams();
    const navigate = useNavigate();
    const [temple, setTemple] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        const fetchTemple = async () => {
            try {
                const { data } = await api.get(`/temples/${templeId}`);
                setTemple(data);
            } catch (error) {
                console.error(error);
                navigate('/dashboard');
            }
        };
        fetchTemple();
    }, [templeId, navigate]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        addFiles(selectedFiles);
    };

    const addFiles = (selectedFiles) => {
        setFiles(prev => [...prev, ...selectedFiles]);

        const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            const newPrev = prev.filter((_, i) => i !== index);
            // Revoke url to prevent memory leak logic could go here
            return newPrev;
        });
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            addFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (files.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('templeId', templeId);
        formData.append('date', date);
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }

        try {
            await api.post('/admin/darshan', formData);
            // Show success logic or toast could be added here
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            const status = error.response?.status;
            const data = error.response?.data;
            const msg = data?.message || error.message || 'Upload failed';
            alert(`Error (${status}): ${msg}\n${JSON.stringify(data)}`);
        } finally {
            setUploading(false);
        }
    };

    if (!temple) return <Layout><div className="flex justify-center p-10"><CircularProgress sx={{ color: '#f97316' }} /></div></Layout>;

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mb-6 flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors font-medium"
                >
                    <ArrowBack fontSize="small" /> Back to Dashboard
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-4">
                            <img src={temple.image} alt="" className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Upload Darshan</h1>
                                <p className="text-gray-500">For <span className="font-semibold text-gray-700">{temple.name}</span></p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleUpload} className="p-8">
                        {/* Date Selection */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Darshan Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full md:w-1/3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all"
                                required
                            />
                        </div>

                        {/* Drag and Drop Area */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Photos</label>
                            <div
                                className={`
                                    relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 cursor-pointer
                                    ${dragActive ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'}
                                    ${files.length > 0 ? 'bg-white' : ''}
                                `}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('file-upload').click()}
                            >
                                <input
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 text-orange-500">
                                        <CloudUpload fontSize="large" />
                                    </div>
                                    <p className="text-lg font-medium text-gray-700">Click to upload or drag and drop</p>
                                    <p className="text-gray-400 text-sm mt-1">SVG, PNG, JPG or GIF (max. 10MB)</p>
                                </div>
                            </div>
                        </div>

                        {/* Previews */}
                        {previews.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <CheckCircle fontSize="small" className="text-green-500" />
                                    Selected Files ({previews.length})
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {previews.map((preview, index) => (
                                        <div key={index} className="relative group rounded-lg overflow-hidden h-24 shadow-sm border border-gray-100">
                                            <img src={preview} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                                className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
                                            >
                                                <Close fontSize="small" style={{ fontSize: '1rem' }} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={uploading || files.length === 0}
                                startIcon={uploading && <CircularProgress size={20} color="inherit" />}
                                sx={{
                                    backgroundColor: '#f97316',
                                    ':hover': { backgroundColor: '#ea580c' },
                                    borderRadius: '0.75rem',
                                    padding: '0.75rem 2rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    fontSize: '1rem'
                                }}
                            >
                                {uploading ? 'Uploading...' : 'Upload Darshan'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Previously Uploaded Section */}
                <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Previously Uploaded for {date}</h2>
                    <DarshanGallery templeId={templeId} date={date} />
                </div>
            </div>
        </Layout>
    );
};

const DarshanGallery = ({ templeId, date }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                // Determine 'today' or 'yesterday' logic or send exact date to API?
                // The public API uses 'type=today/yesterday'. 
                // We'll need a new admin endpoint or reuse public?
                // For now let's reuse public but we have to map date to 'today'/'yesterday' logic or just fetch all?
                // Let's create a simple useEffect content:

                // Hack: Using public API which expects 'today' or 'yesterday'. 
                // Ideally, we need 'GET /admin/darshan?templeId=...&date=...'
                // If the selected date is today, request 'today'.

                const today = new Date().toISOString().split('T')[0];
                let type = 'today';
                if (date !== today) type = 'yesterday'; // Simple fallback

                const { data } = await api.get(`/darshan/${templeId}?type=${type}`);
                setImages(data.images || []);
            } catch (err) {
                console.log(err);
                setImages([]);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, [templeId, date]);

    const handleDelete = async (imageUrl) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;
        try {
            const { data } = await api.delete('/admin/darshan/image', {
                data: { templeId, date, imageUrl }
            });
            // Update UI
            setImages(data.images);
        } catch (err) {
            console.error("Delete failed", err);
            alert("Delete failed: " + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <CircularProgress size={24} />;
    if (images.length === 0) return <p className="text-gray-500">No images found/remaining for this date.</p>;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200 relative group">
                    <img
                        src={img.startsWith('http') ? img : `http://localhost:5000${img}`}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button
                            onClick={() => handleDelete(img)}
                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                            title="Delete Image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DarshanUpload;
