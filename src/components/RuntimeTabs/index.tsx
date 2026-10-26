import React, { type ReactElement, type ReactNode } from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Admonition from "@theme/Admonition";
import Link from "@docusaurus/Link";
import { RUNTIMES, type RuntimeInfo } from "./runtimes";
import styles from "./styles.module.css";

const SKILLS_URL = "https://github.com/6022-labs/agentic-skills/tree/main/skills";

// Block shared by the tabs of every runtime that joins through the skills.
const SKILLS_VALUE = "skills";

const BLOCK_VALUES = [...RUNTIMES.filter((runtime) => runtime.status === "available").map((runtime) => runtime.value), SKILLS_VALUE];

type RuntimeProps = { value: string; children: ReactNode };

// Runtime marks one block of <RuntimeTabs>: an available runtime's own content, or the shared "skills" one.
export function Runtime({ children }: RuntimeProps): ReactNode {
  return <>{children}</>;
}

type RuntimeTabsProps = {
  children?: ReactNode;
  // Skills from 6022-labs/agentic-skills that cover this step, linked in the skills tabs.
  skills?: string[];
};

function SkillLinks({ skills }: { skills: string[] }): ReactNode {
  return (
    <>
      {skills.map((skill, i) => (
        <React.Fragment key={skill}>
          {i > 0 && (i === skills.length - 1 ? " and " : ", ")}
          <Link to={`${SKILLS_URL}/${skill}`}>
            <code>{skill}</code>
          </Link>
        </React.Fragment>
      ))}
    </>
  );
}

function ViaSkills({ runtime, skills, content }: { runtime: RuntimeInfo; skills?: string[]; content: ReactNode }): ReactNode {
  return (
    <>
      <Admonition type="info" title={`${runtime.label}: through the agent skills`}>
        <p>
          {runtime.value === "other" ? "Any agent that loads skills" : "No native integration yet: it"} does this with the{" "}
          <Link to="/docs/runtimes/skills">6022 agent skills</Link>
          {skills && skills.length > 0 && (
            <>
              {" "}
              (<SkillLinks skills={skills} />)
            </>
          )}
          . <Link to={runtime.docPath}>Setup and status</Link>
        </p>
      </Admonition>
      {content}
    </>
  );
}

// RuntimeTabs shows one tab per runtime; the choice is shared site-wide and kept in ?runtime=.
export default function RuntimeTabs({ children, skills }: RuntimeTabsProps): ReactNode {
  const provided = new Map<string, ReactNode>();
  React.Children.forEach(children, (child) => {
    if (child === null || child === undefined || (typeof child === "string" && child.trim() === "")) return;
    const element = child as ReactElement<RuntimeProps>;
    const value = element?.type === Runtime ? element.props.value : undefined;
    if (!value || !BLOCK_VALUES.includes(value)) {
      throw new Error(
        `<RuntimeTabs>: unexpected ${value ? `<Runtime value="${value}">` : "child that is not a <Runtime>"}` +
          ` (allowed: ${BLOCK_VALUES.join(", ")}). Put each <Runtime> on its own lines, with blank lines around its content.`,
      );
    }
    provided.set(value, element.props.children);
  });
  for (const value of BLOCK_VALUES) {
    if (!provided.has(value)) throw new Error(`<RuntimeTabs>: missing <Runtime value="${value}">.`);
  }

  return (
    <Tabs groupId="runtime" queryString className={styles.tabs}>
      {RUNTIMES.map((runtime) => (
        <TabItem
          key={runtime.value}
          value={runtime.value}
          label={runtime.label}
          attributes={runtime.status === "skills" ? { className: styles.viaSkills } : undefined}>
          <div className={styles.panel}>
            {runtime.status === "available" ? (
              provided.get(runtime.value)
            ) : (
              <ViaSkills runtime={runtime} skills={skills} content={provided.get(SKILLS_VALUE)} />
            )}
          </div>
        </TabItem>
      ))}
    </Tabs>
  );
}
