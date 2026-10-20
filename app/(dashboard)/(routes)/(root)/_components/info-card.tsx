import { LucideIcon } from 'lucide-react';

import { IconBadge } from '@/components/icon-badge';

interface InfoCardProps {
  numberOfItems: number;
  variant?: 'default' | 'success';
  label: string;
  icon: LucideIcon;
}

export const InfoCard = ({
  variant,
  icon: Icon,
  numberOfItems,
  label,
}: InfoCardProps) => {
  return (
    <div className="glass rounded-2xl flex items-center gap-x-3 p-5 transition hover:-translate-y-0.5">
      <IconBadge variant={variant} icon={Icon} />
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-slate-500 text-sm">
          {numberOfItems} {numberOfItems === 1 ? 'Course' : 'Courses'}
        </p>
      </div>
    </div>
  );
};
