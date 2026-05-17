import { Link } from 'react-router-dom';
import { Crown, Mail, Phone, MapPin, Globe } from 'lucide-react';
import logo from '../../assets/logo.png';
import { brandInfo } from '../../data/mockData';

export default function Footer() {
  return (
    <footer className="relative bg-black-deep border-t border-gold/10">
      {/* Gold line accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img src={logo} alt="The Elite Club" className="h-16 w-auto mb-4" />
            <p className="text-smoke text-sm leading-relaxed mt-4">
              {brandInfo.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-gold font-semibold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/#" className="text-smoke text-sm hover:text-gold transition-colors duration-300">Home</a></li>
              <li><a href="/#membership" className="text-smoke text-sm hover:text-gold transition-colors duration-300">Membership Plans</a></li>
              <li><a href="/#benefits" className="text-smoke text-sm hover:text-gold transition-colors duration-300">Benefits</a></li>
              <li><a href="/#venues" className="text-smoke text-sm hover:text-gold transition-colors duration-300">Partner Venues</a></li>
              <li><a href="/#contact" className="text-smoke text-sm hover:text-gold transition-colors duration-300">Contact Us</a></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="font-playfair text-gold font-semibold mb-6 text-lg">Portals</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/login" className="text-smoke text-sm hover:text-gold transition-colors duration-300">
                  Member Login
                </Link>
              </li>
              <li>
                <Link to="/hotel-login" className="text-smoke text-sm hover:text-gold transition-colors duration-300">
                  Hotel Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-playfair text-gold font-semibold mb-6 text-lg">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-smoke text-sm">
                <Phone size={16} className="text-gold mt-0.5 shrink-0" />
                {brandInfo.phone}
              </li>
              <li className="flex items-start gap-3 text-smoke text-sm">
                <Mail size={16} className="text-gold mt-0.5 shrink-0" />
                {brandInfo.email}
              </li>
              <li className="flex items-start gap-3 text-smoke text-sm">
                <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                {brandInfo.location}
              </li>
            </ul>
            {/* Social */}
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-lg border border-gold/15 flex items-center justify-center text-smoke hover:text-gold hover:border-gold/30 transition-all duration-300"
                aria-label="Social Link"
              >
                <Globe size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gold/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-ash text-sm">
            © {new Date().getFullYear()} The Elite Club. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-ash text-sm">
            <Crown size={14} className="text-gold" />
            <span>Crafted for the connoisseur</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
