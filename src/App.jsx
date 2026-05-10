import { Routes, Route, Link } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Divination from './pages/Divination'
import Learn from './pages/Learn'
import Practice from './pages/Practice'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/divination" element={<Divination />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
