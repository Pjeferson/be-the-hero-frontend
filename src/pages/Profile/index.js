import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { FiPower, FiTrash2 } from 'react-icons/fi';

import './styles.css'

import logoImg from '../../assets/logo.svg'

import api from '../../services/api'


export default function Profile() {
  const [incidents, setIncidents] = useState([])
  const ongName = localStorage.getItem('ongName')

  const history = useHistory();

  useEffect(() => {
    async function loadIncidents() {
      try {
        const response = await api.get('/profile', {
          headers: {
            Authorization: localStorage.getItem('ongId')
          }
        });
        setIncidents(response.data)
      } catch (error) {
      }
    }
    loadIncidents();
  }, [])

  async function handleDeleteIncident(id) {
    try {
      await api.delete(`/incidents/${id}`, {
        headers: {
          Authorization: localStorage.getItem('ongId')
        }
      });
      setIncidents(incidents.filter(incident => incident.id !== id))
    } catch (error) {
      alert('Erro ao deletar caso. Tente novamente.')
    }
  }

  function handleLogout() {
    localStorage.clear();
    history.push('/');
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be The Hero" />
        <span>Bem vinda, {ongName}</span>

        <Link to="/incident/new" className="button">Cadastrar novo caso</Link>
        <button type="button" onClick={handleLogout}>
          <FiPower size={16} color="#e02041"></FiPower>
        </button>
      </header>

      <h1>Casos cadastrados</h1>

      <ul>
        {incidents.map(incident => (
          <li key={incident.id}>
            <strong>CASO:</strong>
            <p>{incident.title}</p>

            <strong>DESCRIÇÃO:</strong>
            <p>{incident.description}</p>

            <strong>VALOR:</strong>
            <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value)}</p>

            <button type="button" onClick={() => handleDeleteIncident(incident.id)}>
              <FiTrash2 size={16} color="#a8a8b3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
