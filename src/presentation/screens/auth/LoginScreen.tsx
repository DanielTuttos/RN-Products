import {Button, Input, Layout, Text} from '@ui-kitten/components';
import {ScrollView, useWindowDimensions} from 'react-native';
import {MyIcon} from '../../components';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/StackNavigator';

interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'> {}

export const LoginScreen = ({navigation}: Props) => {
  const {height} = useWindowDimensions();
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
            accessoryLeft={<MyIcon name="email-outline" />}
          />

          <Input
            placeholder="Contraseña"
            style={{marginBottom: 10}}
            secureTextEntry
            autoCapitalize="none"
            accessoryLeft={<MyIcon name="lock-outline" />}
          />
        </Layout>

        {/* space */}
        <Layout style={{height: 20}} />

        {/* Button */}
        <Layout>
          <Button
            onPress={() => {}}
            accessoryRight={<MyIcon name="arrow-forward-outline" white />}
            // appearance="ghost"
          >
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
