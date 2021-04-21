import { UserDataInput } from '../types/Input/UserDataInput';

export const validateRegister = (input: UserDataInput) => {
	if (!input.email.includes('@'))
		return [
			{
				field: 'email',
				message: 'Invalid email'
			}
		];

	if (input.username.length <= 4)
		return [
			{
				field: 'username',
				message: 'Username must be at least 5 characters long'
			}
		];

	if (input.username.length <= 4)
		return [
			{
				field: 'username',
				message: 'Username must be at least 5 characters long'
			}
		];

	if (input.username.includes('@'))
		return [
			{
				field: 'username',
				message: 'Username cannot contain @ symbol'
			}
		];

	if (input.password.length <= 7)
		return [
			{
				field: 'password',
				message: 'Password must be at least 8 characters long'
			}
		];

	return undefined;
};
