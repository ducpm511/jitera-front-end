import {
  Box,
  CircularProgress,
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
import { updateBidItemFn } from '../../api/bidItemApi';
import { IBidItemResponse } from '../../api/types';
// import FileUpLoader from '../FileUpLoader';

interface IUpdateBidItemProp {
  setOpenBidItemModal: (openPostModal: boolean) => void;
  bidItem: IBidItemResponse;
}

const updateBidItemSchema = object({
  title: string(),
  content: string(),
  category: string().max(50),
  image: z.instanceof(File),
}).partial();

type IUpdateBidItem = TypeOf<typeof updateBidItemSchema>;

const UpdatePost: FC<IUpdateBidItemProp> = ({ setOpenBidItemModal, bidItem }) => {
  const queryClient = useQueryClient();
  const { isLoading, mutate: updatePost } = useMutation(
    ({ id, formData }: { id: string; formData: FormData }) =>
    updateBidItemFn({ id, formData }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bid-item']);
        toast.success('Post updated successfully');
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

  useEffect(() => {
    if (isSubmitting) {
      methods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  useEffect(() => {
    if (bidItem) {
      methods.reset({
        title: bidItem.name,
        // category: post.category,
        // content: post.content,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bidItem]);

  const onSubmitHandler: SubmitHandler<IUpdateBidItem> = (values) => {
    const formData = new FormData();
    const filteredFormData = pickBy(
      values,
      (value) => value !== '' && value !== undefined
    );
    const { image, ...otherFormData } = filteredFormData;
    if (image) {
      formData.append('image', image);
    }
    formData.append('data', JSON.stringify(otherFormData));
    updatePost({ id: bidItem?.id!, formData });
  };

  return (
    <Box>
      <Box display='flex' justifyContent='space-between' sx={{ mb: 3 }}>
        <Typography variant='h5' component='h1'>
          Edit Post
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
            label='Title'
            fullWidth
            sx={{ mb: '1rem' }}
            {...methods.register('title')}
          />
          <TextField
            label='Category'
            fullWidth
            sx={{ mb: '1rem' }}
            {...methods.register('category')}
          />
          <Controller
            name='content'
            control={methods.control}
            defaultValue=''
            render={({ field }) => (
              <TextareaAutosize
                {...field}
                placeholder='Post Details'
                minRows={8}
                style={{
                  width: '100%',
                  border: '1px solid #c8d0d4',
                  fontFamily: 'Roboto, sans-serif',
                  outline: 'none',
                  fontSize: '1rem',
                  padding: '1rem',
                }}
              />
            )}
          />
          {/* <FileUpLoader name='image' /> */}
          <LoadingButton
            variant='contained'
            fullWidth
            sx={{ py: '0.8rem', mt: 4, backgroundColor: '#2363eb' }}
            type='submit'
            loading={isLoading}
          >
            Edit Post
          </LoadingButton>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default UpdatePost;
