import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function NavBar(): React.JSX.Element {
  return (
    <Navbar bg="success" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/rules">Rules</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Play Blackjack</Nav.Link>

        </Nav>
      </Container>
    </Navbar>
  );
}
