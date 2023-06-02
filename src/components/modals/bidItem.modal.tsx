import ReactDom from 'react-dom';
import React, { FC, CSSProperties } from 'react';
import { Container } from '@mui/material';

const OVERLAY_STYLES: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,.3)',
  zIndex: 1000,
  
};

const MODAL_STYLES: CSSProperties = {
  position: 'fixed',
  top: '10%',
  left: '50%',
  transform: 'translateX(-50%)',
  transition: 'all 300ms ease',
  backgroundColor: 'white',
  overflowY: 'scroll',
  zIndex: 1000,
};

type IBidItemModal = {
  openBidItemModal: boolean;
  setOpenBidItemModal: (openBidItemModal: boolean) => void;
  children: React.ReactNode;
};

const BidItemModal: FC<IBidItemModal> = ({
  openBidItemModal,
  setOpenBidItemModal,
  children,
}) => {
  if (!openBidItemModal) return null;
  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} onClick={() => setOpenBidItemModal(false)} />
      <Container
        maxWidth='sm'
        sx={{ p: '2rem 1rem', borderRadius: 1 }}
        style={MODAL_STYLES}
      >
        {children}
      </Container>
    </>,
    document.getElementById('bidItem-modal') as HTMLElement
  );
};

export default BidItemModal;
