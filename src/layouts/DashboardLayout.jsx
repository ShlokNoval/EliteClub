import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

export default function DashboardLayout({ type = 'admin' }) {
  return (
    <div className="min-h-screen bg-black-primary">
      <Sidebar type={type} />
      <main className="lg:ml-64 min-h-screen transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
