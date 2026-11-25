import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Career Radar',description:'비공개 채용 탐색 워크스페이스',robots:{index:false,follow:false}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ko"><head><meta name="referrer" content="no-referrer"/><meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.github.com; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'"/></head><body>{children}</body></html>}
