import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Box, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from '../../services/api';
import ProductForm from './ProductForm'; // Importa o componente de formulário

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ id: null, name: '', categoryId: '', price: '' });

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const searchProducts = async (term) => {
    if (!term) {
      fetchProducts();
      return;
    }
    try {
      const response = await api.get(`/products/search?name=${term}`);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erro ao pesquisar produtos:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchProducts(term);
  };

  return (
      <Box sx={{ padding: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <TextField
              label="Pesquisar produto"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              sx={{ width: '300px' }}
          />
          <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenCreateModal(true)}
          >
            Novo Produto
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.Category?.description || 'Sem categoria'}</TableCell>
                    <TableCell>{parseFloat(product.price).toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton
                          color="primary"
                          onClick={() => {
                            setCurrentProduct({
                              id: product.id,
                              name: product.name,
                              categoryId: product.categoryId,
                              price: product.price,
                            });
                            setOpenEditModal(true);
                          }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                          color="error"
                          onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal para criar produto */}
        <ProductForm
            open={openCreateModal}
            onClose={() => setOpenCreateModal(false)}
            categories={categories}
            mode="create"
            fetchProducts={fetchProducts}
        />

        {/* Modal para editar produto */}
        <ProductForm
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            categories={categories}
            mode="edit"
            currentProduct={currentProduct}
            fetchProducts={fetchProducts}
        />
      </Box>
  );
};

export default ProductsList;