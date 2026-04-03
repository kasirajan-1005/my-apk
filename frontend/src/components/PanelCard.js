export default function PanelCard({ children, className = '' }) {
  return (
    <section className={`glass-panel shadow-soft rounded-[30px] ${className}`.trim()}>
      {children}
    </section>
  );
}
