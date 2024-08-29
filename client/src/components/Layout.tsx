import Container from 'react-bootstrap/Container';
import { Outlet } from 'react-router-dom';
import React from 'react';
import NavBar from './ui/NavBar';

export default function Layout(): React.JSX.Element {
  return (
    <Container>
      <NavBar />
      <Outlet />
    </Container>
  );
}
