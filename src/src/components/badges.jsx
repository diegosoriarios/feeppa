import React, { useEffect, useState } from "react";
import curadorBronze from "../assets/curador_bronze.png";
import curadorExplorador from "../assets/curador_explorador.png";
import curadorOuro from "../assets/curador_ouro.png";
import curadorPlatina from "../assets/curador_platina.png";
import curadorPrata from "../assets/curador_prata.png";
import usuarioBronze from "../assets/usuario_bronze.png";
import usuarioExplorador from "../assets/usuario_explorador.png";
import usuarioOuro from "../assets/usuario_ouro.png";
import usuarioPlatina from "../assets/usuario_platina.png";
import usuarioPrata from "../assets/usuario_prata.png";

const Badges = ({
  contribuicoes = 0,
  curadoria = 0,
  perguntas = 0,
  ranking,
}) => {
  const [contribuitionsBadges, setContribuitionsBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);

  useEffect(() => {
    const newUserBadges = [];
    const newContribuitionsBadges = [];

    newContribuitionsBadges.push({
      image: usuarioExplorador,
      description: "Usuário Explorador",
      enabled: contribuicoes > 10,
    });
    newContribuitionsBadges.push({
      image: usuarioBronze,
      description: "Usuário Bronze",
      enabled: contribuicoes > 25,
    });

    newContribuitionsBadges.push({
      image: usuarioPrata,
      description: "Usuário Prata",
      enabled: contribuicoes > 50,
    });

    newContribuitionsBadges.push({
      image: usuarioOuro,
      description: "Usuário Ouro",
      enabled: contribuicoes > 75,
    });

    newContribuitionsBadges.push({
      image: usuarioPlatina,
      description: "Usuário Platina",
      enabled: contribuicoes > 100,
    });

    newUserBadges.push({
      image: curadorExplorador,
      description: "Curador Explorador",
      enabled: curadoria > 10,
    });

    newUserBadges.push({
      image: curadorBronze,
      description: "Curador Bronze",
      enabled: curadoria > 25,
    });

    newUserBadges.push({
      image: curadorPrata,
      description: "Curador Prata",
      enabled: curadoria > 50,
    });

    newUserBadges.push({
      image: curadorOuro,
      description: "Curador Ouro",
      enabled: curadoria > 75,
    });

    newUserBadges.push({
      image: curadorPlatina,
      description: "Curador Platina",
      enabled: curadoria > 100,
    });

    setContribuitionsBadges(newContribuitionsBadges);
    setUserBadges(newUserBadges);
  }, [contribuicoes, curadoria]);

  return (
    <>
      <div className="container mt-8">
        <div className="row justify-content-center">
          {userBadges.map((badge, index) => (
            <div key={index} className="col-md-2">
              <img
                style={
                  badge.enabled ? { width: 75 } : { width: 75, opacity: 0.5 }
                }
                src={badge.image}
                alt={badge.description}
              />
              <p style={badge.enabled ? { color: "black" } : { color: "grey" }}>
                {badge.description}
              </p>
            </div>
          ))}
        </div>
        <div className="row justify-content-center">
          {contribuitionsBadges.map((badge, index) => (
            <div key={index} className="col-md-2">
              <img
                style={
                  badge.enabled ? { width: 75 } : { width: 75, opacity: 0.5 }
                }
                src={badge.image}
                alt={badge.description}
              />
              <p style={badge.enabled ? { color: "black" } : { color: "grey" }}>
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex justify-content-between text-center mt-5 mb-2">
        <div>
          <p className="mb-2 h5">{contribuicoes}</p>
          <p className="text-muted mb-0">Contribuições</p>
        </div>
        <div className="px-3">
          <p className="mb-2 h5">{curadoria}</p>
          <p className="text-muted mb-0">Curadoria</p>
        </div>
        <div>
          <p className="mb-2 h5">{perguntas}</p>
          <p className="text-muted mb-0">Perguntas</p>
        </div>
      </div>
      <div className="mt-4">
        <h5 className="text-start">Você está em:</h5>
        <div className="d-flex justify-content-between text-center mt-3 mb-2">
          <div>
            <p className="mb-2 h5">{ranking.contribuicoes}˚ lugar</p>
          </div>
          <div className="px-3">
            <p className="mb-2 h5">{ranking.curadoria}˚ lugar</p>
          </div>
          <div>
            <p className="mb-2 h5">{ranking.perguntas}˚ lugar</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Badges;
