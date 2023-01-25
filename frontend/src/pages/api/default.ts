// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from 'next';

export default function index(res: NextApiResponse) {
	res.status(500).json({
		message: 'Error while trying to reach the server',
	});
}
