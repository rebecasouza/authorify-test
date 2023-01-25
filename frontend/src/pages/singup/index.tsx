import api from '@/services/api';
import { SmallCloseIcon } from '@chakra-ui/icons';
import {
	Avatar,
	AvatarBadge,
	Button,
	Center,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	IconButton,
	Input,
	Stack,
	useColorModeValue,
	useToast,
} from '@chakra-ui/react';
import { ChangeEvent, useEffect, useState } from 'react';
import * as yup from 'yup';
import { IRequestUser } from './@types';

const imageMimeType = /image\/(png|jpg|jpeg)/i;

const INITIAL_STATE: IRequestUser = {
	name: '',
	email: '',
	imageUrl: undefined,
};

export default function UserProfileEdit(): JSX.Element {
	const [user, setUser] = useState<IRequestUser>(INITIAL_STATE);
	const [formError, setFormError] = useState('');
	const [imageUrl, setImageUrl] = useState(undefined);
	const [selectedImage, setSelectedImage] = useState<File>();
	const toast = useToast();

	const userSchema = yup.object().shape({
		name: yup.string().required('Name is required'),
		email: yup.string().email('Please enter a valid email address').required(),
		imageUrl: yup.string().nullable(),
	});

	const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) {
			return null;
		}
		const file = e.target.files[0];

		if (!file.type.match(imageMimeType)) {
			alert('Image type is not supported');

			return null;
		}

		setSelectedImage(file);
	};

	const handleRemoveImage = () => {
		setSelectedImage(undefined);
		setImageUrl(undefined);
	};

	useEffect(() => {
		let fileReader: FileReader,
			isCancel = false;
		if (selectedImage) {
			fileReader = new FileReader();
			fileReader.onload = (e) => {
				const { result } = e.target;
				if (result && !isCancel) {
					setImageUrl(result);
				}
			};
			fileReader.readAsDataURL(selectedImage);
		} else {
			setSelectedImage(undefined);
			setImageUrl(undefined);
		}

		return () => {
			isCancel = true;
			if (fileReader && fileReader.readyState === 1) {
				fileReader.abort();
			}
		};
	}, [selectedImage, imageUrl]);

	const handleCancelSubmit = () => {
		setUser(INITIAL_STATE);
		setSelectedImage(undefined);
		setImageUrl(undefined);
	};

	const handleSaveUser = async () => {
		userSchema.isValid(user).then(async function (valid) {
			if (valid) {
				let userImage = '';
				if (selectedImage) {
					const form = new FormData();
					form.append('file', selectedImage);
					console.log(selectedImage);

					await api
						.post('uploads', form, {
							headers: { 'Content-type': 'multipart/form-data' },
						})
						.then((response) => {
							const data = response.data;
							userImage = data.imageUrl;

							setSelectedImage(undefined);
							setImageUrl(undefined);
						})
						.catch((error) => {
							toast({
								title: 'There was a problem signing up',
								description: error.message,
								position: 'top-right',
								status: 'error',
							});
						});
				}

				setUser({ ...user, imageUrl: userImage });
				await api
					.post('auth/signup', user)
					.then(async () => {
						toast({
							title: 'Signup successful',
							position: 'top-right',
							isClosable: true,
							status: 'success',
						});

						setUser(INITIAL_STATE);
					})
					.catch((error) => {
						toast({
							title: 'There was a problem signing up',
							description: error.message,
							position: 'top-right',
							status: 'error',
						});
					});
			} else {
				userSchema.validate(user).catch((e) => {
					setFormError(e);
					console.log('Panic!!!!!!!!');
					console.log(e);
					console.log(e.path);

					console.log('Phewww!!!!');
					toast({
						title: 'There was a problem signing up',
						description: String(e.message),
						position: 'top-right',
						status: 'error',
					});
				});
			}
		});
	};

	return (
		<Flex
			minH={'100vh'}
			align={'center'}
			justify={'center'}
			bg={useColorModeValue('gray.50', 'gray.800')}
		>
			<Stack
				spacing={4}
				w={'full'}
				maxW={'md'}
				bg={useColorModeValue('white', 'gray.700')}
				rounded={'xl'}
				boxShadow={'lg'}
				p={6}
				my={12}
			>
				<Heading
					lineHeight={1.1}
					fontSize={{ base: '2xl', sm: '3xl' }}
				>
					Sign Up
				</Heading>
				<FormControl id='userName'>
					<FormLabel></FormLabel>
					<Stack
						direction={['column', 'row']}
						spacing={6}
					>
						<Center>
							{selectedImage && imageUrl ? (
								<Avatar
									size='xl'
									src={imageUrl}
								>
									<AvatarBadge
										as={IconButton}
										size='sm'
										rounded='full'
										top='-10px'
										colorScheme='red'
										aria-label='remove Image'
										icon={<SmallCloseIcon />}
										onClick={handleRemoveImage}
									/>
								</Avatar>
							) : (
								<Avatar
									size='xl'
									src='https://bit.ly/sage-adebayo'
								>
									<AvatarBadge
										as={IconButton}
										size='sm'
										rounded='full'
										top='-10px'
										colorScheme='red'
										aria-label='remove Image'
										icon={<SmallCloseIcon />}
										onClick={handleRemoveImage}
									/>
								</Avatar>
							)}
						</Center>
						<Center w='full'>
							<FormLabel htmlFor='select-file'>Change Avatar</FormLabel>
						</Center>
					</Stack>
					<Center w='full'>
						<Input
							hidden
							accept='image/*'
							type='file'
							id='select-file'
							onChange={(e) => {
								handleChangeImage(e);
								e.target.value = '';
							}}
						/>
					</Center>
				</FormControl>
				<FormControl
					id='name'
					isRequired
				>
					<FormLabel>Name</FormLabel>
					<Input
						placeholder='Name'
						_placeholder={{ color: 'gray.500' }}
						type='text'
						isInvalid={formError === 'user.name'}
						value={user.name}
						onChange={(e) => {
							setUser({ ...user, name: e.target.value });
							setFormError('');
						}}
					/>
				</FormControl>
				<FormControl
					id='email'
					isRequired
				>
					<FormLabel>Email</FormLabel>
					<Input
						placeholder='your-email@example.com'
						_placeholder={{ color: 'gray.500' }}
						type='email'
						isInvalid={formError === 'user.email'}
						value={user.email}
						onChange={(e) => {
							setUser({ ...user, email: e.target.value });
							setFormError('');
						}}
					/>
				</FormControl>
				{/* <FormControl
					id='password'
					isRequired
				>
					<FormLabel>Password</FormLabel>
					<Input
						placeholder='password'
						_placeholder={{ color: 'gray.500' }}
						type='password'
					/>
				</FormControl> */}
				<Stack
					spacing={6}
					direction={['column', 'row']}
				>
					<Button
						bg={'red.400'}
						color={'white'}
						w='full'
						_hover={{
							bg: 'red.500',
						}}
						onClick={handleCancelSubmit}
					>
						Cancel
					</Button>
					<Button
						bg={'blue.400'}
						color={'white'}
						w='full'
						_hover={{
							bg: 'blue.500',
						}}
						onClick={handleSaveUser}
					>
						Submit
					</Button>
				</Stack>
			</Stack>
		</Flex>
	);
}
