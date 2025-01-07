import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AddProperty from './pages/AddProperty';
import PropertyList from './components/PropertyList';
import Contact from './pages/Contact';
import Login from './pages/Login';
import PropertyDetail from './pages/PropertyDetail';
import './styles/app.css';

// Protected Route bileşeni
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/ilan-ekle" 
              element={
                <ProtectedRoute>
                  <AddProperty />
                </ProtectedRoute>
              } 
            />
            <Route path="/ilanlar" element={<PropertyList />} />
            <Route path="/iletisim" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
