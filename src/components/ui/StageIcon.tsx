/** Renders a stage icon — handles both emoji strings and SVG data URIs. */
export function StageIcon({
  icon,
  size = 24,
  className = '',
}: {
  icon: string;
  size?: number;
  className?: string;
}) {
  const isUrl = icon.startsWith('/') || icon.startsWith('data:') || icon.startsWith('http');

  if (isUrl) {
    return <img src={icon} alt="" className={className} style={{ width: size, height: size }} />;
  }

  return <span className={className}>{icon}</span>;
}
