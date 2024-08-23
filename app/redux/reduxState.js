import { useSelector } from 'react-redux';

export const useToken = () => {
  const token = useSelector((state) => state.init?.Auth_jwt);
  return token;
};
