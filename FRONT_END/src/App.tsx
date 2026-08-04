
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'

import Homepage from './pages/homepage'
import AddVocabPage from './pages/addvocab_page'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/login'
import ProtectedRoute from './protect/protectedRoute'
import { useDispatch, } from 'react-redux'
import type { AppDispatch } from './redux/store'
import { useEffect, useRef, useState, } from 'react'
import { refresh } from './services/auth_service'
import FlashCard_Page from './pages/flash_card/flashcard_page'
import { flushPendingFavorite, } from './services/vocab_service'
import Review_Page from './pages/review_page'
import Discuss from './components/discuss/discuss'
import ProfilePage from './pages/profile.page'
import MainLayout from './layouts/mainlayout'




function App() {
  const dispatch = useDispatch<AppDispatch>();
  const refreshCalled = useRef(false);
  const [isChecking, setChecking] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   if (refreshCalled.current) return;
  //   refreshCalled.current = true

  //   dispatch(refresh());
  // }, [])



  useEffect(() => {
    flushPendingFavorite();
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        flushPendingFavorite()
      }
    }

    // const hadnleUnload = () => {
    //   flushWithBeacon();
    // }

    document.addEventListener('visibilitychange', handleVisibility);
    // window.addEventListener('beforeunload', hadnleUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      // window.removeEventListener('beforeunload', hadnleUnload);
    }
  }, [])

  useEffect(() => {
    if (refreshCalled.current) return;
    refreshCalled.current = true;
    const autoLogin = async () => {
      try {
        setChecking(true);
        const res = await dispatch(refresh()).unwrap();
        if (res && res.newAccessToken) {
          if (location.pathname === '/login' || location.pathname === '/') {
            navigate('/home', { replace: true });
          }

        }
      } catch (error) {
        setChecking(false);
      } finally {
        setChecking(false);
      }
    }
    autoLogin();
  }, [dispatch, navigate])
  return (

    <>
      <Toaster position="top-right" containerStyle={{ zIndex: 999999 }} />
      <Routes>

        <Route path='/' element={<Navigate to="/login" replace />} />

        <Route path='/login' element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path='/home' element={<Homepage />} />
            <Route path='/course/add_vocab' element={<AddVocabPage />} />
            <Route path='/course/flashcard' element={<FlashCard_Page />} />
            <Route path='/course/review' element={<Review_Page />} />
            <Route path='/course/discuss' element={<Discuss />} />
            <Route path='/profile' element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>

    </>

  )
}

export default App
