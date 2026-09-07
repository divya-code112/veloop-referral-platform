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

function App() {
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;