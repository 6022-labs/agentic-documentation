import MDXComponents from "@theme-original/MDXComponents";
import RuntimeTabs, { Runtime } from "@site/src/components/RuntimeTabs";
import Screenshot from "@site/src/components/Screenshot";
import TaskTime from "@site/src/components/TaskTime";
import Video from "@site/src/components/Video";

// Global MDX components, so doc pages use them without imports.
export default {
  ...MDXComponents,
  RuntimeTabs,
  Runtime,
  Screenshot,
  TaskTime,
  Video,
};
