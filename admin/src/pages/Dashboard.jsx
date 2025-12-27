import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Layout from '../components/Layout';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Menu,
    MenuItem,
    Chip
} from '@mui/material';
import {
    Add,
    MoreVert,
    LocationOn,
    Search,
    CloudUpload,
    AccessTime,
    DeleteOutline,
    TrendingUp,
    Image as ImageIcon
} from '@mui/icons-material';

const Dashboard = () => {
    const [temples, setTemples] = useState([]);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newTemple, setNewTemple] = useState({ name: '', image: '', location: '', description: '' });
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTempleId, setSelectedTempleId] = useState(null);
    const navigate = useNavigate();

    const fetchTemples = async () => {
        try {
            const { data } = await api.get('/temples');
            setTemples(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTemples();
    }, []);

    const handleCreate = async () => {
        try {
            await api.post('/admin/temples', newTemple);
            setOpen(false);
            setNewTemple({ name: '', image: '', location: '', description: '' });
            fetchTemples();
        } catch (error) {
            alert('Error creating temple');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this temple?')) {
            handleMenuClose();
            return;
        }
        try {
            await api.delete(`/admin/temples/${selectedTempleId}`);
            fetchTemples();
            handleMenuClose();
        } catch (error) {
            alert('Error deleting temple');
        }
    };

    const handleMenuOpen = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedTempleId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedTempleId(null);
    };

    const filteredTemples = temples.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-400">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                {icon}
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Dashboard Overview</h1>
                        <p className="text-gray-500 mt-1">Manage your spiritual content effectively</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Temples"
                        value={temples.length}
                        icon={<TrendingUp className="text-orange-600" />}
                        color="bg-orange-50"
                    />
                    <StatCard
                        title="Active Darshans"
                        value={temples.length * 2} // Mock metric, assuming mostly active
                        icon={<AccessTime className="text-blue-600" />}
                        color="bg-blue-50"
                    />
                    <StatCard
                        title="Total Images"
                        value="120+" // Mock
                        icon={<ImageIcon className="text-purple-600" />}
                        color="bg-purple-50"
                    />
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-3.5 text-gray-400" fontSize="small" />
                            <input
                                type="text"
                                placeholder="Search by name or location..."
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-100 focus:bg-white transition-all text-sm font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setOpen(true)}
                            sx={{
                                backgroundColor: '#f97316',
                                ':hover': { backgroundColor: '#ea580c' },
                                borderRadius: '0.75rem',
                                padding: '0.75rem 1.5rem',
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: '0 10px 15px -3px rgb(249 115 22 / 0.2)'
                            }}
                        >
                            Add Temple
                        </Button>
                    </div>

                    {/* Grid */}
                    <div className="p-6 md:p-8">
                        {filteredTemples.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredTemples.map((temple) => (
                                    <div key={temple._id} className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                                        <div className="relative h-48 overflow-hidden bg-gray-100">
                                            <img
                                                src={temple.image}
                                                alt={temple.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                            <div className="absolute top-3 right-3">
                                                <button
                                                    onClick={(e) => handleMenuOpen(e, temple._id)}
                                                    className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-gray-800 transition-all"
                                                >
                                                    <MoreVert fontSize="small" />
                                                </button>
                                            </div>
                                            <div className="absolute bottom-3 left-3 text-white">
                                                <div className="flex items-center gap-1.5 text-xs font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">
                                                    <LocationOn fontSize="inherit" className="text-orange-400" />
                                                    <span className="truncate max-w-[150px]">{temple.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">{temple.name}</h3>
                                            <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{temple.description || 'No description available for this temple.'}</p>

                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                startIcon={<CloudUpload />}
                                                onClick={() => navigate(`/darshan/${temple._id}`)}
                                                sx={{
                                                    borderColor: '#fed7aa',
                                                    color: '#f97316',
                                                    ':hover': {
                                                        borderColor: '#f97316',
                                                        backgroundColor: '#fff7ed',
                                                        transform: 'translateY(-1px)'
                                                    },
                                                    textTransform: 'none',
                                                    borderRadius: '0.75rem',
                                                    py: 1,
                                                    transition: 'all 0.2s',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                Upload Darshan
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <Search className="text-gray-300 text-4xl" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">No temples found</h3>
                                <p className="text-gray-400 mt-2 max-w-sm">
                                    We couldn't find any temples matching "{searchTerm}". Try checking for typos or add a new temple.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dialog and Menu components remain similar but styled */}
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    PaperProps={{
                        style: { borderRadius: '1.5rem', padding: '1rem', maxWidth: '500px', width: '100%' }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 800, color: '#1f2937' }}>New Temple</DialogTitle>
                    <DialogContent>
                        <div className="flex flex-col gap-5 mt-2">
                            <TextField
                                label="Temple Name"
                                fullWidth
                                variant="outlined"
                                value={newTemple.name}
                                onChange={(e) => setNewTemple({ ...newTemple, name: e.target.value })}
                                InputProps={{ style: { borderRadius: '0.75rem' } }}
                            />
                            <TextField
                                label="Image URL"
                                fullWidth
                                variant="outlined"
                                value={newTemple.image}
                                onChange={(e) => setNewTemple({ ...newTemple, image: e.target.value })}
                                InputProps={{ style: { borderRadius: '0.75rem' } }}
                            />
                            <TextField
                                label="Location"
                                fullWidth
                                variant="outlined"
                                value={newTemple.location}
                                onChange={(e) => setNewTemple({ ...newTemple, location: e.target.value })}
                                InputProps={{ style: { borderRadius: '0.75rem' } }}
                            />
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                                value={newTemple.description}
                                onChange={(e) => setNewTemple({ ...newTemple, description: e.target.value })}
                                InputProps={{ style: { borderRadius: '0.75rem' } }}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions sx={{ padding: '0 1.5rem 1.5rem' }}>
                        <Button
                            onClick={() => setOpen(false)}
                            sx={{ color: '#6b7280', borderRadius: '0.75rem', px: 3 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            variant="contained"
                            disabled={!newTemple.name || !newTemple.image}
                            sx={{
                                backgroundColor: '#f97316',
                                ':hover': { backgroundColor: '#ea580c' },
                                borderRadius: '0.75rem',
                                px: 4,
                                py: 1,
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            Create Temple
                        </Button>
                    </DialogActions>
                </Dialog>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        elevation: 3,
                        style: { borderRadius: '1rem', marginTop: '0.5rem', minWidth: '180px' }
                    }}
                >
                    <MenuItem onClick={() => { navigate(`/darshan/${selectedTempleId}`); handleMenuClose(); }} sx={{ gap: 1.5, py: 1.5 }}>
                        <CloudUpload fontSize="small" className="text-gray-500" />
                        <span className="text-sm font-medium">Upload Darshan</span>
                    </MenuItem>
                    <MenuItem onClick={handleDelete} sx={{ gap: 1.5, py: 1.5 }}>
                        <DeleteOutline fontSize="small" className="text-red-500" />
                        <span className="text-sm font-medium text-red-600">Delete</span>
                    </MenuItem>
                </Menu>
            </div>
        </Layout>
    );
};

export default Dashboard;
