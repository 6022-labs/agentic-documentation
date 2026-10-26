import React, { type ReactNode, useEffect, useRef, useState } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useIsBrowser from "@docusaurus/useIsBrowser";
import styles from "./styles.module.css";

// Renders in static/video: <name>.mp4 plus <name>.jpg as poster, and <name>.vtt subtitles when narrated.
type VideoName = "protocol-flow" | "x402-exchange" | "agent-node-console" | "team-slack" | "team-microsoft-teams";

// Videos with a voice track; the others are silent, so they stay muted.
const NARRATED: ReadonlySet<VideoName> = new Set(["protocol-flow"]);

type VideoProps = {
  name: VideoName;
  caption: string;
};

// Video embeds a Remotion render from static/video behind its clickable poster; sources live in /videos.
export default function Video({ name, caption }: VideoProps): ReactNode {
  const src = useBaseUrl(`/video/${name}.mp4`);
  const poster = useBaseUrl(`/video/${name}.jpg`);
  const subtitles = useBaseUrl(`/video/${name}.vtt`);
  const narrated = NARRATED.has(name);
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const isBrowser = useIsBrowser();
  // Without JS the poster button can't work, so the native controls stay on.
  const showControls = started || !isBrowser;

  // A play started through the native controls before hydration fires no onPlay.
  useEffect(() => {
    if (ref.current && !ref.current.paused) setStarted(true);
  }, []);

  // The poster button unmounts on start, so focus moves to the video once it has its controls.
  useEffect(() => {
    if (started && document.activeElement === document.body) ref.current?.focus();
  }, [started]);

  const start = () => {
    setStarted(true);
    void ref.current?.play();
  };

  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        <video
          ref={ref}
          className={styles.video}
          controls={showControls}
          muted={!narrated}
          playsInline
          preload="none"
          poster={poster}
          onPlay={() => setStarted(true)}>
          <source src={src} type="video/mp4" />
          {narrated ? <track kind="captions" src={subtitles} srcLang="en" label="English" /> : null}
          {caption}
        </video>
        {!showControls && (
          <button type="button" className={styles.play} onClick={start} aria-label={`Play: ${caption}`} />
        )}
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
