/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import {
  NavLink,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';
import classNames from 'classnames';

import { Loader } from './components/Loader';
import './App.scss';
import { HomePage } from './components/HomePage';
import { PeoplePage } from './components/PeoplePage';
import { NotFoundPage } from './components/NotFoundPage';
import { Person } from './types';
import { getPeople } from './api';
import { PersonLink } from './components/PersonLink';

enum Errors {
  noPeople,
  somethingWentWrong,
  noError,
}

export const App = () => {
  const { pathname } = useLocation();

  const [peoples, setPeoples] = useState<Person[]>([]);
  const [peopleLoading, setPeopleLoading] = useState(false);

  const [error, setError] = useState<Errors>(Errors.noError);

  const [selectedPeople, setSelecetedPeople] = useState('');

  useEffect(() => {
    if (pathname === '/people') {
      setPeopleLoading(true);
      setError(Errors.noError);
      getPeople()
        .then(response => {
          setPeoples(response);
          if (!response.length) {
            setError(Errors.noPeople);
          }

          console.log(response);
        }).catch(() => {
          setError(Errors.somethingWentWrong);
        })
        .finally(() => {
          setPeopleLoading(false);
        });
    }
  }, [pathname]);

  if (pathname === '/home') {
    return <Navigate to="/" replace />;
  }

  // console.log(pathname);

  return (
    <div data-cy="app">
      <nav
        data-cy="nav"
        className="navbar is-fixed-top has-shadow"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <NavLink
              to="/"
              className={({ isActive }) => classNames(
                'navbar-item',
                { 'has-background-grey-lighter': isActive },
              )}
            >
              Home
            </NavLink>

            <NavLink
              to="/people"
              className={({ isActive }) => classNames(
                'navbar-item',
                { 'has-background-grey-lighter': isActive },
              )}
            >
              People
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="section">
        <div className="container">

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/people">
              <Route index element={<PeoplePage />} />
              <Route path=":slug" element={<PersonLink />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          {pathname === '/people' && (
            <div className="block">
              <div className="box table-container">
                {peopleLoading && <Loader />}

                {error === Errors.somethingWentWrong && (
                  <p data-cy="peopleLoadingError" className="has-text-danger">
                    Something went wrong
                  </p>
                )}

                {error === Errors.noPeople && (
                  <p data-cy="noPeopleMessage">
                    There are no people on the server
                  </p>
                )}

                {peoples.length > 0 && !peopleLoading && (
                  <table
                    data-cy="peopleTable"
                    className="table is-striped is-hoverable is-narrow is-fullwidth"
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
                      {peoples.map(people => (
                        <tr
                          data-cy="person"
                          key={people.slug}
                          onClick={() => {
                            setSelecetedPeople(people.slug);
                          }}
                          className={selectedPeople === people.slug ? 'has-background-warning' : ''}
                        >
                          <td>
                            <NavLink
                              to={`people/${people.slug}`}
                            >
                              {people.name}
                            </NavLink>
                          </td>

                          <td>{people.sex}</td>
                          <td>{people.born}</td>
                          <td>{people.died}</td>
                          <td>{people.motherName || '-'}</td>
                          <td>{people.fatherName || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
