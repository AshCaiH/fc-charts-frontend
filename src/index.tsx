import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import './style.css';
import OCIDForm from './components/OCIDForm';

export function App() {
	return (
		<>
			<OCIDForm />
		</>
	);

	// return (
	// 	<LocationProvider>
	// 		<Header />
	// 		<main>
	// 			<Router>
	// 				<Route path="/" component={Home} />
	// 				<Route default component={NotFound} />
	// 			</Router>
	// 		</main>
	// 	</LocationProvider>
	// );
}

render(<App />, document.getElementById('app'));
