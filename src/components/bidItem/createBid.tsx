import {
  Box,
  CircularProgress,
  FormHelperText,
  TextareaAutosize,
  TextField,
  Typography,
} from '@mui/material';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { object, string, TypeOf, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { FC, useEffect } from 'react';
import { pickBy } from 'lodash';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBidFn } from '../../api/bidItemApi';
import { IBidItemResponse, IBidResponse } from '../../api/types';
import { useStateContext } from '../../context';
// import FileUpLoader from '../FileUpLoader';

interface ICreateBidProp {
  setOpenBidItemModal: (openPostModal: boolean) => void;
  bidItem: IBidItemResponse;
}

const createBidSchema = object({
  bidPrice: string().min(1, 'Bid price is required'),
}).partial();

type ICreateBid = TypeOf<typeof createBidSchema>;

const CreateBid: FC<ICreateBidProp> = ({ setOpenBidItemModal, bidItem }) => {
  const stateContext = useStateContext();
  const user = stateContext.state.authUser;
  const queryClient = useQueryClient();
  const { isLoading, mutate: createBid } = useMutation(
    (data: any ) =>
      createBidFn(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bid-item']);
        toast.success('Bid successfully');
        setOpenBidItemModal(false);
      },
      onError: (error: any) => {
        setOpenBidItemModal(false);
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

  const methods = useForm<ICreateBid>({
    resolver: zodResolver(createBidSchema),
  });

  const {
    formState: { isSubmitting },
  } = methods;

  const {
    formState: { errors, isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitting) {
      methods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  // useEffect(() => {
  //   if (bidItem) {
  //     methods.reset({
  //       bidPrice: bidItem.name,
  //       // category: post.category,
  //       // content: post.content,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [bidItem]);

  const onSubmitHandler: SubmitHandler<ICreateBid> = (values) => {
    const bidItemId = bidItem.id;
    const userId = user?.id;
    const bidPrice = Number(values.bidPrice)
    const data = {
      bidPrice: bidPrice,
      bidItemId: bidItemId,
      userId: userId
    }
    createBid(data);
  };

  return (
    <Box>
      <Box display='flex' justifyContent='space-between' sx={{ mb: 3 }}>
        <Typography variant='h5' component='h1'>
          {bidItem.name}
        </Typography>
        {isLoading && <CircularProgress size='1rem' color='primary' />}
      </Box>
      <FormProvider {...methods}>
        <Box
          component='form'
          noValidate
          autoComplete='off'
          onSubmit={methods.handleSubmit(onSubmitHandler)}
        >
          <TextField
            label='Bid Price'
            fullWidth
            sx={{ mb: '1rem' }}
            {...methods.register('bidPrice')}
          />
          <FormHelperText error={!!errors['bidPrice']}>
            {errors['bidPrice'] ? errors['bidPrice'].message : ''}
          </FormHelperText>
          {/* <FileUpLoader name='image' /> */}
          <LoadingButton
            variant='contained'
            fullWidth
            sx={{ py: '0.8rem', mt: 4, backgroundColor: '#2363eb' }}
            type='submit'
            loading={isLoading}
          >
            Submit
          </LoadingButton>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default CreateBid;
