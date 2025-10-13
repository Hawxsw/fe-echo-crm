import { Menu } from './Menu';

export const Sidebar = () => {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow overflow-y-auto bg-white shadow-xl border-r border-slate-200">
        {/* Logo Section */}
        <div className="flex items-center justify-center px-6 py-8 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Echo CRM</h1>
              <p className="text-xs text-slate-500">Gestão Inteligente</p>
            </div>
          </div>
        </div>
        
        {/* Menu Section */}
        <div className="flex-1 px-3 py-6">
          <Menu />
        </div>

        {/* Footer Section */}
        <div className="px-4 py-4 border-t border-slate-200">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-500 text-center">v1.0.0</p>
            <p className="text-xs text-slate-400 text-center mt-1">© 2025 Echo CRM</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

