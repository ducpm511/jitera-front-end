import { Box, Container, Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getAllBidItemsFn } from '../api/bidItemApi';
// import FullScreenLoader from '../components/FullScreenLoader';
import BidItem from '../components/bidItem/bidItem.component';
import Message from '../components/Message';
import { IBidItemResponse } from '../api/types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const HomePage = () => {
  const { isLoading, data: bidItems } = useQuery(
    ['bid-item'],
    () => getAllBidItemsFn(),
    {
      select: (data) => data.data.bidItems,
      onError: (error) => {
        if (Array.isArray((error as any).data.error)) {
          (error as any).data.error.forEach((el: any) =>
            toast.error(el.message, {
              position: 'top-right',
            })
          );
        } else {
          toast.error((error as any).data.message, {
            position: 'top-right',
          });
        }
      },
    }
  );

  if (isLoading) {
    // return <FullScreenLoader />;
  }

  return (
    <Container
      maxWidth={false}
      sx={{ backgroundColor: '#223675', minHeight: '100vh', padding: '20px' }}
    >
      {bidItems?.length === 0 ? (
        <Box maxWidth='sm' sx={{ mx: 'auto', py: '5rem' }}>
          <Message type='info' title='Info'>
            No bidItems at the moment
          </Message>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Start Price</TableCell>
                  <TableCell align="right">Current Price</TableCell>
                  <TableCell align="right">Duration</TableCell>
                  <TableCell align="right">Bid</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bidItems?.map((bidItem: IBidItemResponse) => (
                  <BidItem key={bidItem.id} bidItem={bidItem} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>

      )}
    </Container>
  );
};

export default HomePage;
