
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import Homepage from './pages/homepage'
import AddVocabPage from './pages/addvocab_page'
import { Toaster } from 'react-hot-toast'



function App() {
    return (
      <BrowserRouter>
      <Toaster position="top-right" />
        <Routes>
          <Route path='/' element= {<Homepage/>} />
          <Route path='/course/add_vocab' element = {<AddVocabPage/>} />
        </Routes>
      </BrowserRouter>
    )
}

export default App
