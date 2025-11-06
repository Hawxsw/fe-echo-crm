import { Toaster } from '@/components/ui/toaster';
import { Router } from '@/routes/routes';
import { ErrorBoundary } from '@/components/organisms/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Toaster />
      <Router />
    </ErrorBoundary>
  );
}

export default App;
