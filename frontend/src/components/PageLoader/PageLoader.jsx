import styles from './PageLoader.module.css';

function PageLoader() {
  return (
    <div className={styles.loader}>
      <div className={styles.loaderContent}>
        <div className={styles.spinner} />

        <div className={styles.brand}>
          VELOOP
        </div>
      </div>
    </div>
  );
}

export default PageLoader;