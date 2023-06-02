import {
  TableCell,
  TableRow,
} from '@mui/material';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { FC, useState } from 'react';
import BidItemModal from '../modals/bidItem.modal';
import { toast } from 'react-toastify';
import UpdatePost from './updateBidItem';
import { format, parseISO } from 'date-fns';
import './bidItem.styles.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBidItemFn } from '../../api/bidItemApi';
import { IBidItemResponse } from '../../api/types';
import Button from '@mui/material/Button';
const SERVER_ENDPOINT = process.env.REACT_APP_SERVER_ENDPOINT;

interface IBidItemProps {
  bidItem: IBidItemResponse;
}

const BidItem: FC<IBidItemProps> = ({ bidItem }) => {
  const queryClient = useQueryClient();
  const [openBidItemModal, setOpenBidItemModal] = useState(false);

  const { mutate: deletePost } = useMutation((id: string) => deleteBidItemFn(id), {
    onSuccess(data) {
      queryClient.invalidateQueries(['bid-item']);
      toast.success('Post deleted successfully');
    },
    onError(error: any) {
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
  });

  const onDeleteHandler = (id: string) => {
    if (window.confirm('Are you sure')) {
      deletePost(id);
    }
  };

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
        <TableCell align="right">{bidItem.timeWindow}</TableCell>
        <TableCell align="right"><Button variant="outlined">Bid</Button></TableCell>
      </TableRow>
      <BidItemModal
        openBidItemModal={openBidItemModal}
        setOpenBidItemModal={setOpenBidItemModal}
      >
        <UpdatePost setOpenBidItemModal={setOpenBidItemModal} bidItem={bidItem} />
      </BidItemModal>
    </>
  );
};

export default BidItem;
