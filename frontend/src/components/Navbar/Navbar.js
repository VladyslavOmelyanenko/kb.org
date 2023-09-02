  import React, { useState } from 'react';
  import { Link, NavLink, useLocation } from 'react-router-dom'
  import { useTranslation } from "react-i18next";


  import styles from './Navbar.module.scss';


   

const Navbar = () => {

  const [isMenuActive, setIsMenuActive] = useState(false);
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const appLanguages = ['eng', 'ukr', 'de'];


  const clickTheMenu = () => {
    const menu = document.getElementById('menu');
    if (isMenuActive === false) {
      menu.style.display = 'block';
      setIsMenuActive(true);
    } else {
      menu.style.display = 'none';
      setIsMenuActive(false);
    }
  }

  const getMatchingRoute = (language) => {
    const numberOfDashes = pathname.split('/').length - 1;
    let pathWithoutLanguage;
    if (numberOfDashes >= 2) {
      pathWithoutLanguage = pathname.slice(pathname.indexOf('/', 1));
    } else {
      pathWithoutLanguage = '';
    }
    return language + pathWithoutLanguage;
  }

  return (
    <nav className={styles.navbar}>

      <div className={styles.navbarRow}>
        <div className={styles.menuButton}>
          <button onClick={clickTheMenu}>{t("menu")}</button>
        </div>

        <ul className={styles.languagesButtons}>
          {appLanguages.map(lang => (
            <li key={lang}>
              <NavLink
                to={getMatchingRoute(lang)}
                >
                {lang}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      
      <ul className={styles.menu} id='menu'>
        <li> <Link to='/'>About</Link> </li>
        <li> <Link to='/participants'>Participants</Link></li>
        <li><Link to='/program'>Program</Link></li>
        <li><Link to='/locations'>Locations</Link></li>
      </ul>

    </nav>
  );
}

export default Navbar;