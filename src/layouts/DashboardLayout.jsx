import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { 
  Users, Building2, MapPin, Search, Receipt, 
  Settings, LogOut, Menu, X, CreditCard, Clock, CheckCircle, Crown, ShieldCheck, Mail, Calendar
} from 'lucide-react';

const adminLinks = [
  { name: 'Overview', path: '/admin', icon: Crown },
  { name: 'Members', path: '/admin/users', icon: Users },
  { name: 'QR Inventory', path: '/admin/cards', icon: CreditCard },
  { name: 'Hotels', path: '/admin/hotels', icon: Building2 },
  { name: 'Approvals', path: '/admin/approvals', icon: ShieldCheck },
  { name: 'Bills', path: '/admin/bills', icon: Receipt },
  { name: 'Events', path: '/admin/events', icon: Calendar },
  { name: 'Reports', path: '/admin/reports', icon: Search },
  { name: 'Messages', path: '/admin/messages', icon: Mail },
];

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
