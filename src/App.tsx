import { RouterProvider } from '@tanstack/react-router';
import {
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner"

import { router } from './lib/route';
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});
function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<Toaster />
		</QueryClientProvider>
	);
}

export default App;
