
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import Homepage from './pages/homepage'
import AddVocabPage from './pages/addvocab_page'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/login'
import ProtectedRoute from './protect/protectedRoute'




function App() {
    return (
      <BrowserRouter>
      <Toaster position="top-right" />
        <Routes>
          <Route path='/' element = {<LoginPage/>}/>
          <Route path='/home' element={<ProtectedRoute>
            <Homepage></Homepage>
          </ProtectedRoute>}/>
          <Route path='/course/add_vocab' element = {<AddVocabPage/>} />
        </Routes>
      </BrowserRouter>
    )
}

export default App
