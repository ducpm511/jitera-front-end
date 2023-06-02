import {
    Box,
    CircularProgress,
    FormHelperText,
    TextField,
    Typography,
} from '@mui/material';
import {
    FormProvider,
    SubmitHandler,
    useForm,
} from 'react-hook-form';
import { object, string, TypeOf, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { FC, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { depositFn } from '../../api/userApi';
import { useStateContext } from '../../context';
import { useCookies } from 'react-cookie';

interface ICreateDepositProp {
    setDepositModal: (openBidItemModal: boolean) => void;
}

const createDepositSchema = object({
    ballance: string().min(1, 'Balance is required')
});

export type ICreateDeposit = TypeOf<typeof createDepositSchema>;

const CreateDeposit: FC<ICreateDepositProp> = ({ setDepositModal }) => {
    
    const stateContext = useStateContext();
    const user = stateContext.state.authUser;
    const [cookies] = useCookies(['logged_in']);
    const queryClient = useQueryClient();
    const { isLoading, mutate: createDeposit } = useMutation(
        ({ id, data }: { id: string | any; data: any }) => depositFn(id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['users']);
                toast.success('Deposit successfully');
                setDepositModal(false);
            },
            onError: (error: any) => {
                setDepositModal(false);
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

    const methods = useForm<ICreateDeposit>({
        resolver: zodResolver(createDepositSchema),
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

    const onSubmitHandler: SubmitHandler<ICreateDeposit> = (values) => {

        console.log(values);
        let formatedValues = {
            "ballance": 0,
        };
        formatedValues.ballance = Number(values.ballance);
        console.log(user?.id);
        console.log(cookies.logged_in);
        const userId = user?.id;
        createDeposit({id: userId, data:{ballance: formatedValues.ballance}});
    };

    return (
        <Box>
            <Box display='flex' justifyContent='space-between' sx={{ mb: 3 }}>
                <Typography variant='h5' component='h1'>
                    Deposit
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
                        label='Amount'
                        fullWidth
                        sx={{ mb: '1rem' }}
                        {...methods.register('ballance')}
                    />
                    <FormHelperText error={!!errors['ballance']}>
                        {errors['ballance'] ? errors['ballance'].message : ''}
                    </FormHelperText>

                    <LoadingButton
                        variant='contained'
                        fullWidth
                        sx={{ py: '0.8rem', mt: 4, backgroundColor: '#2363eb' }}
                        type='submit'
                        loading={isLoading}
                    >
                        Deposit
                    </LoadingButton>
                </Box>
            </FormProvider>
        </Box>
    );
};

export default CreateDeposit;
