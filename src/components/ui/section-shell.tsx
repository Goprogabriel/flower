type SectionShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  id?: string;
  contained?: boolean;
  children: React.ReactNode;
};

export function SectionShell({
  eyebrow,
  title,
  intro,
  id,
  contained = true,
  children
}: SectionShellProps) {
  const content = (
    <>
      <div className="section-heading">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>
      {children}
    </>
  );

  return (
    <section className="section" id={id}>
      {contained ? <div className="container">{content}</div> : content}
    </section>
  );
}
