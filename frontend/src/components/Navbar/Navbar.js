  import React, { useState } from 'react';
  import { Link, NavLink, useLocation } from 'react-router-dom'
  import { useTranslation } from "react-i18next";


  import styles from './Navbar.module.scss';


   

const Navbar = () => {

  const [isMenuActive, setIsMenuActive] = useState(false);
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const appLanguages = [
    {
      text: t('eng'),
      link: 'eng',
     }, 
     {
      text: t('ukr'),
      link: 'ukr',
     },
     {
      text: t('de'),
      link: 'de',
    }
  ];


  const clickTheMenu = () => {
    const menu = document.getElementById('menu');
    if (isMenuActive === false) {
      menu.style.display = 'flex';
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
            <li key={lang.text}>
              <NavLink
                to={getMatchingRoute(lang.link)}
                >
                {lang.text}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      
      <ul className={styles.menu} id='menu'>
        <li> <Link to='/'>{t("about")}</Link> </li>
        <li> <Link to='/participants'>{t("participants")}</Link></li>
        <li><Link to='/program'>{t("program")}</Link></li>
        <li><Link to='/locations'>{t("locations")}</Link></li>
      </ul>

    </nav>
  );
}

export default Navbar;