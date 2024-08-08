import styles from '@/styles/Home.module.css';

function Layout({ children }) {
  return (
    <main className={`${styles.main}`}>
      <h1 style={{ fontSize: '50px', marginBottom: '50px' }}>POKE API</h1>
      {children}
    </main>
  );
}

export default Layout;
