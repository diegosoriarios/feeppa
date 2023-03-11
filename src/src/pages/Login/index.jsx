import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import useFirebase from "../../hooks/useFirebase";

const LoginPage = () => {
  const { setUserId } = useContext(UserContext);
  const firebase = useFirebase();
  const navigate = useNavigate();

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
      }
      
      localStorage.setItem("userToken", auth.token);
      localStorage.setItem("userId", auth.user.uid);

      const docs = await firebase.find('user', auth.user.email, 'values.email');
      
      const items = [];

      docs.forEach((doc) => {
        items.push(doc.data())
      });

      if (!items.length) firebase.create('user', user);
      setUserId(auth.user.uid);
      navigate("/home");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <a onClick={handleLogin} className="btn btn-primary">Login with google</a>
  );
};

export default LoginPage;
