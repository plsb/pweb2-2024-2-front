import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Box, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from '../services/api';
import SaleForm from './SaleForm';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);

  // Função para buscar todas as vendas
  const fetchSales = async () => {
    try {
      const response = await api.get('/sales');
      setSales(response.data.sales);
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
    }
  };

  // Função para buscar todos os produtos
  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  // Função para buscar vendas por data
  const searchSalesByDate = async (date) => {
    if (!date) {
      fetchSales();
      return;
    }
    try {
      const response = await api.get(`/sales/search?date=${date}`);
      setSales(response.data.sales);
    } catch (error) {
      console.error('Erro ao pesquisar vendas por data:', error);
    }
  };

  // Função para criar uma nova venda
  const handleCreateSale = async (saleData) => {
    try {
      await api.post('/sales', saleData);
      setOpenCreateModal(false);
      fetchSales();
    } catch (error) {
      console.error('Erro ao criar venda:', error);
    }
  };

  // Função para atualizar uma venda
  const handleUpdateSale = async (saleData) => {
    try {
      await api.put(`/sales/${currentSale.id}`, saleData);
      setOpenEditModal(false);
      fetchSales();
    } catch (error) {
      console.error('Erro ao atualizar venda:', error);
    }
  };

  // Função para deletar uma venda
  const handleDeleteSale = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
      try {
        await api.delete(`/sales/${id}`);
        fetchSales();
      } catch (error) {
        console.error('Erro ao deletar venda:', error);
      }
    }
  };

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  // Handler para pesquisa por data
  const handleSearch = (e) => {
    const date = e.target.value;
    setSearchDate(date);
    searchSalesByDate(date);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Pesquisar por data"
          type="date"
          variant="outlined"
          value={searchDate}
          onChange={handleSearch}
          InputLabelProps={{ shrink: true }}
          sx={{ width: '300px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreateModal(true)}
        >
          Nova Venda
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Desconto</TableCell>
              <TableCell>Produtos</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.id}</TableCell>
                <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                <TableCell>{parseFloat(sale.totalAmount).toFixed(2)}</TableCell>
                <TableCell>{parseFloat(sale.discount).toFixed(2)}</TableCell>
                <TableCell>
                  {sale.Products.map(p => `${p.name} (Qtd: ${p.SaleProduct.quantity})`).join(', ')}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setCurrentSale({
                        id: sale.id,
                        saleDate: sale.saleDate.split('T')[0],
                        discount: sale.discount,
                        products: sale.Products.map(p => ({
                          productId: p.id,
                          unitPrice: p.SaleProduct.unitPrice,
                          quantity: p.SaleProduct.quantity
                        }))
                      });
                      setOpenEditModal(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteSale(sale.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para criar venda */}
      <SaleForm
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSave={handleCreateSale}
        products={products}
      />

      {/* Modal para editar venda */}
      <SaleForm
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSave={handleUpdateSale}
        initialData={currentSale}
        products={products}
      />
    </Box>
  );
};

export default SalesList;