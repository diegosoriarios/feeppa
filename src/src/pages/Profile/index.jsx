import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import useFirebase from "../../hooks/useFirebase";
import Badges from "../../components/badges";
import Loading from "../../components/loading";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [ranking, setRanking] = useState({
    contribuicoes: 0,
    curadoria: 0,
    perguntas: 0,
  });
  const firebase = useFirebase();

  const getUser = async () => {
    const userId = localStorage.getItem("userId");
    const docs = await firebase.read("user");
    const items = [];

    docs?.forEach((doc) => {
      items.push(doc.data().values);
      if (doc.data().values.id === userId) {
        setUser(doc.data().values);
      }
    });
    getRanking(items, userId);
    setIsLoading(false);
  };

  const getRanking = (allUsers, userId) => {
    allUsers.sort((a, b) => {
      return b.contribuicoesCount - a.contribuicoesCount;
    });
    const contribuitionRanking = allUsers.findIndex(
      (item) => item.id === userId
    );

    allUsers.sort((a, b) => {
      return b.curadoriaCount - a.curadoriaCount;
    });
    const curadoriaRanking = allUsers.findIndex((item) => item.id === userId);

    allUsers.sort((a, b) => {
      return b.perguntasCount - a.perguntasCount;
    });
    const perguntasRanking = allUsers.findIndex((item) => item.id === userId);

    setRanking({
      contribuicoes: contribuitionRanking + 1,
      curadoria: curadoriaRanking + 1,
      perguntas: perguntasRanking + 1,
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  if (isLoading) return <Loading />

  return (
    <section>
      <Navbar />
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-12 col-xl-8">
            <div className="card bg-light" style={{ borderRadius: "15px" }}>
              <div className="card-body text-center">
                <div className="mt-3 mb-4">
                  <img
                    referrerPolicy="no-referrer"
                    src={user.avatar}
                    className="rounded-circle img-fluid"
                    style={{ width: "100px" }}
                  />
                </div>
                <h4 className="mb-2">{user.nome}</h4>
                <p className="text-muted mb-4">{user.descricao}</p>
                <Badges
                  contribuicoes={user.contribuicoesCount}
                  curadoria={user.curadoriaCount}
                  perguntas={user.perguntasCount}
                  ranking={ranking}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
