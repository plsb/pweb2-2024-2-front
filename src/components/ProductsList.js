import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Box, IconButton, Modal, Typography, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from '../services/api'; // Importa o serviço configurado

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ id: null, name: '', categoryId: '', price: '' });
  const [newProduct, setNewProduct] = useState({ name: '', categoryId: '', price: '' });

  // Função para buscar todos os produtos
  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  // Função para buscar todas as categorias (para o dropdown)
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  // Função para buscar produtos por nome
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

  // Função para criar um novo produto
  const handleCreateProduct = async () => {
    try {
      await api.post('/products', { ...newProduct, price: parseFloat(newProduct.price) });
      setNewProduct({ name: '', categoryId: '', price: '' });
      setOpenCreateModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    }
  };

  // Função para atualizar um produto
  const handleUpdateProduct = async () => {
    try {
      await api.put(`/products/${currentProduct.id}`, { ...currentProduct, price: parseFloat(currentProduct.price) });
      setOpenEditModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  // Função para deletar um produto
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

  // Handler para pesquisa
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
      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            Criar Novo Produto
          </Typography>
          <TextField
            label="Nome"
            variant="outlined"
            fullWidth
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={newProduct.categoryId}
              onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
              label="Categoria"
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Preço"
            variant="outlined"
            fullWidth
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleCreateProduct}>
            Salvar
          </Button>
        </Box>
      </Modal>

      {/* Modal para editar produto */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            Editar Produto
          </Typography>
          <TextField
            label="Nome"
            variant="outlined"
            fullWidth
            value={currentProduct.name}
            onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={currentProduct.categoryId}
              onChange={(e) => setCurrentProduct({ ...currentProduct, categoryId: e.target.value })}
              label="Categoria"
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Preço"
            variant="outlined"
            fullWidth
            type="number"
            value={currentProduct.price}
            onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleUpdateProduct}>
            Atualizar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProductsList;