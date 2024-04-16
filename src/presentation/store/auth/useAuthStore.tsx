import {create} from 'zustand';
import {RegisterData, User} from '../../../domain/entities/user';
import {AuthStatus} from '../../../infrastructure/interfaces/auth.status';
import {
  authCheckStatus,
  authLogin,
  registerUser,
} from '../../../actions/auth/auth';
import {StorageAdapter} from '../../../config/adapter/storage-adapter';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;
  login: (email: string, password: string) => Promise<boolean>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;
  register: ({fullName, email, password}: RegisterData) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: 'checking',
  token: undefined,
  user: undefined,
  login: async (email, password) => {
    const resp = await authLogin(email, password);

    if (!resp) {
      set({status: 'unauthenticated', token: undefined, user: undefined});
      return false;
    }
    await StorageAdapter.setItem('token', resp.token);
    set({status: 'authenticated', token: resp.token, user: resp.user});
    return true;
  },
  checkStatus: async () => {
    const resp = await authCheckStatus();
    if (!resp) {
      set({status: 'unauthenticated', token: undefined, user: undefined});
      return;
    }
    await StorageAdapter.setItem('token', resp.token);
    set({status: 'authenticated', token: resp.token, user: resp.user});
  },
  logout: async () => {
    await AsyncStorage.removeItem('token');
    set({status: 'unauthenticated', token: undefined, user: undefined});
  },
  register: async ({email, fullName, password}) => {
    const resp = await registerUser({email, fullName, password});
    if (!resp) {
      set({status: 'unauthenticated', token: undefined, user: undefined});
      return false;
    }
    await StorageAdapter.setItem('token', resp.token);
    set({status: 'authenticated', token: resp.token, user: resp.user});
    return true;
  },
}));
