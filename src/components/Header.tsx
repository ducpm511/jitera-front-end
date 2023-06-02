import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { LoadingButton as _LoadingButton } from '@mui/lab';
import { useStateContext } from '../context';
import { useMutation } from '@tanstack/react-query';
import { logoutUserFn } from '../api/authApi';
import CreateBidItem from './bidItem/createBidItem';
import BidItemModal from './modals/bidItem.modal';
import DepositModal from './modals/deposit.modal';
import CreateDeposit from './user/createDeposit';

const LoadingButton = styled(_LoadingButton)`
  padding: 0.4rem;
  color: #222;
  font-weight: 500;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Header = () => {
  const [openBidItemModal, setOpenBidItemModal] = useState(false);
  const [openDepositModal, setDepositModal] = useState(false);
  const navigate = useNavigate();
  const stateContext = useStateContext();
  const user = stateContext.state.authUser;

  const { mutate: logoutUser, isLoading } = useMutation(
    async () => await logoutUserFn(),
    {
      onSuccess: (data) => {
        window.location.href = '/login';
      },
      onError: (error: any) => {
        if (Array.isArray(error.response.data.error)) {
          error.data.error.forEach((el: any) =>
            toast.error(el.message, {
              position: 'top-right',
            })
          );
        } else {
          toast.error(error.response.data.message, {
            position: 'top-right',
          });
        }
      },
    }
  );

  const onLogoutHandler = async () => {
    logoutUser();
  };

  return (
    <>
      <AppBar position='static' sx={{ backgroundColor: '#fff' }}>
        <Container maxWidth='lg'>
          <Toolbar>
            <Typography
              variant='h6'
              onClick={() => navigate('/')}
              sx={{ cursor: 'pointer', color: '#222' }}
            >
              Logo
            </Typography>
            <Box display='flex' sx={{ ml: 'auto' }}>
              {!user && (
                <>
                  <LoadingButton
                    sx={{ mr: 2 }}
                    onClick={() => navigate('/register')}
                  >
                    SignUp
                  </LoadingButton>
                  <LoadingButton onClick={() => navigate('/login')}>
                    Login
                  </LoadingButton>
                </>
              )}
              {user && (
                <>
                  <LoadingButton
                    loading={isLoading}
                    onClick={() => navigate('/profile')}
                  >
                    Profile
                  </LoadingButton>
                  <LoadingButton onClick={onLogoutHandler} loading={isLoading}>
                    Logout
                  </LoadingButton>
                  <LoadingButton onClick={() => setOpenBidItemModal(true)}>
                    Create Bid Item
                  </LoadingButton>
                  <LoadingButton onClick={() => setDepositModal(true)}>
                    Deposit
                  </LoadingButton>
                </>
              )}
              {user && user?.role === 'admin' && (
                <LoadingButton
                  sx={{ ml: 2 }}
                  onClick={() => navigate('/admin')}
                >
                  Admin
                </LoadingButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <BidItemModal
        openBidItemModal={openBidItemModal}
        setOpenBidItemModal={setOpenBidItemModal}
      >
        <CreateBidItem setOpenBidItemModal={setOpenBidItemModal} />
      </BidItemModal>

      <DepositModal
        openDepositModal={openDepositModal}
        setDepositModal={setDepositModal}
      >
        <CreateDeposit setDepositModal={setDepositModal} />
      </DepositModal>
   
    </>
  );
};

export default Header;
