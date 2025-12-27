import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff, Lock, Person, TempleHindu } from '@mui/icons-material';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/admin/login', { username, password });
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Image & Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center md:scale-105 transition-transform duration-[20s] ease-in-out hover:scale-100"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1605634568603-9bb1983eb423?q=80&w=2070&auto=format&fit=crop')`
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-black/80 via-black/60 to-orange-900/60 backdrop-blur-[2px]"></div>

            <div className="relative z-10 w-full max-w-[420px] p-6 animate-fade-in">
                <div className="glass-panel p-8 md:p-10 rounded-3xl border-t border-white/20 border-l border-white/10 shadow-2xl backdrop-blur-xl">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/20 group hover:rotate-6 transition-transform duration-300">
                            <TempleHindu sx={{ fontSize: 40, color: 'white' }} className="group-hover:scale-110 transition-transform" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
                        <p className="text-orange-100/70 text-sm font-light tracking-wide">Enter your credentials to manage Darshan</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fade-in">
                            <span className="text-lg">⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-delay">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-orange-200/80 uppercase tracking-wider ml-1">Username</label>
                            <div className="relative group">
                                <Person className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-200/50 group-focus-within:text-orange-400 transition-colors" fontSize="small" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="glass-input !pl-12"
                                    placeholder="admin"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-orange-200/80 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-200/50 group-focus-within:text-orange-400 transition-colors" fontSize="small" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="glass-input !pl-12 !pr-12"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-200/50 hover:text-orange-200 focus:outline-none transition-colors"
                                >
                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-orange-200/60 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer hover:text-orange-200 transition-colors">
                                <input type="checkbox" className="rounded border-white/20 bg-white/10 text-orange-500 focus:ring-offset-0" />
                                Remember me
                            </label>
                            <button type="button" className="hover:text-white transition-colors">Forgot Password?</button>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full flex justify-center items-center gap-2 mt-4"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : 'Log In'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-white/30 mt-8 text-xs tracking-wider font-light">
                    © 2025 DAILY DARSHAN PEARL
                </p>
            </div>
        </div>
    );
};

export default Login;
