import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MdKeyboardArrowLeft, MdDone } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { parseISO } from 'date-fns';

import DatePicker from 'react-datepicker';
import pt from 'date-fns/locale/pt';

import SelectStudent from 'react-select/async';

import { Header, Wrapper } from './styles';
import { Container, Title } from '~/styles/sharedStyles';

import {
  registrationUpdateRequest,
  registrationCreateRequest,
} from '~/store/modules/registration/actions';

import history from '~/services/history';
import api from '~/services/api';

import toast from '~/util/toastStyle';
import { priceFormatter, dateFormFormat } from '~/util/formater';

export default function RegistrationForm({ match }) {
  const [oneRegistration, setOneRegistration] = useState({});
  const [allPlans, setAllPlans] = useState([]);

  const dispatch = useDispatch();

  const isEditPage = history.location.pathname.match(/edit_registration/g);
  const { reg_id } = match.params;

  const handleSubmit = ({ plan_id }) => {
    const {
      start_date,
      Student: { id: student_id },
    } = oneRegistration;

    if (isEditPage) {
      dispatch(
        registrationUpdateRequest(plan_id, start_date, student_id, reg_id)
      );
    } else {
      dispatch(registrationCreateRequest(student_id, plan_id, start_date));
    }
  };

  const handleDateChange = date => {
    setOneRegistration({
      ...oneRegistration,
      start_date: date,
    });
  };

  useEffect(() => {
    async function getOneRegistration() {
      if (isEditPage && reg_id) {
        try {
          const response = await api.get(`/registrations/${reg_id}`);

          const {
            Plan,
            Student,
            id,
            active,
            price,
            end_date,
            start_date,
          } = response.data;

          const priceFormatted = priceFormatter(price);
          const list_end_date_formatted = dateFormFormat(end_date);
          const start_date_formatted = dateFormFormat(start_date);

          const data = {
            active,
            id,
            Student,
            start_date: parseISO(start_date),
            Plan,
            priceFormatted,
            list_end_date_formatted,
            start_date_formatted,
          };

          setOneRegistration(data);
        } catch (err) {
          toast(
            'Falha ao tentar buscar a matrícula',
            '#e54b64',
            '#fff',
            '#fff'
          );
        }
      }
    }

    async function getPlans() {
      try {
        const response = await api.get('plans');

        setAllPlans(response.data);
      } catch (err) {
        toast('Falha ao tentar buscar os planos', '#e54b64', '#fff', '#fff');
      }
    }
    getPlans();
    getOneRegistration();
  }, []); // eslint-disable-line

  const handleLoadStudents = async () => {
    const response = await api.get('/students');

    const data = response.data.map(student => ({
      id: student.id,
      label: student.name,
      value: student.email,
    }));

    return data;
  };

  return (
    <Container>
      <Header>
        <Title>{isEditPage ? 'Edição' : 'Cadastro'} de matrícula</Title>
        <div>
          <button type="button" onClick={() => history.goBack()}>
            <MdKeyboardArrowLeft size={22} color="#fff" />
            Voltar
          </button>
          <button type="submit" form="create_register">
            <MdDone size={22} color="#fff" />
            Salvar
          </button>
        </div>
      </Header>
      <Wrapper>
        <form id="create_register" onSubmit={handleSubmit}>
          <div className="fully">
            <label htmlFor="student">Aluno</label>
            <SelectStudent
              id="student"
              loadOptions={handleLoadStudents}
              cacheOptions
              defaultOptions
              onChange={data =>
                setOneRegistration({
                  ...oneRegistration,
                  Student: {
                    name: data.label,
                    id: data.id,
                  },
                })
              }
              placeholder="Buscar aluno"
            />
          </div>
          <div className="one_four">
            <label htmlFor="plan">Plano</label>
            <select
              id="plan"
              type="text"
              name="plan_id"
              placeholder="Selecione o plano"
              options={allPlans}
            />
          </div>
          <div className="one_four">
            <label htmlFor="initial_date">Data de início</label>
            <DatePicker
              id="initial_date"
              selected={(oneRegistration && oneRegistration.start_date) || ''}
              onChange={handleDateChange}
              locale={pt}
              todayButton="Hoje"
              minDate={new Date()}
              showDisabledMonthNavigation
              placeholderText="Escolha a data"
              dateFormat="dd'/'MM'/'yyyy"
            />
          </div>
          <div className="one_four">
            <label htmlFor="end_date">Data de término</label>
            <input
              id="end_date"
              type="text"
              name="plan_end_date"
              value={
                (oneRegistration && oneRegistration.form_end_date_formatted) ||
                ''
              }
              disabled
            />
          </div>
          <div className="one_four">
            <label htmlFor="final_value">Valor final</label>
            <input
              id="final_value"
              type="text"
              name="plan_value"
              value={(oneRegistration && oneRegistration.priceFormatted) || ''}
              disabled
            />
          </div>
        </form>
      </Wrapper>
    </Container>
  );
}

RegistrationForm.propTypes = {
  match: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
