import Image from 'next/image'
import NavBar from './components/navbar'
import HomeScreen from './home'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div style={{maxHeight:'10vh', height:'10vh'}}>
        <NavBar/>
      </div>
      <div style={{maxHeight:'90vh', height:'90vh'}}>
        <HomeScreen/>
      </div>
    </main>
  )
}
