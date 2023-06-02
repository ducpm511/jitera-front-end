import {
  Box,
  CircularProgress,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import {
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { object, string, TypeOf} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBidItemFn } from '../../api/bidItemApi';
import { IBidItemResponse } from '../../api/types';
// import FileUpLoader from '../FileUpLoader';

interface IUpdateBidItemProp {
  setOpenBidItemModal: (openPostModal: boolean) => void;
  bidItem: IBidItemResponse;
}

const updateBidItemSchema = object({
  name: string().min(1, 'Name is required'),
  startedPrice: string().min(1, 'Start price is required'),
  timeWindow: string().min(1, 'Time window is required'),
  status: string()
});

type IUpdateBidItem = TypeOf<typeof updateBidItemSchema>;

const UpdateBidItem: FC<IUpdateBidItemProp> = ({ setOpenBidItemModal, bidItem }) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('draft');
  const { isLoading, mutate: updateBidItem } = useMutation(
    ({ id, data }: { id: string | any; data: any }) =>
      updateBidItemFn(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bid-item']);
        toast.success('Bid item updated successfully');
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

  const methods = useForm<IUpdateBidItem>({
    resolver: zodResolver(updateBidItemSchema),
  });

  const {
    formState: { isSubmitting },
  } = methods;

  const {
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (isSubmitting) {
      methods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  useEffect(() => {
    if (bidItem) {
      methods.reset({
        name: bidItem.name,
        startedPrice: bidItem.startedPrice.toString(),
        timeWindow: bidItem.timeWindow.toString(),
        status: bidItem.status
        // content: post.content,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bidItem]);

  const onSubmitHandler: SubmitHandler<IUpdateBidItem> = (values) => {
    let formatedValues = {
      "name": '',
      "startedPrice": 0,
      "timeWindow": 0,
      "status": 'draft'
    };
    formatedValues.name = values.name;
    formatedValues.startedPrice = Number(values.startedPrice);
    formatedValues.timeWindow = Number(values.timeWindow);
    formatedValues.status = status;
    updateBidItem({ id: bidItem?.id!, data: formatedValues});
  };

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };
  return (
    <Box>
      <Box display='flex' justifyContent='space-between' sx={{ mb: 3 }}>
        <Typography variant='h5' component='h1'>
          Edit Item
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
            label='Name'
            fullWidth
            sx={{ mb: '1rem' }}
            {...methods.register('name')}
          />
          <FormHelperText error={!!errors['name']}>
            {errors['name'] ? errors['name'].message : ''}
          </FormHelperText>
          <TextField
            label='Start Price'
            fullWidth
            sx={{ mb: '1rem' }}
            {...methods.register('startedPrice')}
          />
          <TextField
            label='Time window'
            fullWidth
            sx={{ mb: '1rem' }}
            {...methods.register('timeWindow')}
          />
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={status}
            label="Status"
            sx={{ mb: '1rem' }}
            style={{ "width": "100%", "color": "#000000" }}
            onChange={handleChange}
          // {...methods.register('status')}
          >
            <MenuItem value={'draft'}>Draft</MenuItem>
            <MenuItem value={'published'}>Published</MenuItem>
            <MenuItem value={'on_going'}>On Going</MenuItem>
            <MenuItem value={'completed'}>Completed</MenuItem>
          </Select>
          {/* <FileUpLoader name='image' /> */}
          <LoadingButton
            variant='contained'
            fullWidth
            sx={{ py: '0.8rem', mt: 4, backgroundColor: '#2363eb' }}
            type='submit'
            loading={isLoading}
          >
            Edit Item
          </LoadingButton>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default UpdateBidItem;
