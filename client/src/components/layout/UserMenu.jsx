import { useState, useRef, useEffect } from "react";
import {
  Settings,
  HelpCircle,
  LogOut,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  // Logout function
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition"
      >
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <User size={18} />
        </div>

        <div className="text-left hidden md:block">
          <h3 className="font-semibold text-sm">{user?.name || 'User'}</h3>
          <p className="text-gray-500 text-xs">
            {user?.email || 'user@example.com'}
          </p>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {/* User Info */}
          <div className="px-5 py-4 border-b">
            <h2 className="font-semibold text-lg">{user?.name || 'User'}</h2>
            <p className="text-gray-500 text-sm">
              {user?.email || 'user@example.com'}
            </p>
          </div>

          {/* Menu Items */}
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition text-left"
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>

          <button
            onClick={() => navigate("/help")}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition text-left"
          >
            <HelpCircle size={20} />
            <span>Help & Support</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 transition text-left text-red-500"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

