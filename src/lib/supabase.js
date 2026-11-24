import { createClient } from '@supabase/supabase-js';
import {useNeon} from './backend.js';
import {neonClient} from './neonClient.js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase = useNeon ? neonClient : url && key ? createClient(url, key) : null;
