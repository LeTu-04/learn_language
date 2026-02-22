
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import Homepage from './pages/homepage'
import AddVocabPage from './pages/addvocab_page'



function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element= {<Homepage/>} />
          <Route path='/course/add_vocab' element = {<AddVocabPage/>} />
        </Routes>
      </BrowserRouter>
    )
}

export default App
