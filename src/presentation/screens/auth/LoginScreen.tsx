import {Button, Input, Layout, Text} from '@ui-kitten/components';
import {Alert, ScrollView, useWindowDimensions} from 'react-native';
import {MyIcon} from '../../components';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/StackNavigator';
import {useAuthStore} from '../../store/auth/useAuthStore';
import {useState} from 'react';

interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'> {}

export const LoginScreen = ({navigation}: Props) => {
  const {login} = useAuthStore();

  const [isPosting, setIsPosting] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const {height} = useWindowDimensions();

  const onLogin = async () => {
    if (!form.email.length || !form.password.length) {
      return;
    }
    setIsPosting(true);
    const wasSuccessfull = await login(form.email, form.password);
    setIsPosting(false);
    if (wasSuccessfull) return;
    Alert.alert('Error', 'Usuario o contrasena incorrectos');
  };

  return (
    <Layout style={{flex: 1}}>
      <ScrollView style={{marginHorizontal: 40}}>
        <Layout style={{paddingTop: height * 0.3}}>
          <Text category="h1">Ingresar</Text>
          <Text category="p2">Por favor, ingrese para continuar</Text>
        </Layout>
        {/* inputs */}
        <Layout style={{marginTop: 20}}>
          <Input
            placeholder="Correo electronico"
            style={{marginBottom: 10}}
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={email => setForm({...form, email})}
            accessoryLeft={<MyIcon name="email-outline" />}
          />

          <Input
            placeholder="Contraseña"
            style={{marginBottom: 10}}
            secureTextEntry
            autoCapitalize="none"
            value={form.password}
            onChangeText={password => setForm({...form, password})}
            accessoryLeft={<MyIcon name="lock-outline" />}
          />
        </Layout>

        {/* space */}
        <Layout style={{height: 20}} />

        {/* Button */}
        <Layout>
          <Button
            disabled={isPosting}
            onPress={onLogin}
            accessoryRight={<MyIcon name="arrow-forward-outline" white />}>
            Ingresar
          </Button>
        </Layout>

        {/* Informacion para crear cuenta */}
        <Layout style={{height: 50}} />
        <Layout
          style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text>No tienes cuenta?</Text>
          <Text
            status="primary"
            category="s1"
            onPress={() => navigation.navigate('RegisterScreen')}>
            {' '}
            crea una
          </Text>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
