import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Box, IconButton, Modal, Typography
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from '../services/api';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: null, description: '' });
  const [newCategory, setNewCategory] = useState('');

  const token = localStorage.getItem('token');

  // Função para buscar todas as categorias
  const fetchCategories = async () => {
    try {
      const response = await api.get(`categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  // Função para buscar categorias por descrição
  const searchCategories = async (term) => {
    if (!term) {
      fetchCategories();
      return;
    }
    try {
      const response = await api.get(`/categories/search?description=${term}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Erro ao pesquisar categorias:', error);
    }
  };

  // Função para criar uma nova categoria
  const handleCreateCategory = async () => {
    try {
      await api.post(
        `/categories`,
        { description: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCategory('');
      setOpenCreateModal(false);
      fetchCategories();
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
    }
  };

  // Função para atualizar uma categoria
  const handleUpdateCategory = async () => {
    try {
      await api.put(
        `categories/${currentCategory.id}`,
        { description: currentCategory.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenEditModal(false);
      fetchCategories();
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
    }
  };

  // Função para deletar uma categoria
  const handleDeleteCategory = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await api.delete(`categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchCategories();
      } catch (error) {
        console.error('Erro ao deletar categoria:', error);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handler para pesquisa com debounce básico
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchCategories(term);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Pesquisar categoria"
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
          Nova Categoria
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setCurrentCategory(category);
                      setOpenEditModal(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para criar categoria */}
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
            Criar Nova Categoria
          </Typography>
          <TextField
            label="Descrição"
            variant="outlined"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleCreateCategory}>
            Salvar
          </Button>
        </Box>
      </Modal>

      {/* Modal para editar categoria */}
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
            Editar Categoria
          </Typography>
          <TextField
            label="Descrição"
            variant="outlined"
            fullWidth
            value={currentCategory.description}
            onChange={(e) =>
              setCurrentCategory({ ...currentCategory, description: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleUpdateCategory}>
            Atualizar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CategoriesList;