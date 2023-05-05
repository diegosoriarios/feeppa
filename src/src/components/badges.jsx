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

const Badges = ({ contribuicoes = 0, curadoria = 0, perguntas = 0 }) => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const userBadges = [];

    if (contribuicoes > 10) {
      userBadges.push({
        image: usuarioExplorador,
        description: "Usuário Explorador",
      });
    }
    if (contribuicoes > 25) {
      userBadges.push({
        image: usuarioBronze,
        description: "Usuário Bronze",
      });
    }
    if (contribuicoes > 50) {
      userBadges.push({
        image: usuarioPrata,
        description: "Usuário Prata",
      });
    }
    if (contribuicoes > 75) {
      userBadges.push({
        image: usuarioOuro,
        description: "Usuário Ouro",
      });
    }
    if (contribuicoes > 100) {
      userBadges.push({
        image: usuarioPlatina,
        description: "Usuário Platina",
      });
    }

    if (curadoria > 10) {
      userBadges.push({
        image: curadorExplorador,
        description: "Curador Explorador",
      });
    }
    if (curadoria > 25) {
      userBadges.push({
        image: curadorBronze,
        description: "Curador Bronze",
      });
    }
    if (curadoria > 50) {
      userBadges.push({
        image: curadorPrata,
        description: "Curador Prata",
      });
    }
    if (curadoria > 75) {
      userBadges.push({
        image: curadorOuro,
        description: "Curador Ouro",
      });
    }
    if (curadoria > 100) {
      userBadges.push({
        image: curadorPlatina,
        description: "Curador Platina",
      });
    }

    setBadges(userBadges);
  }, [contribuicoes, curadoria]);

  return (
    <>
      <div className="container mt-8">
        <div className="row">
          {badges.map((badge, index) => (
            <div key={index} className="col-md-4">
              <img
                style={{ width: 100 }}
                src={badge.image}
                alt={badge.description}
              />
              <p>{badge.description}</p>
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
    </>
  );
};

export default Badges;
