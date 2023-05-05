import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import UserContext from '../../context/UserContext';
import useFirebase from '../../hooks/useFirebase';
import Badges from '../../components/badges';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const firebase = useFirebase();

  const getUser =async () => {
    const userId = localStorage.getItem("userId");
    const docs = await firebase.find('user', userId, 'values.id');
    
    docs?.forEach((doc) => {
      setUser(doc.data().values)
    });
  }

  useEffect(() => {
    getUser();
  }, []);
  
  return (
    <section style={{backgroundColor: '#eee'}}>
      <Navbar />
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-12 col-xl-4">
            <div className="card" style={{borderRadius: '15px'}}>
              <div className="card-body text-center">
                <div className="mt-3 mb-4">
                  <img referrerPolicy="no-referrer" src={user.avatar} className="rounded-circle img-fluid" style={{width: '100px'}} />
                </div>
                <h4 className="mb-2">{user.nome}</h4>
                <p className="text-muted mb-4">{user.descricao}</p>
                <Badges
                  contribuicoes={user.contribuicoesCount}
                  curadoria={user.curadoriaCount}
                  perguntas={user.perguntasCount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
