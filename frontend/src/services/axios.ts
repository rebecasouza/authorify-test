/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { GetServerSidePropsContext, PreviewData } from 'next';
import { ParsedUrlQuery } from 'querystring';

export function getAPIClient(
	ctx?: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) {
	const api = axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_URL,
		timeout: 40000,
	});

	return api;
}
