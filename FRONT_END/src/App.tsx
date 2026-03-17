
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import Homepage from './pages/homepage'
import AddVocabPage from './pages/addvocab_page'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/login'
import ProtectedRoute from './protect/protectedRoute'
import { useDispatch, } from 'react-redux'
import type { AppDispatch } from './redux/store'
import { useEffect, useRef, } from 'react'
import { refresh } from './services/auth_service'
import Flashcard from './pages/flash_card/flashcard_page'




function App() {
    const dispatch = useDispatch<AppDispatch>();
    //const token = useSelector((state : RootState) => state.Auth.token);
    const refreshCalled = useRef(false);

    useEffect(() => {
      if(refreshCalled.current) return ;
      refreshCalled.current = true

      dispatch(refresh());
    },[])

    //  if (authLoading && !token) return null;

    return (
      <BrowserRouter>
      <Toaster position="top-right" />
        <Routes>
          <Route path='/' element = {<LoginPage/>}/>
          <Route path='/home' element={<ProtectedRoute>
            <Homepage></Homepage>
          </ProtectedRoute>}/>
          <Route path='/course/add_vocab' element = {<AddVocabPage/>} />
          <Route path='/course/flashcard' element = {<Flashcard />} />
        </Routes>
      </BrowserRouter>
    )
}

export default App
