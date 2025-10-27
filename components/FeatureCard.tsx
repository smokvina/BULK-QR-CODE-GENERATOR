
import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md flex items-start gap-4">
      <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
};
