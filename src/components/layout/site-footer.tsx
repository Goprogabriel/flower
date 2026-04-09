import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>Byg en enkel buket med blomster, bund og en lille hilsen til en, du holder af.</p>
      </div>
    </footer>
  );
}
