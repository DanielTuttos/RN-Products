import {API_URL} from '../../config/api/tesloApi';
import {Product} from '../../domain/entities/product';
import type {TesloProduct} from '../interfaces/teslo-products.response';

export class ProductMapper {
  static tesloProductToEntity(tesloProduct: TesloProduct): Product {
    return {
      id: tesloProduct.id,
      description: tesloProduct.description,
      gender: tesloProduct.gender,
      images: tesloProduct.images.map(
        image => `${API_URL}files/product/${image}`,
      ),
      price: tesloProduct.price,
      sizes: tesloProduct.sizes,
      slug: tesloProduct.slug,
      stock: tesloProduct.stock,
      tags: tesloProduct.tags,
      title: tesloProduct.title,
    };
  }
}
