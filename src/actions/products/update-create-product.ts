import {isAxiosError} from 'axios';
import {tesloApi} from '../../config/api/tesloApi';
import {Product} from '../../domain/entities/product';

export const updateCreateProduct = (product: Partial<Product>) => {
  product.stock = isNaN(Number(product.stock)) ? 0 : Number(product.stock);
  product.price = isNaN(Number(product.price)) ? 0 : Number(product.price);
  if (product.id) {
    return updateProduct(product);
  }
  throw new Error('Creacion no esta implementada');
};

// todo revisar si viene el usuario
const updateProduct = async (product: Partial<Product>) => {
  const {id, images = [], ...rest} = product;
  try {
    const checkImages = prepareImages(images);
    const {data} = await tesloApi.patch(`/products/${id}`, {
      images: checkImages,
      ...rest,
    });
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response?.data);
    }
    throw new Error(`Error al actualizar producto ${id}`);
  }
};

const prepareImages = (images: string[]) => {
  // Todo: revisar los files
  return images.map(image => image.split('/').pop());
};
