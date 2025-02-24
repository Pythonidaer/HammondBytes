import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import Home from './components/Home';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="w-full">
          <Navbar />
          <main className="pt-[50px] w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts" element={<PostList />} />
              <Route path="/posts/:id" element={<PostDetail />} />
            </Routes>
          </main>
          <div 
            className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center"
            id="cookie-consent"
          >
            <p>This website uses cookies to enhance the user experience.</p>
            <button 
              onClick={() => {
                document.cookie = "cookieConsent=accepted;max-age=31536000;path=/";
                document.getElementById('cookie-consent').style.display = 'none';
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Accept
            </button>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
