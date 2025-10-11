import React, { useState, useEffect } from 'react';
import { Calendar, Users, TrendingUp, LogIn, UserPlus, Home, BarChart3, Search, Filter, Clock, MapPin, Zap } from 'lucide-react';

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

  // Inject fonts and viewport meta tag
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Michroma&family=Rajdhani:wght@400;600;700&display=swap');
      body {
        font-family: 'Rajdhani', sans-serif;
      }
    `;
    document.head.appendChild(style);

    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
        meta = document.createElement('meta');
        meta.name = "viewport";
        meta.content = "width=device-width, initial-scale=1.0";
        document.getElementsByTagName('head')[0].appendChild(meta);
    } else {
        meta.content = "width=device-width, initial-scale=1.0";
    }
  }, []);

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

  const Navigation = () => (
    <nav style={{ backgroundColor: '#000', borderBottom: '2px solid #D4FF00', padding: '1rem', fontFamily: "'Rajdhani', sans-serif" }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={24} color="#D4FF00" />
          <h1 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '1px', fontFamily: "'Michroma', sans-serif" }}>
            SMART<span style={{ color: '#D4FF00' }}>EVENTS</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          <NavButton label="HOME" onClick={() => setCurrentPage('home')} />
          <NavButton label="EVENTS" onClick={() => setCurrentPage('events')} />
          {isLoggedIn && (
            <>
              <NavButton label="DASH" onClick={() => setCurrentPage('dashboard')} />
              <NavButton label="ANALYTICS" onClick={() => setCurrentPage('analytics')} />
              <button onClick={() => { setIsLoggedIn(false); setCurrentUser(null); setCurrentPage('home'); }} style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.875rem' }}>
                LOGOUT
              </button>
            </>
          )}
          {!isLoggedIn && (
            <button onClick={() => setCurrentPage('login')} style={{ padding: '0.5rem 1rem', backgroundColor: '#D4FF00', color: '#000', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.875rem' }}>
              LOGIN
            </button>
          )}
        </div>
      </div>
    </nav>
  );

  const NavButton = ({ label, onClick }) => (
    <button onClick={onClick} style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem', transition: 'all 0.3s' }} onMouseOver={(e) => { e.target.style.backgroundColor = '#D4FF00'; e.target.style.color = '#000'; }} onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#fff'; }}>
      {label}
    </button>
  );

  const HomePage = () => (
    <div style={{ minHeight: 'calc(100vh - 74px)', backgroundColor: '#000', color: '#fff', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: "'Michroma', sans-serif" }}>
            WELCOME TO <span style={{ color: '#D4FF00' }}>SMARTEVENTS</span>
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#9ca3af', marginBottom: '2rem', fontFamily: "'Rajdhani', sans-serif" }}>
            Discover and book cutting-edge tech events tailored for you
          </p>
          <button onClick={() => setCurrentPage('events')} style={{ backgroundColor: '#D4FF00', color: '#000', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif" }}>
            EXPLORE EVENTS →
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {[
            { icon: '🎓', title: 'WORKSHOPS', desc: 'Learn new skills' },
            { icon: '💡', title: 'SEMINARS', desc: 'Gain insights' },
            { icon: '🏆', title: 'HACKATHONS', desc: 'Build projects' },
            { icon: '🎨', title: 'CULTURAL', desc: 'Celebrate diversity' }
          ].map((cat, i) => (
            <div key={i} style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '0.5rem', border: '2px solid #27272a', textAlign: 'center', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#D4FF00'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#27272a'}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{cat.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: "'Michroma', sans-serif" }}>{cat.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{cat.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: '#18181b', borderRadius: '0.5rem', border: '2px solid #D4FF00', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', color: '#D4FF00', fontFamily: "'Michroma', sans-serif" }}>UPCOMING FEATURED EVENTS</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {events.slice(0, 3).map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const EventCard = ({ event }) => (
    <div style={{ backgroundColor: '#000', border: '2px solid #27272a', borderRadius: '0.5rem', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#D4FF00'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#27272a'}>
      <div style={{ background: 'linear-gradient(135deg, #D4FF00 0%, #22c55e 100%)', color: '#000', padding: '1.5rem', textAlign: 'center', fontSize: '2.5rem' }}>
        {event.image}
      </div>
      <div style={{ padding: '1rem' }}>
        <h4 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem', color: '#D4FF00', fontFamily: "'Michroma', sans-serif" }}>{event.title}</h4>
        <p style={{ color: '#9ca3af', marginBottom: '0.75rem', fontSize: '0.875rem' }}>{event.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
          <span>{event.date}</span>
          <span style={{ color: '#D4FF00' }}>{event.seats - event.booked} seats</span>
        </div>
      </div>
    </div>
  );

  const EventsPage = () => (
    <div style={{ minHeight: 'calc(100vh - 74px)', backgroundColor: '#000', color: '#fff', padding: '1.5rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#D4FF00', fontFamily: "'Michroma', sans-serif" }}>EXPLORE EVENTS</h2>
        
        <div style={{ backgroundColor: '#18181b', padding: '1rem', borderRadius: '0.5rem', border: '2px solid #D4FF00', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', backgroundColor: '#000', border: '2px solid #3f3f46', borderRadius: '0.5rem', color: '#fff', outline: 'none', fontSize: '0.875rem' }} onFocus={(e) => e.target.style.borderColor = '#D4FF00'} onBlur={(e) => e.target.style.borderColor = '#3f3f46'} />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', backgroundColor: '#000', border: '2px solid #3f3f46', borderRadius: '0.5rem', color: '#fff', outline: 'none', fontSize: '0.875rem' }}>
              <option>All</option>
              <option>Workshop</option>
              <option>Seminar</option>
              <option>Hackathon</option>
              <option>Cultural</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {filteredEvents.map(event => (
            <div key={event.id} style={{ backgroundColor: '#18181b', borderRadius: '0.5rem', border: '2px solid #27272a', overflow: 'hidden', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#D4FF00'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#27272a'}>
              <div style={{ background: 'linear-gradient(135deg, #D4FF00 0%, #22c55e 100%)', color: '#000', padding: '1.5rem', textAlign: 'center', fontSize: '2.5rem' }}>
                {event.image}
              </div>
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1rem', color: '#D4FF00', fontFamily: "'Michroma', sans-serif" }}>{event.title}</h3>
                  <span style={{ backgroundColor: '#D4FF00', color: '#000', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {event.category}
                  </span>
                </div>
                <p style={{ color: '#9ca3af', marginBottom: '0.75rem', fontSize: '0.875rem' }}>{event.description}</p>
                
                <div style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#9ca3af', marginBottom: '0.5rem' }}>
                    <Calendar size={14} style={{ marginRight: '0.5rem', color: '#D4FF00' }} />
                    <span>{event.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#9ca3af', marginBottom: '0.5rem' }}>
                    <Clock size={14} style={{ marginRight: '0.5rem', color: '#D4FF00' }} />
                    <span>{event.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#9ca3af' }}>
                    <MapPin size={14} style={{ marginRight: '0.5rem', color: '#D4FF00' }} />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#9ca3af' }}>Seats</span>
                    <span style={{ fontWeight: 'bold', color: '#D4FF00' }}>{event.seats - event.booked}/{event.seats}</span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: '#27272a', borderRadius: '9999px', height: '6px' }}>
                    <div style={{ backgroundColor: '#D4FF00', height: '6px', borderRadius: '9999px', width: `${(event.booked / event.seats) * 100}%`, transition: 'all 0.3s' }}></div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#D4FF00' }}>
                    {event.price === 0 ? 'FREE' : `₹${event.price}`}
                  </span>
                  <button onClick={() => handleBooking(event.id)} disabled={event.booked >= event.seats} style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 'bold', border: 'none', cursor: event.booked >= event.seats ? 'not-allowed' : 'pointer', backgroundColor: event.booked >= event.seats ? '#3f3f46' : '#D4FF00', color: event.booked >= event.seats ? '#6b7280' : '#000', transition: 'all 0.3s', fontSize: '0.875rem', flex: 1, minWidth: '100px' }}>
                    {event.booked >= event.seats ? 'SOLD OUT' : 'BOOK'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const LoginPage = () => (
    <div style={{ minHeight: 'calc(100vh - 74px)', backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: "'Michroma', sans-serif" }}>
            <span style={{ color: '#D4FF00' }}>SMART</span>EVENTS
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Access your tech event dashboard</p>
        </div>

        <div style={{ backgroundColor: '#18181b', borderRadius: '0.5rem', border: '2px solid #D4FF00', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#000' }}>
            <button onClick={() => setIsSignup(false)} style={{ padding: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', backgroundColor: !isSignup ? '#D4FF00' : '#18181b', color: !isSignup ? '#000' : '#9ca3af', transition: 'all 0.3s', fontSize: '0.875rem' }}>
              LOGIN
            </button>
            <button onClick={() => setIsSignup(true)} style={{ padding: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', backgroundColor: isSignup ? '#D4FF00' : '#18181b', color: isSignup ? '#000' : '#9ca3af', transition: 'all 0.3s', fontSize: '0.875rem' }}>
              SIGN UP
            </button>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {!isSignup ? (
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#D4FF00', fontFamily: "'Michroma', sans-serif" }}>EMAIL</label>
                  <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="demo@example.com" required style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', backgroundColor: '#000', border: '2px solid #3f3f46', borderRadius: '0.375rem', color: '#fff', outline: 'none', fontSize: '0.875rem' }} onFocus={(e) => e.target.style.borderColor = '#D4FF00'} onBlur={(e) => e.target.style.borderColor = '#3f3f46'} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#D4FF00', fontFamily: "'Michroma', sans-serif" }}>PASSWORD</label>
                  <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" required style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', backgroundColor: '#000', border: '2px solid #3f3f46', borderRadius: '0.375rem', color: '#fff', outline: 'none', fontSize: '0.875rem' }} onFocus={(e) => e.target.style.borderColor = '#D4FF00'} onBlur={(e) => e.target.style.borderColor = '#3f3f46'} />
                </div>
                <button type="submit" style={{ width: '100%', backgroundColor: '#D4FF00', color: '#000', padding: '0.75rem', borderRadius: '0.375rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
                  LOGIN
                </button>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', backgroundColor: '#27272a', padding: '0.75rem', borderRadius: '0.25rem', marginTop: '0.75rem', textAlign: 'center' }}>
                  Demo: demo@example.com / demo123
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignup}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#D4FF00', fontFamily: "'Michroma', sans-serif" }}>NAME</label>
                  <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="John Doe" required style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', backgroundColor: '#000', border: '2px solid #3f3f46', borderRadius: '0.375rem', color: '#fff', outline: 'none', fontSize: '0.875rem' }} onFocus={(e) => e.target.style.borderColor = '#D4FF00'} onBlur={(e) => e.target.style.borderColor = '#3f3f46'} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#D4FF00', fontFamily: "'Michroma', sans-serif" }}>EMAIL</label>
                  <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="john@example.com" required style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', backgroundColor: '#000', border: '2px solid #3f3f46', borderRadius: '0.375rem', color: '#fff', outline: 'none', fontSize: '0.875rem' }} onFocus={(e) => e.target.style.borderColor = '#D4FF00'} onBlur={(e) => e.target.style.borderColor = '#3f3f46'} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#D4FF00', fontFamily: "'Michroma', sans-serif" }}>PASSWORD</label>
                  <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="••••••••" required style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', backgroundColor: '#000', border: '2px solid #3f3f46', borderRadius: '0.375rem', color: '#fff', outline: 'none', fontSize: '0.875rem' }} onFocus={(e) => e.target.style.borderColor = '#D4FF00'} onBlur={(e) => e.target.style.borderColor = '#3f3f46'} />
                </div>
                <button type="submit" style={{ width: '100%', backgroundColor: '#D4FF00', color: '#000', padding: '0.75rem', borderRadius: '0.375rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
                  CREATE ACCOUNT
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const DashboardPage = () => {
    const myBookings = events.filter(e => currentUser.bookings.includes(e.id));
    const recommended = getRecommendedEvents();
    
    return (
      <div style={{ minHeight: 'calc(100vh - 74px)', backgroundColor: '#000', color: '#fff', padding: '1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#D4FF00', fontFamily: "'Michroma', sans-serif" }}>
            WELCOME, {currentUser.name.toUpperCase()}!
          </h2>
          <p style={{ color: '#9ca3af', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Manage your events and discover new ones</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: '#18181b', padding: '1rem', borderRadius: '0.5rem', border: '2px solid #D4FF00', textAlign: 'center' }}>
              <p style={{ color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.75rem' }}>TOTAL BOOKINGS</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#D4FF00' }}>{currentUser.bookings.length}</p>
            </div>
            <div style={{ backgroundColor: '#18181b', padding: '1rem', borderRadius: '0.5rem', border: '2px solid #3f3f46', textAlign: 'center' }}>
              <p style={{ color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.75rem' }}>UPCOMING EVENTS</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#fff' }}>{myBookings.length}</p>
            </div>
            <div style={{ backgroundColor: '#18181b', padding: '1rem', borderRadius: '0.5rem', border: '2px solid #3f3f46', textAlign: 'center' }}>
              <p style={{ color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.75rem' }}>RECOMMENDED</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#fff' }}>{recommended.length}</p>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#D4FF00', fontFamily: "'Michroma', sans-serif" }}>MY BOOKED EVENTS</h3>
            {myBookings.length === 0 ? (
              <div style={{ backgroundColor: '#18181b', padding: '2rem', borderRadius: '0.5rem', border: '2px solid #3f3f46', textAlign: 'center' }}>
                <p style={{ color: '#9ca3af', marginBottom: '1rem', fontSize: '0.875rem' }}>No bookings yet. Explore events to get started!</p>
                <button onClick={() => setCurrentPage('events')} style={{ backgroundColor: '#D4FF00', color: '#000', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
                  BROWSE EVENTS
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {myBookings.map(event => (
                  <div key={event.id} style={{ backgroundColor: '#18181b', borderRadius: '0.5rem', border: '2px solid #3f3f46', padding: '1rem', display: 'flex', gap: '1rem', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#D4FF00'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#3f3f46'}>
                    <div style={{ fontSize: '1.75rem', minWidth: '32px' }}>{event.image}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '0.25rem', color: '#D4FF00', fontFamily: "'Michroma', sans-serif" }}>
                        {event.title}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.5rem' }}>{event.category}</p>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                        <Calendar size={12} style={{ marginRight: '0.25rem', color: '#D4FF00' }} />
                        <span>{event.date} at {event.time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: '#9ca3af' }}>
                        <MapPin size={12} style={{ marginRight: '0.25rem', color: '#D4FF00' }} />
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#D4FF00', fontFamily: "'Michroma', sans-serif" }}>
                RECOMMENDED FOR YOU
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {recommended.map(event => (
                  <div key={event.id} style={{ backgroundColor: '#18181b', borderRadius: '0.5rem', border: '2px solid #3f3f46', overflow: 'hidden', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#D4FF00'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#3f3f46'}>
                    <div style={{ background: 'linear-gradient(135deg, #D4FF00 0%, #22c55e 100%)', color: '#000', padding: '1rem', textAlign: 'center', fontSize: '2rem' }}>
                      {event.image}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#D4FF00', fontSize: '0.95rem', fontFamily: "'Michroma', sans-serif" }}>
                        {event.title}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.75rem' }}>
                        {event.description}
                      </p>
                      <button onClick={() => handleBooking(event.id)} style={{ width: '100%', backgroundColor: '#D4FF00', color: '#000', padding: '0.5rem', borderRadius: '0.375rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>
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

  const AnalyticsPage = () => {
    const totalBookings = events.reduce((sum, e) => sum + e.booked, 0);
    const avgAttendance = Math.round(events.reduce((sum, e) => sum + (e.booked / e.seats * 100), 0) / events.length);
    const categoryStats = {};
    events.forEach(e => {
      categoryStats[e.category] = (categoryStats[e.category] || 0) + e.booked;
    });
    const sortedTopEvents = [...events].sort((a, b) => b.booked - a.booked).slice(0, 4);
    const maxBookings = sortedTopEvents.length > 0 ? sortedTopEvents[0].booked : 1;


    return (
      <div style={{ minHeight: 'calc(100vh - 74px)', backgroundColor: '#000', color: '#fff', padding: '1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#D4FF00', fontFamily: "'Michroma', sans-serif" }}>
            ANALYTICS DASHBOARD
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #D4FF00 0%, #22c55e 100%)', color: '#000', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>TOTAL EVENTS</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{events.length}</p>
            </div>
            <div style={{ backgroundColor: '#18181b', color: '#fff', padding: '1.5rem', borderRadius: '0.5rem', border: '2px solid #3f3f46', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af', marginBottom: '0.5rem' }}>TOTAL BOOKINGS</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{totalBookings}</p>
            </div>
            <div style={{ backgroundColor: '#18181b', color: '#fff', padding: '1.5rem', borderRadius: '0.5rem', border: '2px solid #3f3f46', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af', marginBottom: '0.5rem' }}>AVG ATTENDANCE</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{avgAttendance}%</p>
            </div>
            <div style={{ backgroundColor: '#18181b', color: '#fff', padding: '1.5rem', borderRadius: '0.5rem', border: '2px solid #3f3f46', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af', marginBottom: '0.5rem' }}>ACTIVE USERS</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{users.length}</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '0.5rem', border: '2px solid #D4FF00', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#D4FF00', fontFamily: "'Michroma', sans-serif" }}>TOP EVENTS BY BOOKINGS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sortedTopEvents.map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.875rem', minWidth: '150px', flex: '1 1 150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</span>
                  <div style={{ flex: '2 1 200px', backgroundColor: '#27272a', borderRadius: '0.25rem', height: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#D4FF00', height: '100%', width: `${(e.booked / maxBookings) * 100}%`, transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '0.5rem' }}>
                      <span style={{ color: '#000', fontSize: '0.75rem', fontWeight: 'bold' }}>{e.booked}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#18181b', padding: '1.5rem', borderRadius: '0.5rem', border: '2px solid #3f3f46' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fff', fontFamily: "'Michroma', sans-serif" }}>CATEGORY DISTRIBUTION</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {Object.entries(categoryStats).map(([cat, count]) => (
                <div key={cat} style={{ backgroundColor: '#000', padding: '1rem', borderRadius: '0.375rem', border: '1px solid #27272a', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>{cat}</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#D4FF00' }}>{count}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>bookings</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
      <Navigation />
      <main>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'events' && <EventsPage />}
        {currentPage === 'login' && <LoginPage />}
        {currentPage === 'dashboard' && isLoggedIn && <DashboardPage />}
        {currentPage === 'analytics' && isLoggedIn && <AnalyticsPage />}
      </main>
    </div>
  );
};

export default App;