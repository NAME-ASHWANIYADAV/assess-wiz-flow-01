import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from "@/components/ui/toaster";
import Index from './pages/Index';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;