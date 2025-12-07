import { Dashboard } from "../components/dashboard";
export default function HomePage() {
  return (
    <div className="dashboard-layout">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 space-y-6">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
