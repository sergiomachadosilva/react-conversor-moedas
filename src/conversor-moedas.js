import React, { useState } from 'react';
import './conversor-moedas.css';
import {
  Jumbotron,
  Button,
  Form,
  Col,
  Container,
  Spinner,
  Alert,
  Modal
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import ListarMoedas from './listar-moedas'
import axios from 'axios'

function ConversorMoedas() {

  const FIXER_URL = 'http://data.fixer.io/api/latest?access_key=eba7130a5b2d720ce43eb5fcddd47cc3';

  const [valor, setValor] = useState(1);
  const [moedaDe, setMoedaDe] = useState('BRL');
  const [moedaPara, setMoedaPara] = useState('USD');
  const [exibirSpinner, setExibirSpinner] = useState(false);
  const [exibirModal, setExibirModal] = useState(false)
  const [formValidado, setFormValidado] = useState(false)
  const [resultadoConversao, setResultadoConversao] = useState('')
  const [exibirMsgErro, setExibirMsgErro] = useState(false)

  function handleValor(event) {
    setValor(event.target.value.replace(/\D/g, ''));
  }

  function handleMoedaDe(event) {
    setMoedaDe(event.target.value)
  }

  function handleMoedaPara(event) {
    setMoedaPara(event.target.value)
  }

  function handleFecharModal(event) {
    // Fecha o modal e restaura o formulário
    setValor(1)
    setMoedaDe('BRL')
    setMoedaPara('USD')
    setFormValidado(false)
    setExibirModal(false)

  }

  function converter(event) {
    event.preventDefault()

    if (event.currentTarget.checkValidity() === true) {
      setExibirSpinner(true)
      axios.get(FIXER_URL)
        .then(res => {
          const cotacao = obterCotacao(res.data)
          if (cotacao) {
            setResultadoConversao(`${valor} ${moedaDe} = ${cotacao} ${moedaPara}`);
            setExibirModal(true)
            setExibirSpinner(false)
            setExibirMsgErro(false)
          } else {
            exibirErro()
          }

        }).catch(err => exibirErro());
    }
  }

  function obterCotacao(dadosCotacao) {
    if (!dadosCotacao || dadosCotacao.success !== true) {
      return false;
    }
    const cotacaoDe = dadosCotacao.rates[moedaDe];
    const cotacaoPara = dadosCotacao.rates[moedaPara]

    const cotacao = (1 / cotacaoDe * cotacaoPara) * valor;
    return cotacao.toFixed(2)

  }

  function exibirErro() {
    setExibirMsgErro(true)
    setExibirSpinner(false)
  }

  return (
    <React.Fragment>
      <Container>
        <h1 className="mt-3 mb-3 text-center">Conversor de moedas</h1>
        <Alert variant="danger" show={exibirMsgErro}>
          Erro obetendo dados de conversão, tente novamente.
      </Alert>

        <Jumbotron>
          <Form onSubmit={converter} noValidate validated={formValidado}>
            <Form.Row>

              <Col sm="3">
                <Form.Control placeholder="0" value={valor} required onChange={handleValor} />
              </Col>

              <Col sm="3">
                <Form.Control as="select" value={moedaDe} onChange={handleMoedaDe}>
                  <ListarMoedas />
                </Form.Control>
              </Col>

              <Col sm="1" className="text-center pt-2">
                <FontAwesomeIcon icon={faAngleDoubleRight} />
              </Col>

              <Col sm="3">
                <Form.Control as="select" value={moedaPara} onChange={handleMoedaPara}>
                  <ListarMoedas />
                </Form.Control>
              </Col>

              <Col sm="2">
                <Button variant="success" type="submit" data-testid="btn-converter">
                  <span className={exibirSpinner ? null : 'd-none'}>
                    <Spinner animation="border" size="sm"></Spinner>
                  </span>
                  <span className={exibirSpinner ? 'd-none' : null}>
                    Converter
                  </span>
                </Button>
              </Col>

            </Form.Row>
          </Form>
        </Jumbotron>
      </Container>

      <Modal show={exibirModal} onHide={handleFecharModal} data-testid="modal">
        <Modal.Header closeButton>
          <Modal.Title>Conversão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resultadoConversao}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleFecharModal}>
            Nova conversão
          </Button>
        </Modal.Footer>
      </Modal>

    </React.Fragment>
  );
}

export default ConversorMoedas;
