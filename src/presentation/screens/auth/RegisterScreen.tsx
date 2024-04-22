import {Button, Input, Layout, Text} from '@ui-kitten/components';
import {ScrollView, useWindowDimensions} from 'react-native';
import {MyIcon} from '../../components';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/StackNavigator';
import {useState} from 'react';
import {RegisterData} from '../../../domain/entities/user';
import {useAuthStore} from '../../store/auth/useAuthStore';

const errors = [
  '- Email must be an email',
  '- The password must have a Uppercase, lowercase letter and a number',
  '- Password must be longer than or equal to 6 characters',
];

interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'> {}

export const RegisterScreen = ({navigation}: Props) => {
  const [form, setform] = useState<RegisterData>({
    email: '',
    fullName: '',
    password: '',
  });
  const [showErros, setShowErros] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const {register} = useAuthStore();

  const {height} = useWindowDimensions();

  const onRegister = async () => {
    if (!form.email.length || !form.fullName.length || !form.password.length)
      return;
    setIsLoading(true);
    const wasSuccess = await register(form);
    setShowErros(!wasSuccess);
    setIsLoading(false);
  };

  return (
    <Layout style={{flex: 1}}>
      <ScrollView style={{marginHorizontal: 40}}>
        <Layout style={{paddingTop: height * 0.25}}>
          <Text category="h1">Crear cuenta</Text>
          <Text category="p2">Por favor, crea una cuenta para continuar</Text>
        </Layout>
        {/* inputs */}
        <Layout style={{marginTop: 20}}>
          <Input
            placeholder="Nombre Completo"
            style={{marginBottom: 10}}
            accessoryLeft={<MyIcon name="person-outline" />}
            value={form.fullName}
            onChangeText={value => setform({...form, fullName: value})}
          />
          <Input
            placeholder="Correo electronico"
            style={{marginBottom: 10}}
            keyboardType="email-address"
            autoCapitalize="none"
            accessoryLeft={<MyIcon name="email-outline" />}
            value={form.email}
            onChangeText={value => setform({...form, email: value})}
          />

          <Input
            placeholder="Contraseña"
            style={{marginBottom: 10}}
            secureTextEntry
            autoCapitalize="none"
            accessoryLeft={<MyIcon name="lock-outline" />}
            value={form.password}
            onChangeText={value => setform({...form, password: value})}
          />
        </Layout>

        {showErros && (
          <Layout style={{gap: 10, marginTop: 20}}>
            {errors.map((error, index) => (
              <Text key={index} category="p2">
                {error}
              </Text>
            ))}
          </Layout>
        )}

        <Layout style={{height: 20}} />

        {/* Button */}
        <Layout>
          <Button
            disabled={isLoading}
            onPress={onRegister}
            accessoryRight={<MyIcon name="arrow-forward-outline" white />}
            // appearance="ghost"
          >
            Crear
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
          <Text>Ya tienes una cuenta?</Text>
          <Text
            status="primary"
            category="s1"
            onPress={() => navigation.goBack()}>
            {' '}
            ingresar
          </Text>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
