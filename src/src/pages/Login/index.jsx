import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import useFirebase from "../../hooks/useFirebase";

const LoginPage = () => {
  const { setUserId } = useContext(UserContext);
  const firebase = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    handleAuth();
  }, []);

  const handleAuth = async () => {
    const userToken = localStorage.getItem("userToken");

    if (!!userToken) navigate("/home");
  };

  const handleLogin = async () => {
    try {
      const auth = await firebase.authentication();

      const user = {
        id: auth.user.uid,
        instituicao: null,
        nome: auth.user.displayName,
        senha: "",
        email: auth.user.email,
        username: auth.user.email,
        papelCurador: false,
        avatar: auth.user.photoURL,
        frequenciaEmail: 0,
        contribuicoesCount: 0,
        curadoriaCount: 0,
        perguntasCount: 0,
      };

      localStorage.setItem("userToken", auth.token);
      localStorage.setItem("userId", auth.user.uid);
      localStorage.setItem("userName", auth.user.displayName);

      const docs = await firebase.find("user", auth.user.uid, "values.id");

      const items = [];

      if (docs) {
        docs.forEach((doc) => {
          items.push(doc.data());
        });
      }

      if (!items.length) {
        firebase.create("user", user).then(() => {
          setUserId(auth.user.uid);
          navigate("/home");
        }).catch((e) => {});
      } else {
        setUserId(auth.user.uid);
        navigate("/home");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <a onClick={handleLogin} className="btn btn-primary">
        Acessar com o Google
      </a>
    </div>
  );
};

export default LoginPage;
