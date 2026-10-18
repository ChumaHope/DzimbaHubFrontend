export type AuthUser={id:number;fullName:string;email:string;role:'TENANT'|'LANDLORD'|'ADMIN';status?:string};
export type AuthResult={token:string;user:AuthUser}; const TOKEN_KEY='dzimbahub_token';const USER_KEY='dzimbahub_user';
export function saveAuth(result:AuthResult){if(typeof window==='undefined')return;localStorage.setItem(TOKEN_KEY,result.token);localStorage.setItem(USER_KEY,JSON.stringify(result.user));window.dispatchEvent(new Event('dzimbahub-auth-change'));}
export function getToken(){return typeof window==='undefined'?null:localStorage.getItem(TOKEN_KEY)}
export function getUser():AuthUser|null{if(typeof window==='undefined')return null;try{const raw=localStorage.getItem(USER_KEY);return raw?JSON.parse(raw) as AuthUser:null}catch{return null}}
export function clearAuth(){if(typeof window==='undefined')return;localStorage.removeItem(TOKEN_KEY);localStorage.removeItem(USER_KEY);window.dispatchEvent(new Event('dzimbahub-auth-change'))}
export type SignupResponse={message:string;status:'PENDING'};
export function authRequest(path:'/signup',body:object):Promise<SignupResponse>;
export function authRequest(path:'/login',body:object):Promise<AuthResult>;
export async function authRequest(path:'/login'|'/signup',body:object):Promise<AuthResult|SignupResponse>{const base=(process.env.NEXT_PUBLIC_API_URL||(process.env.NODE_ENV==='development'?'http://localhost:8080/api':'')).replace(/\/$/,'');if(!base)throw new Error('The API URL is not configured for this deployment. Set NEXT_PUBLIC_API_URL to your HTTPS backend URL and redeploy.');const response=await fetch(`${base}/auth${path}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await response.json().catch(()=>({message:'The server returned an unreadable response.'}));if(!response.ok)throw new Error(data.message||`Request failed (${response.status})`);return data as AuthResult|SignupResponse;}
