import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Loader from './components/Loader.jsx';
import BackToTop from './components/BackToTop';
import Footer from './components/Footer';
import Home from './pages/home/Home.jsx';
import Navbar from './components/Navbar';
import About from './pages/about/About';
import Features from './pages/features/Features';
import HowItWork from './pages/howItWork/HowItWork';
import Faq from './components/Faq';
import Contact from './pages/message/Contact';



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
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
      
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/how-to-use" element={<HowItWork />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
       
          <BackToTop />
          <Footer />
        </div>
      )}
    </div>
  </Router>
  );
};

export default App;