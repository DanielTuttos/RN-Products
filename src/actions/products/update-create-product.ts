import {isAxiosError} from 'axios';
import {tesloApi} from '../../config/api/tesloApi';
import {Product} from '../../domain/entities/product';

export const updateCreateProduct = (product: Partial<Product>) => {
  product.stock = isNaN(Number(product.stock)) ? 0 : Number(product.stock);
  product.price = isNaN(Number(product.price)) ? 0 : Number(product.price);
  if (product.id && product.id !== 'new') {
    return updateProduct(product);
  }
  return createProduct(product);
};

// todo revisar si viene el usuario
const updateProduct = async (product: Partial<Product>) => {
  const {id, images = [], ...rest} = product;
  try {
    const checkImages = await prepareImages(images);
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

const createProduct = async (product: Partial<Product>) => {
  const {id, images = [], ...rest} = product;
  try {
    const checkImages = await prepareImages(images);
    const {data} = await tesloApi.post(`/products`, {
      images: checkImages,
      ...rest,
    });
    console.log('data create product: ', data);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response?.data);
    }
    throw new Error(`Error al crear un producto ${id}`);
  }
};

const prepareImages = async (images: string[]) => {
  // Todo: revisar los files
  const filesImages = images.filter(image => image.includes('file://'));
  const currentImages = images.filter(image => !image.includes('file://'));
  if (filesImages.length > 0) {
    const uploadPromises = filesImages.map(uploadImages);
    const uploadedImages = await Promise.all(uploadPromises);
    currentImages.push(...uploadedImages)
  }

  return currentImages.map(image => image.split('/').pop());
};

const uploadImages = async (imageFile: string) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageFile,
    type: 'image/jpeg',
    name: imageFile.split('/').pop(),
  });
  const {data} = await tesloApi.post<{image: string}>(
    '/files/product',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data.image;
};
