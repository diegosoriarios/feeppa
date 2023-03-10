import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import UserContext from '../../context/UserContext';
import useFirebase from '../../hooks/useFirebase';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const { userId } = useContext(UserContext);
  const firebase = useFirebase();

  const badges = [
    {id: 1, image: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp", description: "Usuário platina"},
    {id: 2, image: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp", description: "Usuário ouro"},
    {id: 3, image: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp", description: "Usuário prata"},
    {id: 4, image: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp", description: "Usuário bronze"},
    {id: 5, image: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp", description: "Usuário Explorador"},
    {id: 6, image: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp", description: "Curador platina"},
    {id: 7, image: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp", description: "Curador ouro"},
    {id: 8, image: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp", description: "Curador prata"},
    {id: 9, image: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp", description: "Curador Bronze"},
    {id: 10, image: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp", description: "Curador Iniciante"},
  ];

  const getUser =async () => {
    console.log(userId);
    const docs = await firebase.findById('user', auth.user.email, 'values.email');
    
    docs.forEach((doc) => {
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
                  <img referrerpolicy="no-referrer" src={user.avatar} className="rounded-circle img-fluid" style={{width: '100px'}} />
                </div>
                <h4 className="mb-2">{user.nome}</h4>
                <p className="text-muted mb-4">{user.descricao}</p>
                <div className="container mt-8">
                  <div className="row">
                    {
                      badges.map(badge => (
                        <div className="col-md-4">
                          <img style={{ width: 100 }} src={badge.image} alt={badge.description} />
                          <p>{badge.description}</p>
                        </div>  
                      ))
                    }
                  </div>
                </div>
                <div className="d-flex justify-content-between text-center mt-5 mb-2">
                  <div>
                    <p className="mb-2 h5">{user.contributions || 0}</p>
                    <p className="text-muted mb-0">Contribuições</p>
                  </div>
                  <div className="px-3">
                    <p className="mb-2 h5">{user.moderation || 0}</p>
                    <p className="text-muted mb-0">Curadoria</p>
                  </div>
                  <div>
                    <p className="mb-2 h5">{user.questions || 0}</p>
                    <p className="text-muted mb-0">Perguntas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
