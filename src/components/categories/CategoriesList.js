import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Box, IconButton, Modal, Typography
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { makeStyles } from '@mui/styles'; // Importa makeStyles
import api from '../../services/api';

// Define os estilos usando makeStyles
const useStyles = makeStyles({
  root: {
    padding: '16px', // Equivalente a theme.spacing(2)
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px', // Equivalente a theme.spacing(2)
  },
  searchInput: {
    width: '300px',
  },
  modalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: '#fff', // Substitui theme.palette.background.paper
    boxShadow: 24, // Substitui theme.shadows[24]
    padding: '32px', // Equivalente a theme.spacing(4)
  },
  modalTitle: {
    marginBottom: '16px', // Equivalente a theme.spacing(2)
  },
  modalTextField: {
    marginBottom: '16px', // Equivalente a theme.spacing(2)
  },
});

const CategoriesList = () => {
  const classes = useStyles(); // Aplica os estilos
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: null, description: '' });
  const [newCategory, setNewCategory] = useState('');

  // Função para buscar todas as categorias
  const fetchCategories = async () => {
    try {
      const response = await api.get(`categories`);
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
      const response = await api.get(`/categories/search?description=${term}`);
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
          { description: newCategory }
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
          { description: currentCategory.description }
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
        await api.delete(`categories/${id}`);
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
      <Box className={classes.root}>
        <Box className={classes.searchContainer}>
          <TextField
              label="Pesquisar categoria"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              className={classes.searchInput}
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
          <Box className={classes.modalBox}>
            <Typography variant="h6" className={classes.modalTitle}>
              Criar Nova Categoria
            </Typography>
            <TextField
                label="Descrição"
                variant="outlined"
                fullWidth
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className={classes.modalTextField}
            />
            <Button variant="contained" onClick={handleCreateCategory}>
              Salvar
            </Button>
          </Box>
        </Modal>

        {/* Modal para editar categoria */}
        <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <Box className={classes.modalBox}>
            <Typography variant="h6" className={classes.modalTitle}>
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
                className={classes.modalTextField}
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