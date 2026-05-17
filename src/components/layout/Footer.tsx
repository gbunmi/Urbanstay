import { Building2, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-100">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-black shadow-md">
                U
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                URBAN<span className="font-light text-slate-400">STAY</span>
              </span>
            </Link>
            <p className="max-w-sm text-slate-500 mb-8 leading-relaxed text-sm font-medium">
              The gold standard for urban property search in Nigeria. Trusted by thousands for verified listings and seamless transitions.
            </p>
            <div className="flex gap-3">
              <Twitter className="h-5 w-5 text-slate-400 hover:text-primary cursor-pointer transition-colors" />
              <Facebook className="h-5 w-5 text-slate-400 hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-slate-400 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-6 uppercase tracking-widest text-[10px]">Operations</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><Link to="/properties" className="hover:text-primary transition-colors">Premium Listings</Link></li>
              <li><Link to="/auth?mode=signup" className="hover:text-primary transition-colors">Portfolio Management</Link></li>
              <li><Link to="/properties" className="hover:text-primary transition-colors">Market Insights</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-6 uppercase tracking-widest text-[10px]">Governance</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><Link to="#" className="hover:text-primary transition-colors">Privacy Charter</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Security Audit</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Compliance</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="h-12 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between px-6 text-[10px] uppercase font-black tracking-widest text-slate-400">
        <div className="flex gap-8">
            <span>&copy; 2026 UrbanStay Technology Ltd.</span>
            <span className="hidden sm:inline">Secure Layer-7 Encryption</span>
        </div>
        <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Node: Operational
            </span>
            <span className="hidden sm:inline">Market: Live</span>
        </div>
      </div>
    </footer>
  );
}
