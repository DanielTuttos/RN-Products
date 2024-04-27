import {useRef} from 'react';
import {
  Button,
  ButtonGroup,
  Input,
  Layout,
  useTheme,
} from '@ui-kitten/components';
import {MainLayout} from '../../layouts/MainLayout';
import {RootStackParams} from '../../navigation/StackNavigator';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {StackScreenProps} from '@react-navigation/stack';
import {ScrollView} from 'react-native';
import {MyIcon, ProductImages, SelectorsButtons} from '../../components';
import {Product} from '../../../domain/entities/product';
import {Formik} from 'formik';
import {getProductById, updateCreateProduct} from '../../../actions/products';
import {genders, sizes} from '../../../config/constants/product.constant';
import {CameraAdapter} from '../../../config/adapter/camera-adapter';

interface Props extends StackScreenProps<RootStackParams, 'ProductScreen'> {}

export const ProductScreen = ({route}: Props) => {
  const productIdRef = useRef(route.params.productId);

  // const theme = useTheme();
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
        <MainLayout
          title={values.title}
          subtitle={`Precio: ${values.price}`}
          rightAction={async () => {
            const photos = await CameraAdapter.getPicturesFromLibrary();
            setFieldValue('images', [...values.images, ...photos]);
          }}
          rightActionIcon="image-outline">
          <ScrollView style={{flex: 1}}>
            {/* imagenes del producto */}
            <Layout
              style={{
                marginVertical: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ProductImages images={values.images} />
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
            <SelectorsButtons
              values={sizes}
              currentValues={values.sizes}
              onPress={size =>
                setFieldValue(
                  'sizes',
                  values.sizes.includes(size)
                    ? values.sizes.filter(s => s !== size)
                    : [...values.sizes, size],
                )
              }
            />

            <SelectorsButtons
              values={genders}
              onPress={gender => setFieldValue('gender', gender)}
              currentValues={values.gender}
              isSelectOne
            />

            {/* boton de guardar */}
            <Button
              onPress={() => handleSubmit()}
              style={{margin: 15}}
              disabled={mutation.isPending}
              accessoryLeft={<MyIcon name="save-outline" white />}>
              Guardar
            </Button>
            <Layout style={{height: 200}} />
          </ScrollView>
        </MainLayout>
      )}
    </Formik>
  );
};
