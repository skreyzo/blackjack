import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from '../ui/Card';

export default function MainPage(): React.JSX.Element {
  return (
    <Row className="mt-4">
      <Col>
        <Card />
      </Col>
    </Row>
  );
}
