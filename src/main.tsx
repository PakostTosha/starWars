import { createRoot } from 'react-dom/client';
import MainSwapi from './components/screens/Main/MainSwapi';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from './components/screens/NotFound/NotFound';
import Vehicles from './components/screens/Vehicles/Vehicles';

createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<Routes>
			<Route path='/' element={<MainSwapi />} />
			<Route path='/page/:page' element={<MainSwapi />} />
			<Route path='/vehicles' element={<Vehicles />} />
			<Route path='*' element={<NotFound />} />
		</Routes>
	</BrowserRouter>
);
