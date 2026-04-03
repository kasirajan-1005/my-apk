import PanelCard from '@/components/PanelCard';

export default function LoadingScreen({ label = 'Loading DM to Kasi...' }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <PanelCard className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-4 h-14 w-14 animate-pulse rounded-full brand-gradient" />
        <h1 className="text-2xl font-semibold text-slate-900">DM to Kasi</h1>
        <p className="mt-3 text-sm text-slate-600">{label}</p>
      </PanelCard>
    </main>
  );
}
