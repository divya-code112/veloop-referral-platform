import { useEffect, useState } from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import ReferralPage from './pages/ReferralPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import TasksPage from './pages/TasksPage';
import WalletPage from './pages/WalletPage';

import PageLoader from './components/PageLoader/PageLoader';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<ReferralPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />

        <Route
          path="/tasks"
          element={<TasksPage />}
        />

        <Route
          path="/wallet"
          element={<WalletPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;