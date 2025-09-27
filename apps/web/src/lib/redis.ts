type Json = string|number|boolean|null|{[k:string]:Json}|Json[];

const store = new Map<string,{v:Json; exp?:number}>();

export const redis = {
  async get<T=Json>(k:string): Promise<T|null> {
    const it = store.get(k); 
    if(!it) return null;
    if(it.exp && it.exp < Date.now()){ 
      store.delete(k); 
      return null; 
    }
    return it.v as T;
  },
  
  async set(k:string, v:Json, opts?:{ex?:number}) {
    const exp = opts?.ex ? Date.now()+opts.ex*1000 : undefined;
    store.set(k,{v,exp});
  },
  
  async del(k:string) {
    store.delete(k);
  },
  
  async setex(k:string, seconds:number, v:Json) {
    await this.set(k, v, {ex: seconds});
  },
  
  async exists(k:string): Promise<boolean> {
    const it = store.get(k);
    if (!it) return false;
    if (it.exp && it.exp < Date.now()) {
      store.delete(k);
      return false;
    }
    return true;
  }
};