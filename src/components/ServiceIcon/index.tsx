import React, { type ReactNode } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const files = {
  postgres: "postgres.svg",
  vault: "vault.svg",
  ipfs: "ipfs.svg",
  grafana: "grafana.svg",
  caddy: "caddy.svg",
  "agent-node": "agent-node.png",
} as const;

type ServiceIconProps = {
  name: keyof typeof files;
};

// ServiceIcon shows a service's logo inline with text; Shipyard sets the same files as Railway service icons.
export default function ServiceIcon({ name }: ServiceIconProps): ReactNode {
  const src = useBaseUrl(`/img/service-icons/${files[name]}`);
  return <img className={styles.icon} src={src} alt="" aria-hidden="true" />;
}
