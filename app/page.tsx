export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'var(--font-figtree), sans-serif'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        🚧 We are under construction 🚧
      </h1>
      <p style={{
        fontSize: '1.5rem',
        color: '#666',
        textAlign: 'center'
      }}>
        사이트 점검 중입니다
      </p>
    </div>
  )
}