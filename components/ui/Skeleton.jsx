import { cn } from '@/lib/cn';
import styles from './Skeleton.module.css';

export default function Skeleton({ className, style, tone = 'light', children, ...props }) {
  return (
    <div
      className={cn(styles.shimmer, tone === 'studio' ? cn(styles.studio, 'bg-studio-raised') : 'bg-panel-strong', className)}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
