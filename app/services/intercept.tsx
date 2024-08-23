import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Para React Router v6
import api from "./api-service";

const AxiosContext = createContext();

export const useAxios = () => {
  return useContext(AxiosContext);
};

export const AxiosProvider = ({ children, token }) => {
  const navigate = useNavigate(); // useNavigate para redirecionar no React Router v6

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${(token.getState()?.init?.user?.Auth_jwt)}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          // Redirecionar para a página de login ou qualquer outra ação de sua escolha
          navigate("/auth");
        }
        return Promise.reject(error);
      }
    );

    // Limpando os interceptors quando o componente for desmontado
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [token, navigate]);

  return (
    <AxiosContext.Provider value={api}>
      {children}
    </AxiosContext.Provider>
  );
};
