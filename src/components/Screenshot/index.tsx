import React, { type ReactNode } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ThemedImage from "@theme/ThemedImage";
import styles from "./styles.module.css";

type ScreenshotProps = {
  name: string;
  alt: string;
};

// Screenshot shows static/img/agent/<name>-light.png or -dark.png, matching the site theme.
export default function Screenshot({ name, alt }: ScreenshotProps): ReactNode {
  const light = useBaseUrl(`/img/agent/${name}-light.png`);
  const dark = useBaseUrl(`/img/agent/${name}-dark.png`);

  return (
    <figure className={styles.figure}>
      <ThemedImage className={styles.image} alt={alt} sources={{ light, dark }} />
    </figure>
  );
}
