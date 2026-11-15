import {
  House,
  Search,
  Heart,
  UserRound
} from "lucide-react";

import "./BottomNav.css";

const navItems = [
  { id: "home", key: "home", icon: House },
  { id: "search", key: "search", icon: Search },
  { id: "favorites", key: "favorites", icon: Heart },
  { id: "account", key: "account", icon: UserRound }
];

export default function BottomNav({ active, onChange, t }) {
  return (
    <nav className="bottom-nav" aria-label={t("home")}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const selected = active === item.id;

        return (
          <button
            key={item.id}
            type="button"
            className={`bottom-nav-item ${
              selected ? "active" : ""
            }`}
            aria-current={selected ? "page" : undefined}
            onClick={() => onChange(item.id)}
          >
            <Icon size={21} />
            <span>{t(item.key)}</span>
          </button>
        );
      })}
    </nav>
  );
}