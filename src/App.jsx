import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Loader from './components/Loader';
import BackToTop from './components/BackToTop';
import Footer from './components/Footer';
import Home from './pages/home/Home';
import Navbar from './components/Navbar';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className='min-h-screen bg-white'>
        {loading ? (
          <Loader />
        ) : (
          <div className="relative">
            <Navbar/>
            <Home />
            <BackToTop />
            <Footer />
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;