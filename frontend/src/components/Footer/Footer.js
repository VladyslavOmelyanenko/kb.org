import styles from './Footer.module.scss'

const Footer = () => {
  return (
    <ul className={styles.footer}>
      <li><a href="https://www.instagram.com/kyivbiennial/">inst</a></li>
      <li><a href="https://www.facebook.com/kyivbiennial">fb</a></li>
      <li><a href="mailto:google@gmail.com">newsletter</a></li>
    </ul>
  )
}

export default Footer;