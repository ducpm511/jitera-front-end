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
  import { number, object, string, TypeOf, z } from 'zod';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { LoadingButton } from '@mui/lab';
  import { FC, useEffect } from 'react';
  import { toast } from 'react-toastify';
  import { useMutation, useQueryClient } from '@tanstack/react-query';
  import { createBidItemFn } from '../../api/bidItemApi';
//   import FileUpLoader from '../FileUpLoader';
  
  interface ICreateBidItemProp {
    setOpenBidItemModal: (openBidItemModal: boolean) => void;
  }
  
  const createBidItemSchema = object({
    name: string().min(1, 'Name is required'),
    startedPrice: string().min(1, 'Start price is required'),
    timeWindow: string().min(1, 'Time window is required'),
  });
  
  export type ICreateBidItem = TypeOf<typeof createBidItemSchema>;
  
  const CreateBidItem: FC<ICreateBidItemProp> = ({ setOpenBidItemModal }) => {
    const queryClient = useQueryClient();
    const { isLoading, mutate: createBidItem } = useMutation(
      (bidItem: any) => createBidItemFn(bidItem),
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['bid-item']);
          toast.success('Bid Item created successfully');
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
  
    const methods = useForm<ICreateBidItem>({
      resolver: zodResolver(createBidItemSchema),
    });
  
    const {
      formState: { errors, isSubmitSuccessful },
    } = methods;
  
    useEffect(() => {
      if (isSubmitSuccessful) {
        methods.reset();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitSuccessful]);
  
    const onSubmitHandler: SubmitHandler<ICreateBidItem> = (values) => {
     
      console.log(values);
      let formatedValues = {
        "name": '',
        "startedPrice": 0,
        "timeWindow": 0
      };
      formatedValues.name = values.name;
      formatedValues.startedPrice = Number(values.startedPrice);
      formatedValues.timeWindow = Number(values.timeWindow)
      createBidItem(formatedValues);
    };
  
    return (
      <Box>
        <Box display='flex' justifyContent='space-between' sx={{ mb: 3 }}>
          <Typography variant='h5' component='h1'>
            Create BidItem
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
            <FormHelperText error={!!errors['startedPrice']}>
              {errors['startedPrice'] ? errors['startedPrice'].message : ''}
            </FormHelperText>
  
            <TextField
              label='Time Window'
              fullWidth
              sx={{ mb: '1rem' }}
              {...methods.register('timeWindow')}
            />
            <FormHelperText error={!!errors['timeWindow']}>
              {errors['timeWindow'] ? errors['timeWindow'].message : ''}
            </FormHelperText>
            {/* <FileUpLoader name='image' /> */}
            <LoadingButton
              variant='contained'
              fullWidth
              sx={{ py: '0.8rem', mt: 4, backgroundColor: '#2363eb' }}
              type='submit'
              loading={isLoading}
            >
              Create Bid Item
            </LoadingButton>
          </Box>
        </FormProvider>
      </Box>
    );
  };
  
  export default CreateBidItem;
  