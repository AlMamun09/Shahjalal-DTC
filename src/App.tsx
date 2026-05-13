import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="text-brand-red font-poppins">Shahjalal Driving Center</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
