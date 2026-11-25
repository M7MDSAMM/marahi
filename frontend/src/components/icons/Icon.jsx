export default function Icon({ children, size = 24, strokeWidth, ...props }) {
  return (
    <svg width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}
