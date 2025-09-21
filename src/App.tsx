import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import CreatorStudio from './pages/CreatorStudio';
import LearnerDashboard from './pages/LearnerDashboard';
import TakeAssignment from './pages/TakeAssignment';
import Assessment from './pages/Assessment';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/creator-studio" element={<CreatorStudio />} />
          <Route path="/learner-dashboard" element={<LearnerDashboard />} />
          <Route path="/assignment/:shareLink" element={<TakeAssignment />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </Router>
    </ThemeProvider>
  );
}

export default App;