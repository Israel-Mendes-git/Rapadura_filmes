// Apoio: mapeia nome de plataforma -> icone (lucide). Usado em GameCard e GameDetails.
import { Monitor, Apple, Smartphone, Gamepad2, Globe, MonitorSmartphone } from 'lucide-react';

// Retorna { Icon, label } a partir do nome cru da plataforma.
export function platformMeta(raw) {
  const k = String(raw || '').toLowerCase();
  if (k.includes('win')) return { Icon: Monitor, label: raw };
  if (k.includes('mac') || k.includes('osx') || k.includes('apple') || k.includes('ios')) return { Icon: Apple, label: raw };
  if (k.includes('linux')) return { Icon: MonitorSmartphone, label: raw };
  if (k.includes('android')) return { Icon: Smartphone, label: raw };
  if (k.includes('mobile') || k.includes('phone')) return { Icon: Smartphone, label: raw };
  if (k.includes('web') || k.includes('browser') || k.includes('html')) return { Icon: Globe, label: raw };
  if (k.includes('console') || k.includes('switch') || k.includes('xbox') || k.includes('playstation') || k.includes('ps')) return { Icon: Gamepad2, label: raw };
  return { Icon: Monitor, label: raw };
}

// Badge compacto (usado sobre a capa do card).
export function PlatformBadge({ name, className = '' }) {
  const { Icon, label } = platformMeta(name);
  return (
    <span
      title={label}
      className={
        'inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md ' +
        'px-2 py-0.5 text-[10px] font-medium text-white/95 ring-1 ring-white/20 ' +
        'shadow-sm shadow-black/40 ' +
        className
      }
    >
      <Icon className="h-3 w-3" aria-hidden />
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
}

export default PlatformBadge;
