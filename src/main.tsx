import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MainSwapi from './components/screens/MainSwapi';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<MainSwapi />
	</StrictMode>
);
