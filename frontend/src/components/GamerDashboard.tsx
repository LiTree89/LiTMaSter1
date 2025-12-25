import React from 'react';

// Types for dashboard widgets and layout
export type DashboardWidget = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  value?: string | number;
  color?: string;
  onClick?: () => void;
};

export type DashboardProps = {
  userName: string;
  widgets: DashboardWidget[];
  onWidgetClick?: (id: string) => void;
};

// Vibrant, gaming-inspired dashboard
const Dashboard: React.FC<DashboardProps> = ({ userName, widgets, onWidgetClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1333] via-[#2d1e5f] to-[#3a206e] p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-white mb-6 drop-shadow-lg tracking-wide">
        Welcome, {userName}!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {widgets.map(widget => (
          <div
            key={widget.id}
            className={`rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 bg-opacity-90 ${widget.color || 'bg-[#2e2257]'}`}
            style={{ background: widget.color || undefined }}
            onClick={() => onWidgetClick?.(widget.id)}
          >
            <div className="text-5xl mb-2">{widget.icon}</div>
            <div className="text-xl font-bold text-white mb-1">{widget.title}</div>
            {widget.value !== undefined && (
              <div className="text-3xl font-extrabold text-[#ffb400]">{widget.value}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
