export type RateResult = { ok: boolean; remaining: number; reset: number };

type Bucket = {count:number; reset:number};
const BUCKET = new Map<string,Bucket>();

function run(limit:number, windowMs:number, key:string): RateResult {
  const now = Date.now(); 
  const b = BUCKET.get(key);
  
  if(!b || b.reset < now){ 
    const reset=now+windowMs; 
    BUCKET.set(key,{count:1,reset}); 
    return {ok:true,remaining:limit-1,reset}; 
  }
  
  if(b.count >= limit) return {ok:false,remaining:0,reset:b.reset};
  
  b.count++; 
  return {ok:true,remaining:limit-b.count,reset:b.reset};
}

/** Rate limiting with multiple overloads:
 * const allow = rateLimit({limit:60, windowSec:60}); await allow(ip);
 * await rateLimit({limit:60, windowSec:60}, ip);
 * await rateLimit(undefined, ip); // 60/60 por defecto
 */
export function rateLimit(): (key:string)=>Promise<RateResult>;
export function rateLimit(opts: {limit:number; windowSec:number}): (key:string)=>Promise<RateResult>;
export function rateLimit(opts: {limit:number; windowSec:number} | undefined, key: string): Promise<RateResult>;
export function rateLimit(opts?: {limit:number; windowSec:number}, key?: string): any {
  const limit = opts?.limit ?? 60; 
  const windowMs = (opts?.windowSec ?? 60)*1000;
  const fn = async (k:string)=>run(limit, windowMs, k);
  return typeof key === 'string' ? fn(key) : fn;
}
