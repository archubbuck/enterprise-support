/// <reference types="vite/client" />
declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

interface ImportMetaEnv {
	readonly APP_CONFIG_VERSION: string
	readonly APP_CONFIG_COMPANY_NAME: string
	readonly APP_CONFIG_APP_NAME: string
	readonly APP_CONFIG_APP_ID: string
	readonly APP_CONFIG_APP_SUBTITLE?: string
	readonly APP_CONFIG_DOMAIN: string
	readonly APP_CONFIG_VPN_PORTAL?: string
	readonly APP_CONFIG_CONTACTS_EMAIL: string
	readonly APP_CONFIG_CONTACTS_EMERGENCY_EMAIL?: string
	readonly APP_CONFIG_CONTACTS_REGIONS_JSON?: string
	readonly APP_CONFIG_FEATURES_TAG_FILTERING: string
	readonly APP_CONFIG_FEATURES_PDF_DOCUMENTS: string
	readonly APP_CONFIG_FEATURES_WORD_DOCUMENTS: string
	readonly APP_CONFIG_FEATURES_IMAGE_DOCUMENTS: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}