import Link from "next/link";
import styles from "./site-header.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>Blomst</span>
          <span className={styles.brandText}>Atelier</span>
        </Link>
        <nav className={styles.nav} aria-label="Primær navigation">
          <Link href="/byg-buket" className={styles.navCta}>
            Byg din egen buket
          </Link>
        </nav>
      </div>
    </header>
  );
}
