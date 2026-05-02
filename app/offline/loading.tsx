// file: app/offline/loading.tsx
// purpose: Loading skeleton for offline page

export default function OfflineLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center flex flex-col items-center space-y-6 animate-pulse">
        <div className="w-24 h-24 bg-muted rounded-full mb-4"></div>
        <div className="space-y-3 w-full flex flex-col items-center">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
        </div>
        <div className="h-12 w-32 bg-muted rounded-full mt-8"></div>
      </div>
    </div>
  );
}
