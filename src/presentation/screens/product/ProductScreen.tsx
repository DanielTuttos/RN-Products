import {
  Button,
  ButtonGroup,
  Input,
  Layout,
  Text,
  useTheme,
} from '@ui-kitten/components';
import {MainLayout} from '../../layouts/MainLayout';
import {getProductById} from '../../../actions/products/get-product-by-id';
import {RootStackParams} from '../../navigation/StackNavigator';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {StackScreenProps} from '@react-navigation/stack';
import {useRef} from 'react';
import {ScrollView} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {FadeInImage, MyIcon} from '../../components';
import {Gender, Product, Size} from '../../../domain/entities/product';
import {Formik} from 'formik';
import {updateCreateProduct} from '../../../actions/products/update-create-product';

// tallas
const sizes: Size[] = [Size.Xs, Size.S, Size.M, Size.L, Size.Xl, Size.Xxl];

const genders: Gender[] = [Gender.Kid, Gender.Men, Gender.Unisex, Gender.Women];

interface Props extends StackScreenProps<RootStackParams, 'ProductScreen'> {}

export const ProductScreen = ({route}: Props) => {
  const productIdRef = useRef(route.params.productId);

  const theme = useTheme();
  const queryClient = useQueryClient();

  // use query
  const {isLoading, data: product} = useQuery({
    queryKey: ['product', productIdRef.current],
    staleTime: 1000 * 60 * 60, // 1 hora
    queryFn: () => getProductById(productIdRef.current),
  });

  // use mutation
  const mutation = useMutation({
    mutationFn: (data: Product) =>
      updateCreateProduct({...data, id: productIdRef.current}),
    onSuccess(data: Product) {
      productIdRef.current = data.id;
      queryClient.invalidateQueries({queryKey: ['products', 'infinite']});
      queryClient.invalidateQueries({queryKey: ['product', data.id]});
      // queryClient.setQueryData(['product', data.id], data);
    },
  });

  if (!product) {
    return <MainLayout title="Cargando..." />;
  }

  return (
    <Formik initialValues={product} onSubmit={mutation.mutate}>
      {({handleChange, handleSubmit, values, errors, setFieldValue}) => (
        <MainLayout title={values.title} subtitle={`Precio: ${values.price}`}>
          <ScrollView style={{flex: 1}}>
            {/* imagenes del producto */}
            <Layout>
              {/* todo: tener en consideracion cuando no hay imagenes */}
              <FlatList
                data={values.images}
                horizontal
                keyExtractor={item => item}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <FadeInImage
                    uri={item}
                    style={{width: 300, height: 300, marginHorizontal: 7}}
                  />
                )}
              />
            </Layout>
            {/* formulario */}
            <Layout style={{marginHorizontal: 10}}>
              <Input
                label="Titulo"
                value={values.title}
                style={{marginVertical: 5}}
                onChangeText={handleChange('title')}
              />
              <Input
                label="Slug"
                value={values.slug}
                style={{marginVertical: 5}}
                onChangeText={handleChange('slug')}
              />
              <Input
                label="Description"
                value={values.description}
                multiline
                numberOfLines={5}
                style={{marginVertical: 5}}
                onChangeText={handleChange('description')}
              />
            </Layout>
            {/* precio e inventario  */}
            <Layout
              style={{
                marginVertical: 5,
                marginHorizontal: 15,
                flexDirection: 'row',
                gap: 10,
              }}>
              <Input
                label="Precio"
                value={values.price.toString()}
                style={{flex: 1}}
                onChangeText={handleChange('price')}
                keyboardType="number-pad"
              />
              <Input
                label="Inventario"
                value={values.stock.toString()}
                style={{flex: 1}}
                onChangeText={handleChange('stock')}
                keyboardType="number-pad"
              />
            </Layout>

            {/* selectores */}
            <ButtonGroup
              size="small"
              appearance="outline"
              style={{
                margin: 2,
                marginTop: 20,
                marginHorizontal: 15,
              }}>
              {sizes.map(size => (
                <Button
                  onPress={() =>
                    setFieldValue(
                      'sizes',
                      values.sizes.includes(size)
                        ? values.sizes.filter(s => s !== size)
                        : [...values.sizes, size],
                    )
                  }
                  key={size}
                  style={{
                    flex: 1,
                    backgroundColor: values.sizes.includes(size)
                      ? theme['color-primary-200']
                      : undefined,
                  }}>
                  {size}
                </Button>
              ))}
            </ButtonGroup>

            <ButtonGroup
              size="small"
              appearance="outline"
              style={{
                margin: 2,
                marginTop: 20,
                marginHorizontal: 15,
              }}>
              {genders.map(gender => (
                <Button
                  key={gender}
                  style={{
                    flex: 1,
                    backgroundColor: values.gender.startsWith(gender)
                      ? theme['color-primary-200']
                      : undefined,
                  }}
                  onPress={() => setFieldValue('gender', gender)}>
                  {gender}
                </Button>
              ))}
            </ButtonGroup>

            {/* boton de guardar */}
            <Button
              onPress={() => handleSubmit()}
              style={{margin: 15}}
              disabled={mutation.isPending}
              accessoryLeft={<MyIcon name="save-outline" white />}>
              Guardar
            </Button>

            <Text>{JSON.stringify(values, null, 2)}</Text>

            <Layout style={{height: 200}} />
          </ScrollView>
        </MainLayout>
      )}
    </Formik>
  );
};
