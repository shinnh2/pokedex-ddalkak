
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { SearchPage } from './pages/SearchPage';
import { PokemonListPage } from './pages/PokemonListPage';
import { PokemonDetailPage } from './pages/PokemonDetailPage';
import './styles/global.scss';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/list" element={<PokemonListPage />} />
          <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
