import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

const MapModal = ({ show, handleClose, modalUrl, loading, handleLoaded }) => (
  <Modal show={show} onHide={handleClose} dialogClassName="custom-modal-size">
    <Modal.Header closeButton>
      <Modal.Title>카카오맵 길찾기</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      ) : (
        <>
              {console.log(`Loading iframe with URL: ${modalUrl}`)}
        <iframe
          src={modalUrl}
          onLoad={() => {
            console.log('iframe loaded successfully');
            handleLoaded();
          }}
          onError={() => {
            console.error('Failed to load the iframe content.');
            handleLoaded(); // iframe 로딩 실패시에도 로딩 상태 해제
          }}
          width="140%"
          height="700px"
          title="map" 
          style={{ border: 'none' }}
        ></iframe>
        </>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>닫기</Button>
    </Modal.Footer>
  </Modal>
);

export default MapModal;