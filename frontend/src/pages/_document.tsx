import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
	// static async getInitialPropos(ctx: DocumentContext) {
	//   const initalProps = await Document.getInitialProps(ctx);
	//   return {...initiaProps}
	// }
	return (
		<Html lang='en'>
			<Head>
				<meta
					property='og:title'
					content='Authorify Dev Test'
					key='title'
				/>
				<link
					href='https://fonts.googleapis.com/css2?family=Open+Sans&display=swap'
					rel='stylesheet'
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
