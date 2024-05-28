import { logger } from './utils'
import logic from './logic'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Feedback from './components/Feedback'
import { useState } from 'react'
import { Context } from './context'
import Confirm from './components/Confirm'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Game from './components/Game/Game'
import { errors } from 'com'
import { LayoutProvider, useLayout } from './LayoutContext';

const { UnauthorizedError } = errors

function App() {
  const [feedback, setFeedback] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const { showLayout } = useLayout();

  const navigate = useNavigate()

  const goToLogin = () => navigate('/login')

  const handleLoginClick = () => goToLogin()

  const handleRegisterClick = () => navigate('/register')

  const handleUserLoggedIn = () => navigate('/')

  const handleUserLoggedOut = () => goToLogin()

  const handleFeedbackAcceptClick = () => setFeedback(null)

  const handleFeedback = (error, level = 'warn') => {
    if (error instanceof UnauthorizedError) {
      logic.logoutUser()

      level = 'error'

      goToLogin()
    }

    setFeedback({ message: error.message, level })
  }

  const handleConfirm = (message, callback) => setConfirm({ message, callback })

  const handleConfirmCancelClick = () => {
    confirm.callback(false)

    setConfirm(null)
  }

  const handleConfirmAcceptClick = () => {
    confirm.callback(true)

    setConfirm(null)
  }

  logger.debug('App -> render')

  return (
      <Context.Provider value={{ showFeedback: handleFeedback, showConfirm: handleConfirm }}>
        {showLayout && <Navbar onUserLoggedOut={handleUserLoggedOut} />}
        <Routes>
          <Route path="/login" element={logic.isUserLoggedIn() ? <Navigate to="/" /> : <Login onRegisterClick={handleRegisterClick} onUserLoggedIn={handleUserLoggedIn} />} />
          <Route path="/register" element={logic.isUserLoggedIn() ? <Navigate to="/" /> : <Register onLoginClick={handleLoginClick} onUserRegistered={handleLoginClick} />} />
          <Route path="/game" element={<Game />} />
          <Route path="/*" element={logic.isUserLoggedIn() ? <Home onUserLoggedOut={handleUserLoggedOut} /> : <Navigate to="/login" />} />
        </Routes>
        {showLayout && <Footer />}
      {feedback && <Feedback mess age={feedback.message} level={feedback.level} onAcceptClick={handleFeedbackAcceptClick} />}
      {confirm && <Confirm message="hola confirm" onCancelClick={handleConfirmCancelClick} onAcceptClick={handleConfirmAcceptClick} />}
      </Context.Provider>
  );
}
export default App;
