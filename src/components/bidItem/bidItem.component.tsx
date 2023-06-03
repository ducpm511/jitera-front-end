import {
  TableCell,
  TableRow,
} from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import BackHandIcon from '@mui/icons-material/BackHand';
import { FC, useState } from 'react';
import BidItemModal from '../modals/bidItem.modal';
import { toast } from 'react-toastify';
import CreateBid from './createBid';
import './bidItem.styles.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBidItemFn } from '../../api/bidItemApi';
import { IBidItemResponse } from '../../api/types';
import Button from '@mui/material/Button';
import decimalToTime from '../../utils/decimalToTime';
import { useStateContext } from '../../context';
import UpdateBidItem from './updateBidItem';
import BidModal from '../modals/bid.modal';

interface IBidItemProps {
  bidItem: IBidItemResponse;
}

const BidItem: FC<IBidItemProps> = ({ bidItem }) => {
  const queryClient = useQueryClient();
  const [openBidItemModal, setOpenBidItemModal] = useState(false);
  const [openBidModal, setOpenBidModal] = useState(false);

  const stateContext = useStateContext();
  const user = stateContext.state.authUser;
  // const { mutate: deletePost } = useMutation((id: string) => deleteBidItemFn(id), {
  //   onSuccess(data) {
  //     queryClient.invalidateQueries(['bid-item']);
  //     toast.success('Post deleted successfully');
  //   },
  //   onError(error: any) {
  //     if (Array.isArray((error as any).data.error)) {
  //       (error as any).data.error.forEach((el: any) =>
  //         toast.error(el.message, {
  //           position: 'top-right',
  //         })
  //       );
  //     } else {
  //       toast.error((error as any).data.message, {
  //         position: 'top-right',
  //       });
  //     }
  //   },
  // });

  // const onDeleteHandler = (id: string) => {
  //   if (window.confirm('Are you sure')) {
  //     deletePost(id);
  //   }
  // };

  const hanldeBidClick = () => {
    if (user && (user?.ballance < bidItem.currentPrice)) {
      toast.error('Your balance is not enough', {
        position: 'top-right',
      })
    } else {
      setOpenBidModal(true)
    }

  }

  const hanldeEditClick = () => {
    setOpenBidItemModal(true)

  }

  return (
    <>
      <TableRow
        key={bidItem.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {bidItem.name}
        </TableCell>
        <TableCell align="right">{bidItem.startedPrice}</TableCell>
        <TableCell align="right">{bidItem.currentPrice}</TableCell>
        <TableCell align="right">{decimalToTime(bidItem.timeWindow)}</TableCell>
        <TableCell align="right">{bidItem.status}</TableCell>
        <TableCell align="right">
          <Button variant="outlined" onClick={hanldeEditClick} startIcon={<ModeEditIcon />} style={{"marginRight":"10px"}}>Edit</Button>
          <Button variant="outlined" onClick={hanldeBidClick} startIcon={<BackHandIcon />}>Bid</Button>
        </TableCell>
      </TableRow>
      <BidItemModal
        openBidItemModal={openBidItemModal}
        setOpenBidItemModal={setOpenBidItemModal}
      >
        <UpdateBidItem setOpenBidItemModal={setOpenBidItemModal} bidItem={bidItem} />
      </BidItemModal>

      <BidModal
        openBidModal={openBidModal}
        setOpenBidModal={setOpenBidModal}
      >
        <CreateBid setOpenBidModal={setOpenBidModal} bidItem={bidItem} />
      </BidModal>
    </>
  );
};

export default BidItem;
