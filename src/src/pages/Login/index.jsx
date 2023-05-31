import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFirebase from "../../hooks/useFirebase";
import { useDispatch } from "react-redux";
import { saveUser } from "../../slice/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch()

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
          dispatch(saveUser(user));
          navigate("/home");
        }).catch((e) => {});
      } else {
        dispatch(saveUser(items[0].values));
        navigate("/home");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-around align-items-center" style={{ height: "100vh" }}>
      <div className="d-flex flex-column justify-content-around align-items-center">
      <h2 className="m-5 text-center">Recursos de ajuda para linguagens de programação visual baseadas em blocos</h2>
      <p>Utilize o botão a seguir para acessar o ambiente</p>
      <Link onClick={handleLogin} className="btn btn-primary">
        Acessar com o Google
      </Link>
      </div>
      <div></div>
    </div>
  );
};

export default LoginPage;
