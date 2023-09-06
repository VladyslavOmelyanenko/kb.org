import { useEffect } from 'react';
import { useParams } from "react-router-dom";


import { useTranslation } from 'react-i18next';

const Language = () => {
  
  const { i18n } = useTranslation();

  const params = useParams();

  useEffect( () => {

    i18n.changeLanguage(params.language);
  }, [i18n, params.language])
  return params.language;
}

export default Language;