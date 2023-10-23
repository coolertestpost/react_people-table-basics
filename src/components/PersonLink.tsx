/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPeople } from '../api';
import { Person } from '../types';
import { Loader } from './Loader';

export const PersonLink: React.FC = () => {
  const { slug } = useParams();

  const [person, setPerson] = useState<Person>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPeople()
      .then((res) => {
        setPerson(res.find(personFromServer => personFromServer.slug === slug));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  return (
    <>
      {loading && <Loader />}
      <h1 className="title">{person?.name}</h1>
      <div className="container">
        <table
          data-cy="personTable"
          className="table is-striped is-narrow is-fullwidth"
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Sex</th>
              <th>Born</th>
              <th>Died</th>
              <th>Mother</th>
              <th>Father</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{person?.name}</td>
              <td>{person?.sex}</td>
              <td>{person?.born}</td>
              <td>{person?.died}</td>
              <td>{person?.motherName || '-'}</td>
              <td>{person?.fatherName || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
