import Link from "next/link";
import styles from "./button-link.module.css";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "default" | "large";
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "default"
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`${styles.button} ${variant === "secondary" ? styles.secondary : styles.primary} ${size === "large" ? styles.large : ""}`}
    >
      {children}
    </Link>
  );
}
