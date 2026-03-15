import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'JSON Schema + Foreign Keys',
    description: (
      <>
        Any structure with referential integrity. Validation on write, cascade rename,
        computed fields, file attachments. Design schemas visually or via API.
      </>
    ),
  },
  {
    title: 'Git-Like Versioning',
    description: (
      <>
        Branches, revisions, drafts. Full history, diff, rollback.
        Draft → review → commit workflow. Schema evolution with automatic data transforms.
      </>
    ),
  },
  {
    title: 'Auto-Generated APIs',
    description: (
      <>
        Typed GraphQL + REST APIs generated from your schema. Filtering, sorting, pagination,
        FK resolution. MCP Protocol for AI agents. Admin UI included.
      </>
    ),
  },
];

function Feature({title, description}: Readonly<FeatureItem>) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
