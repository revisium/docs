import type { ReactNode } from "react";
import styles from "./styles.module.css";

interface ScreenshotProps {
  alt: string;
  src?: string;
}

interface ScreenshotRowProps {
  children: ReactNode;
}

export function ScreenshotRow({ children }: Readonly<ScreenshotRowProps>): ReactNode {
  return <div className={styles.row}>{children}</div>;
}

export default function Screenshot({ alt, src }: Readonly<ScreenshotProps>): ReactNode {
  if (src) {
    return (
      <figure className={styles.figure}>
        <img src={src} alt={alt} className={styles.image} loading="lazy" />
        <figcaption className={styles.caption}>{alt}</figcaption>
      </figure>
    );
  }

  return (
    <figure className={styles.figure}>
      <div className={styles.placeholder}>
        <div className={styles.placeholderIcon}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <span className={styles.placeholderText}>{alt}</span>
      </div>
      <figcaption className={styles.caption}>{alt}</figcaption>
    </figure>
  );
}
