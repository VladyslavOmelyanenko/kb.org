import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectToEn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/eng');
  }, [navigate]);

  return null;
};

export default RedirectToEn;