import React, { useState, useEffect } from 'react';
import { Calendar, Users, TrendingUp, LogIn, UserPlus, Home, BarChart3, Search, Filter, Clock, MapPin, Tag, Zap, Code, Cpu } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Initial mock data
const initialEvents = [
  { id: 1, title: "AI & Machine Learning Workshop", category: "Workshop", date: "2025-10-25", time: "10:00 AM", location: "Tech Hub A", seats: 50, booked: 35, price: 500, description: "Learn the fundamentals of AI and ML", image: "🤖" },
  { id: 2, title: "Web Development Bootcamp", category: "Workshop", date: "2025-10-28", time: "9:00 AM", location: "Lab 101", seats: 40, booked: 28, price: 800, description: "Master modern web technologies", image: "💻" },
  { id: 3, title: "Entrepreneurship Seminar", category: "Seminar", date: "2025-11-05", time: "2:00 PM", location: "Auditorium", seats: 200, booked: 145, price: 0, description: "Learn from successful entrepreneurs", image: "💼" },
  { id: 4, title: "Code Sprint Hackathon", category: "Hackathon", date: "2025-11-10", time: "8:00 AM", location: "Innovation Center", seats: 100, booked: 87, price: 1000, description: "24-hour coding challenge", image: "🏆" },
  { id: 5, title: "Cultural Fest 2025", category: "Cultural", date: "2025-11-15", time: "5:00 PM", location: "Main Ground", seats: 500, booked: 320, price: 200, description: "Celebrate diversity and culture", image: "🎭" },
  { id: 6, title: "Data Science Summit", category: "Seminar", date: "2025-11-20", time: "11:00 AM", location: "Conference Hall", seats: 150, booked: 95, price: 0, description: "Latest trends in data science", image: "📊" },
  { id: 7, title: "Music Night", category: "Cultural", date: "2025-11-22", time: "7:00 PM", location: "Open Theater", seats: 300, booked: 245, price: 300, description: "Live music performances", image: "🎵" },
  { id: 8, title: "Blockchain Workshop", category: "Workshop", date: "2025-11-25", time: "1:00 PM", location: "Tech Hub B", seats: 45, booked: 30, price: 600, description: "Understanding blockchain technology", image: "⛓️" }
];

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState(initialEvents);
  const [users, setUsers] = useState([
    { id: 1, name: "Demo User", email: "demo@example.com", password: "demo123", bookings: [1, 4] }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  // Analytics data
  const analyticsData = {
    participationTrend: [
      { month: 'Jun', participants: 450 },
      { month: 'Jul', participants: 580 },
      { month: 'Aug', participants: 720 },
      { month: 'Sep', participants: 650 },
      { month: 'Oct', participants: 890 }
    ],
    categoryDistribution: [
      { name: 'Workshop', value: 35 },
      { name: 'Seminar', value: 25 },
      { name: 'Hackathon', value: 20 },
      { name: 'Cultural', value: 20 }
    ],
    topEvents: [
      { name: 'AI Workshop', bookings: 35 },
      { name: 'Code Sprint', bookings: 87 },
      { name: 'Cultural Fest', bookings: 320 },
      { name: 'Music Night', bookings: 245 }
    ]
  };

  const COLORS = ['#D4FF00', '#FFFFFF', '#666666', '#333333'];

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      setCurrentPage('dashboard');
      setLoginEmail('');
      setLoginPassword('');
    } else {
      alert('Invalid credentials! Try demo@example.com / demo123');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (users.find(u => u.email === signupEmail)) {
      alert('Email already exists!');
      return;
    }
    const newUser = {
      id: users.length + 1,
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      bookings: []
    };
    setUsers([...users, newUser]);
    setIsLoggedIn(true);
    setCurrentUser(newUser);
    setCurrentPage('dashboard');
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
  };

  const handleBooking = (eventId) => {
    if (!isLoggedIn) {
      alert('Please login to book events!');
      setCurrentPage('login');
      return;
    }
    
    const event = events.find(e => e.id === eventId);
    if (event.booked >= event.seats) {
      alert('Event is fully booked!');
      return;
    }
    
    if (currentUser.bookings.includes(eventId)) {
      alert('You have already booked this event!');
      return;
    }

    setEvents(events.map(e => 
      e.id === eventId ? { ...e, booked: e.booked + 1 } : e
    ));
    
    setUsers(users.map(u => 
      u.id === currentUser.id ? { ...u, bookings: [...u.bookings, eventId] } : u
    ));
    
    setCurrentUser({ ...currentUser, bookings: [...currentUser.bookings, eventId] });
    alert('Booking successful!');
  };

  const getRecommendedEvents = () => {
    if (!currentUser) return [];
    const bookedCategories = events
      .filter(e => currentUser.bookings.includes(e.id))
      .map(e => e.category);
    return events.filter(e => 
      bookedCategories.includes(e.category) && !currentUser.bookings.includes(e.id)
    ).slice(0, 3);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Pixel Character Component
  const PixelCharacter = ({ type, className = "" }) => {
    const characters = {
      robot: (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor">
          <rect x="10" y="8" width="12" height="16" />
          <rect x="8" y="10" width="2" height="4" />
          <rect x="22" y="10" width="2" height="4" />
          <rect x="12" y="12" width="2" height="2" fill="#D4FF00" />
          <rect x="18" y="12" width="2" height="2" fill="#D4FF00" />
          <rect x="14" y="18" width="4" height="2" fill="#D4FF00" />
          <rect x="10" y="24" width="4" height="4" />
          <rect x="18" y="24" width="4" height="4" />
        </svg>
      ),
      coder: (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor">
          <rect x="11" y="6" width="10" height="10" />
          <rect x="13" y="9" width="2" height="2" fill="#D4FF00" />
          <rect x="17" y="9" width="2" height="2" fill="#D4FF00" />
          <rect x="14" y="12" width="4" height="1" fill="#D4FF00" />
          <rect x="11" y="16" width="10" height="8" />
          <rect x="8" y="18" width="3" height="6" />
          <rect x="21" y="18" width="3" height="6" />
          <rect x="11" y="24" width="4" height="4" />
          <rect x="17" y="24" width="4" height="4" />
        </svg>
      )
    };
    return characters[type] || characters.robot;
  };

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-black text-white shadow-lg border-b-2 border-lime-400">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Zap className="w-8 h-8 text-lime-400" />
            <h1 className="text-2xl font-bold tracking-wider" style={{ fontFamily: 'Michroma, sans-serif' }}>
              SMART<span className="text-lime-400">EVENTS</span>
            </h1>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentPage('home')} 
              className="flex items-center space-x-2 hover:bg-lime-400 hover:text-black px-4 py-2 rounded transition border border-transparent hover:border-lime-400"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              <Home className="w-4 h-4" />
              <span className="font-semibold">HOME</span>
            </button>
            <button 
              onClick={() => setCurrentPage('events')} 
              className="flex items-center space-x-2 hover:bg-lime-400 hover:text-black px-4 py-2 rounded transition border border-transparent hover:border-lime-400"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              <Calendar className="w-4 h-4" />
              <span className="font-semibold">EVENTS</span>
            </button>
            {isLoggedIn && (
              <>
                <button 
                  onClick={() => setCurrentPage('dashboard')} 
                  className="flex items-center space-x-2 hover:bg-lime-400 hover:text-black px-4 py-2 rounded transition border border-transparent hover:border-lime-400"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  <Users className="w-4 h-4" />
                  <span className="font-semibold">DASHBOARD</span>
                </button>
                <button 
                  onClick={() => setCurrentPage('analytics')} 
                  className="flex items-center space-x-2 hover:bg-lime-400 hover:text-black px-4 py-2 rounded transition border border-transparent hover:border-lime-400"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="font-semibold">ANALYTICS</span>
                </button>
              </>
            )}
            {!isLoggedIn ? (
              <button 
                onClick={() => setCurrentPage('login')} 
                className="flex items-center space-x-2 bg-lime-400 text-black px-4 py-2 rounded font-bold hover:bg-lime-300 transition"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                <LogIn className="w-4 h-4" />
                <span>LOGIN</span>
              </button>
            ) : (
              <button 
                onClick={() => { setIsLoggedIn(false); setCurrentUser(null); setCurrentPage('home'); }} 
                className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600 transition"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                <span>LOGOUT</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  // Home Page
  const HomePage = () => (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold mb-4" style={{ fontFamily: 'Michroma, sans-serif' }}>
            WELCOME TO <span className="text-lime-400">SMARTEVENTS</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            Discover and book cutting-edge tech events tailored for you
          </p>
          <button 
            onClick={() => setCurrentPage('events')} 
            className="bg-lime-400 text-black px-8 py-3 rounded-lg text-lg font-bold hover:bg-lime-300 transition border-2 border-lime-400"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            EXPLORE EVENTS →
          </button>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: '🎓', title: 'WORKSHOPS', desc: 'Learn new skills', color: 'lime' },
            { icon: '💡', title: 'SEMINARS', desc: 'Gain insights', color: 'lime' },
            { icon: '🏆', title: 'HACKATHONS', desc: 'Build projects', color: 'lime' },
            { icon: '🎨', title: 'CULTURAL', desc: 'Celebrate diversity', color: 'lime' }
          ].map((cat, i) => (
            <div key={i} className="bg-zinc-900 p-6 rounded-lg border-2 border-zinc-800 hover:border-lime-400 transition text-center group">
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-lime-400 transition" style={{ fontFamily: 'Michroma, sans-serif' }}>{cat.title}</h3>
              <p className="text-gray-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{cat.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900 rounded-lg border-2 border-lime-400 p-8">
          <h3 className="text-3xl font-bold mb-6 text-center text-lime-400" style={{ fontFamily: 'Michroma, sans-serif' }}>UPCOMING FEATURED EVENTS</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {events.slice(0, 3).map(event => (
              <div key={event.id} className="bg-black border-2 border-zinc-800 rounded-lg overflow-hidden hover:border-lime-400 transition">
                <div className="bg-gradient-to-br from-lime-400 to-green-500 text-black p-6 text-center text-4xl font-bold">
                  {event.image}
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2 text-lime-400" style={{ fontFamily: 'Michroma, sans-serif' }}>{event.title}</h4>
                  <p className="text-sm text-gray-400 mb-3" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{event.description}</p>
                  <div className="flex justify-between text-sm text-gray-500" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    <span>{event.date}</span>
                    <span className="text-lime-400">{event.seats - event.booked} seats left</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Events Page
  const EventsPage = () => (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-lime-400" style={{ fontFamily: 'Michroma, sans-serif' }}>EXPLORE EVENTS</h2>
        
        <div className="bg-zinc-900 p-6 rounded-lg border-2 border-lime-400 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-lime-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black border-2 border-zinc-700 rounded-lg focus:border-lime-400 outline-none text-white"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 text-lime-400 w-5 h-5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black border-2 border-zinc-700 rounded-lg focus:border-lime-400 outline-none text-white"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                <option>All</option>
                <option>Workshop</option>
                <option>Seminar</option>
                <option>Hackathon</option>
                <option>Cultural</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div key={event.id} className="bg-zinc-900 rounded-lg border-2 border-zinc-800 hover:border-lime-400 transition overflow-hidden">
              <div className="bg-gradient-to-br from-lime-400 to-green-500 text-black p-8 text-center text-5xl font-bold">
                {event.image}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-xl text-lime-400" style={{ fontFamily: 'Michroma, sans-serif' }}>{event.title}</h3>
                  <span className="bg-lime-400 text-black px-2 py-1 rounded text-xs font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {event.category}
                  </span>
                </div>
                <p className="text-gray-400 mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{event.description}</p>
                
                <div className="space-y-2 mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-2 text-lime-400" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-2 text-lime-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="w-4 h-4 mr-2 text-lime-400" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    <span className="text-gray-400">Available Seats</span>
                    <span className="font-bold text-lime-400">{event.seats - event.booked}/{event.seats}</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div 
                      className="bg-lime-400 h-2 rounded-full transition-all"
                      style={{ width: `${(event.booked / event.seats) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-lime-400" style={{ fontFamily: 'Michroma, sans-serif' }}>
                    {event.price === 0 ? 'FREE' : `₹${event.price}`}
                  </span>
                  <button
                    onClick={() => handleBooking(event.id)}
                    disabled={event.booked >= event.seats}
                    className={`px-6 py-2 rounded-lg font-bold transition ${
                      event.booked >= event.seats
                        ? 'bg-zinc-700 cursor-not-allowed text-gray-500'
                        : 'bg-lime-400 text-black hover:bg-lime-300'
                    }`}
                    style={{ fontFamily: 'Rajdhani, sans-serif' }}
                  >
                    {event.booked >= event.seats ? 'SOLD OUT' : 'BOOK NOW'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Login/Signup Page
  const LoginPage = () => (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <PixelCharacter type="robot" className="absolute top-20 left-10 w-16 h-16 text-lime-400 opacity-20 animate-bounce" style={{ animationDuration: '3s' }} />
      <PixelCharacter type="coder" className="absolute bottom-20 right-10 w-16 h-16 text-lime-400 opacity-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      <PixelCharacter type="robot" className="absolute top-40 right-32 w-12 h-12 text-white opacity-10 animate-bounce" style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Cpu className="w-16 h-16 mx-auto mb-4 text-lime-400" />
          <h2 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Michroma, sans-serif' }}>
            <span className="text-lime-400">SMART</span>EVENTS
          </h2>
          <p className="text-gray-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            Access your tech event dashboard
          </p>
        </div>

        <div className="bg-zinc-900 rounded-lg border-2 border-lime-400 overflow-hidden">
          <div className="grid grid-cols-2 bg-black">
            <button
              onClick={() => setIsSignup(false)}
              className={`py-4 font-bold transition ${
                !isSignup 
                  ? 'bg-lime-400 text-black' 
                  : 'bg-zinc-900 text-gray-400 hover:text-white'
              }`}
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              <LogIn className="w-5 h-5 inline mr-2" />
              LOGIN
            </button>
            <button
              onClick={() => setIsSignup(true)}
              className={`py-4 font-bold transition ${
                isSignup 
                  ? 'bg-lime-400 text-black' 
                  : 'bg-zinc-900 text-gray-400 hover:text-white'
              }`}
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              <UserPlus className="w-5 h-5 inline mr-2" />
              SIGN UP
            </button>
          </div>

          <div className="p-8">
            {!isSignup ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-lime-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg focus:border-lime-400 outline-none text-white"
                    placeholder="demo@example.com"
                    style={{ fontFamily: 'Rajdhani, sans-serif' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-lime-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg focus:border-lime-400 outline-none text-white"
                    placeholder="••••••••"
                    style={{ fontFamily: 'Rajdhani, sans-serif' }}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-lime-400 text-black py-3 rounded-lg font-bold hover:bg-lime-300 transition"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  LOGIN →
                </button>
                <div className="text-center">
                  <p className="text-xs text-gray-500 bg-zinc-800 p-3 rounded" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    <Code className="w-4 h-4 inline mr-1" />
                    Demo: demo@example.com / demo123
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-lime-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg focus:border-lime-400 outline-none text-white"
                    placeholder="John Doe"
                    style={{ fontFamily: 'Rajdhani, sans-serif' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-lime-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg focus:border-lime-400 outline-none text-white"
                    placeholder="john@example.com"
                    style={{ fontFamily: 'Rajdhani, sans-serif' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-lime-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-black border-2 border-zinc-700 rounded-lg focus:border-lime-400 outline-none text-white"
                    placeholder="••••••••"
                    style={{ fontFamily: 'Rajdhani, sans-serif' }}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-lime-400 text-black py-3 rounded-lg font-bold hover:bg-lime-300 transition"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  CREATE ACCOUNT →
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <PixelCharacter type="coder" className="w-20 h-20 mx-auto text-lime-400" />
        </div>
      </div>
    </div>
  );

  // Dashboard Page
  const DashboardPage = () => {
    const myBookings = events.filter(e => currentUser.bookings.includes(e.id));
    const recommended = getRecommendedEvents();
    
    return (
      <div className="min-h-screen bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-2 text-lime-400" style={{ fontFamily: 'Michroma, sans-serif' }}>
            WELCOME, {currentUser.name.toUpperCase()}!
          </h2>
          <p className="text-gray-400 mb-8" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            Manage your events and discover new ones
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-zinc-900 p-6 rounded-lg border-2 border-lime-400">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>TOTAL BOOKINGS</p>
                  <p className="text-3xl font-bold text-lime-400" style={{ fontFamily: 'Michroma, sans-serif' }}>{currentUser.bookings.length}</p>
                </div>
                <Calendar className="w-12 h-12 text-lime-400" />
              </div>
            </div>
            <div className="bg-zinc-900 p-6 rounded-lg border-2 border-zinc-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>UPCOMING EVENTS</p>
                  <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Michroma, sans-serif' }}>{myBookings.length}</p>
                </div>
                <Clock className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="bg-zinc-900 p-6 rounded-lg border-2 border-zinc-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>RECOMMENDED</p>
                  <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Michroma, sans-serif' }}>{recommended.length}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-lime-400" style={{ fontFamily: 'Michroma, sans-serif' }}>MY BOOKED EVENTS</h3>
            {myBookings.length === 0 ? (
              <div className="bg-zinc-900 p-8 rounded-lg border-2 border-zinc-700 text-center">
                <PixelCharacter type="robot" className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  No bookings yet. Explore events to get started!
                </p>
                <button 
                  onClick={() => setCurrentPage('events')} 
                  className="bg-lime-400 text-black px-6 py-2 rounded-lg font-bold hover:bg-lime-300 transition"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  BROWSE EVENTS
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {myBookings.map(event => (
                  <div key={event.id} className="bg-zinc-900 rounded-lg border-2 border-zinc-700 hover:border-lime-400 transition p-6 flex">
                    <div className="text-4xl mr-4">{event.image}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1 text-lime-400" style={{ fontFamily: 'Michroma, sans-serif' }}>
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-400 mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {event.category}
                      </p>
                      <div className="flex items-center text-sm text-gray-400 mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        <Calendar className="w-4 h-4 mr-1 text-lime-400" />
                        <span>{event.date} at {event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        <MapPin className="w-4 h-4 mr-1 text-lime-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {recommended.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-lime-400" style={{ fontFamily: 'Michroma, sans-serif' }}>
                RECOMMENDED FOR YOU
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {recommended.map(event => (
                  <div key={event.id} className="bg-zinc-900 rounded-lg border-2 border-zinc-700 hover:border-lime-400 transition overflow-hidden">
                    <div className="bg-gradient-to-br from-lime-400 to-green-500 text-black p-6 text-center text-4xl font-bold">
                      {event.image}
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold mb-2 text-lime-400" style={{ fontFamily: 'Michroma, sans-serif' }}>
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-400 mb-3" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {event.description}
                      </p>
                      <button
                        onClick={() => handleBooking(event.id)}
                        className="w-full bg-lime-400 text-black py-2 rounded-lg font-bold hover:bg-lime-300 transition"
                        style={{ fontFamily: 'Rajdhani, sans-serif' }}
                      >
                        BOOK NOW
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Analytics Page
  const AnalyticsPage = () => (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-lime-400" style={{ fontFamily: 'Michroma, sans-serif' }}>
          ANALYTICS DASHBOARD
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-zinc-900 p-6 rounded-lg border-2 border-lime-400">
            <h3 className="text-xl font-bold mb-4 text-lime-400" style={{ fontFamily: 'Michroma, sans-serif' }}>
              PARTICIPATION TREND
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.participationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#D4FF00" style={{ fontFamily: 'Rajdhani, sans-serif' }} />
                <YAxis stroke="#D4FF00" style={{ fontFamily: 'Rajdhani, sans-serif' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '2px solid #D4FF00', fontFamily: 'Rajdhani, sans-serif' }}
                />
                <Legend wrapperStyle={{ fontFamily: 'Rajdhani, sans-serif' }} />
                <Line type="monotone" dataKey="participants" stroke="#D4FF00" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg border-2 border-zinc-700">
            <h3 className="text-xl font-bold mb-4 text-white" style={{ fontFamily: 'Michroma, sans-serif' }}>
              CATEGORY DISTRIBUTION
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  {analyticsData.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '2px solid #fff', fontFamily: 'Rajdhani, sans-serif' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-lg border-2 border-zinc-700 mb-8">
          <h3 className="text-xl font-bold mb-4 text-white" style={{ fontFamily: 'Michroma, sans-serif' }}>
            TOP EVENTS BY BOOKINGS
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.topEvents}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#fff" style={{ fontFamily: 'Rajdhani, sans-serif' }} />
              <YAxis stroke="#fff" style={{ fontFamily: 'Rajdhani, sans-serif' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '2px solid #fff', fontFamily: 'Rajdhani, sans-serif' }}
              />
              <Legend wrapperStyle={{ fontFamily: 'Rajdhani, sans-serif' }} />
              <Bar dataKey="bookings" fill="#D4FF00" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-lime-400 to-green-500 text-black p-6 rounded-lg border-2 border-lime-400">
            <p className="text-black/70 mb-2 font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              TOTAL EVENTS
            </p>
            <p className="text-4xl font-bold" style={{ fontFamily: 'Michroma, sans-serif' }}>
              {events.length}
            </p>
          </div>
          <div className="bg-zinc-900 text-white p-6 rounded-lg border-2 border-zinc-700">
            <p className="text-gray-400 mb-2 font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              TOTAL BOOKINGS
            </p>
            <p className="text-4xl font-bold" style={{ fontFamily: 'Michroma, sans-serif' }}>
              {events.reduce((sum, e) => sum + e.booked, 0)}
            </p>
          </div>
          <div className="bg-zinc-900 text-white p-6 rounded-lg border-2 border-zinc-700">
            <p className="text-gray-400 mb-2 font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              AVG ATTENDANCE
            </p>
            <p className="text-4xl font-bold" style={{ fontFamily: 'Michroma, sans-serif' }}>
              {Math.round(events.reduce((sum, e) => sum + (e.booked / e.seats * 100), 0) / events.length)}%
            </p>
          </div>
          <div className="bg-zinc-900 text-white p-6 rounded-lg border-2 border-zinc-700">
            <p className="text-gray-400 mb-2 font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              ACTIVE USERS
            </p>
            <p className="text-4xl font-bold" style={{ fontFamily: 'Michroma, sans-serif' }}>
              {users.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Michroma&family=Rajdhani:wght@400;500;600;700&display=swap');
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-bounce {
          animation: bounce 3s infinite;
        }
      `}</style>
      <Navigation />
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'events' && <EventsPage />}
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'dashboard' && isLoggedIn && <DashboardPage />}
      {currentPage === 'analytics' && isLoggedIn && <AnalyticsPage />}
    </div>
  );
};

export default App;