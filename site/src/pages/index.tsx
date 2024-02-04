import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import clsx from "clsx";

import styles from "./index.module.css";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} music theory library`}
      description="Tonal music theory library"
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <img src="tonal-tw.png" alt="Tonal" />
        </div>
      </header>
      <main></main>
    </Layout>
  );
}
