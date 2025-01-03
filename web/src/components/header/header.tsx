import { Flex } from '@mantine/core';
import { JSX } from 'react';
import { Link } from 'react-router';

import style from './header.module.css';
import { UploadForm } from './upload-form';
import { RoutePath } from '../../routes';

export function Header(): JSX.Element {
  return (
    <header className={style.Header}>
      <Flex justify="space-between" align="center" h="100%">
        <Flex gap={16} align="center" h="100%">
          <Link to={RoutePath.HOME} className={style.Logo}>
            <strong>KoBuddy</strong>
          </Link>
          <Flex h="100%">
            <Link to={RoutePath.BOOKS} className={style.Link}>
              Books
            </Link>
            <Link to={RoutePath.CALENDAR} className={style.Link}>
              Calendar
            </Link>
          </Flex>
        </Flex>
        <UploadForm />
      </Flex>
    </header>
  );
}
