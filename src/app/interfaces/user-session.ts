export interface UserSessionData {
	id: string;
	username: string;
	email: string;
	authorities: Authority[];
	roleString: RoleStrings | null;
	lastLogin: string | null;
	failedLoginAttempts: number;
	lockTime: string | null;
	accountNonExpired: boolean,
	accountNonLocked: boolean,
	credentialsNonExpired: boolean,
	enabled: boolean
}

export interface Authority {
	authority: AuthorityTypes;
}

export enum AuthorityTypes {
	ROLE_GUEST = 'ROLE_GUEST',
	ROLE_USER = 'ROLE_USER',
	ROLE_MODERATOR = 'ROLE_MODERATOR',
	ROLE_ADMIN = 'ROLE_ADMIN',
	ROLE_PENDING = 'PENDING',
	UNKNOWN = 'Unknown'

}

export enum RoleStrings {
	GUEST = 'Guest',
	USER = 'User',
	MODERATOR = 'Moderator',
	MOD = 'Mod',
	ADMINISTRATOR = 'Administrator',
	ADMIN = 'Admin',
	PENDING = 'Pending',
	UNKNOWN = 'Unknown'
}

export function getRoleString(role: AuthorityTypes): RoleStrings {
	if (role === AuthorityTypes.ROLE_ADMIN) {
		return RoleStrings.ADMIN;
	} else if (role === AuthorityTypes.ROLE_MODERATOR) {
		return RoleStrings.MODERATOR;
	} else if (role === AuthorityTypes.ROLE_USER) {
		return RoleStrings.USER;
	} else if (role === AuthorityTypes.ROLE_GUEST) {
		return RoleStrings.GUEST;
	} else if (role === AuthorityTypes.ROLE_PENDING) {
		return RoleStrings.PENDING;
	} else {
		return RoleStrings.UNKNOWN;
	}
}

export function getPrimaryAuthority(authorities: Authority[]): AuthorityTypes {

	if (authorities.length === 0) {
		return AuthorityTypes.UNKNOWN;
	} else {
		authorities.forEach(authority => {
			if (authority.authority == AuthorityTypes.ROLE_ADMIN) {
				return AuthorityTypes.ROLE_ADMIN;
			} else if (authority.authority == AuthorityTypes.ROLE_MODERATOR) {
				return AuthorityTypes.ROLE_MODERATOR;
			} else if (authority.authority == AuthorityTypes.ROLE_USER) {
				return AuthorityTypes.ROLE_USER;
			} else if (authority.authority == AuthorityTypes.ROLE_GUEST) {
				return AuthorityTypes.ROLE_GUEST;
			} else if (authority.authority == AuthorityTypes.ROLE_PENDING) {
				return AuthorityTypes.ROLE_PENDING;
			} else {
				return AuthorityTypes.UNKNOWN;
			}
		});
	}

	return AuthorityTypes.UNKNOWN;


}

export interface UserSessionResponse {
	status: number;
	message: string | null;
	data: UserSessionData;
}

export var demoModeAdminRole = {
	"authorities": [
		{
			"authority": AuthorityTypes.ROLE_GUEST
		},
		{
			"authority": AuthorityTypes.ROLE_USER
		},
		{
			"authority": AuthorityTypes.ROLE_MODERATOR
		},
		{
			"authority": AuthorityTypes.ROLE_ADMIN
		}
	],
};

export var demoModeModRole = {
	"authorities": [
		{
			"authority": AuthorityTypes.ROLE_GUEST
		},
		{
			"authority": AuthorityTypes.ROLE_USER
		},
		{
			"authority": AuthorityTypes.ROLE_MODERATOR
		}
	],
};

export var demoModeUserRole = {
	"authorities": [
		{
			"authority": AuthorityTypes.ROLE_GUEST
		},
		{
			"authority": AuthorityTypes.ROLE_USER
		}
	],
};

export var demoModeGuestRole = {
	"authorities": [
		{
			"authority": AuthorityTypes.ROLE_GUEST
		}
	],
};