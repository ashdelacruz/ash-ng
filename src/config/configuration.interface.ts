export interface Configuration {
	environment: string;
	apiUrls: ApiUrls;
	sessionKeys: SessionKeys;
	credentials: Credentials;
}

export interface ApiUrls {
	gutenbergUrl: string;
	jokeApiUrl: string;
	imgFlipUrl: string;
}

//Do not add any connection strings that contain secrets. Any secrets should go into the preferences db in POS.
export interface ConnectionStrings {
}

export interface SessionKeys {
	userSessionDataKey: string;
	userAuthorityLevelKey: string;
	browseBooksKey: string;
	searchBooksKey: string;
	booksTopicsKey: string;
}

export interface Credentials {
	imgFlipCreds: Upass;
}

export interface Upass {
	uname: string;
	pass: string;
}